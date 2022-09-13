// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');
require('dotenv').config();

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

// default value for title local
const capitalized = require('./utils/capitalized');
const projectName = 'playlistApp';

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

//  session configuration

const session = require('express-session');
const MongoStore = require('connect-mongo');

// the SESSION_SECRET is a random letters
// maxAge is to set the time in this case one day
// all ather the same to register the session in MongoDB
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
		resave: true,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI
		}),
	})
);

// end of session configuration

// passport config

const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err);
		});
});

// register the local strategy (authentication using username and password)
passport.use(
	new LocalStrategy((username, password, done) => {
		// this logic will be executed when we log in
		User.findOne({ username: username }).then((user) => {
			if (user === null) {
				// username is not correct
				done(null, false, { message: 'Wrong Credentials' });
			} else {
				done(null, user);
			}
		});
	})
);

app.use(passport.initialize());
app.use(passport.session());

// end of passport config

// google strategy

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: 'http://localhost:3000/auth/google/callback',
		},
		(accessToken, refreshToken, profile, done) => {
			console.log(profile);
			User.findOne({
				googleId: profile.id,
			}).then((user) => {
				if (user !== null) {
					// pass the user to passport to serialize it
					done(null, user);
				} else {
					// we don't have this user in the db so we create it
					User.create({
						googleId: profile.id,
						username: profile.displayName,
						googleAvatarUrl: profile._json.picture,
						email: profile._json.email || '',
					}).then((user) => {
						done(null, user);
					});
				}
			});
		}
	)
);

// end of google strategy

// 👇 Start handling routes here
const index = require('./routes');
app.use('/', index);

const auth = require('./routes/auth');
app.use('/auth', auth);

const playlists = require('./routes/playlists');
app.use('/playlists', playlists);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
