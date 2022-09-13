const router = require('express').Router();
// npm install bcryptjs express-session connect-mongo
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

/* GET home page */
// SETUP GOOGLE ROUTES
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login',
	}) /* CREATE LOGIN AND DASHBOARD VIEWS AND ROUTES */,
	function (req, res) {
		// Successful authentication, redirect dashboard.
		res.redirect('/playlists');
	}
);

// END GOOGLE ROUTES

router.get('/signin', (req, res, next) => {
	res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
	const { email, password } = req.body;
	//validation
	if (password.length < 4) {
		res.render('auth/signin', { message: 'Password has to be 4  chars min' });
		return;
	}

	if (!email.includes('@') || !email.includes('.')) {
		res.render('auth/signin', { message: 'Please use a valid e-mail' });
		return;
	}

	// validation passed
	// check if the username is already used
	User.findOne({ email: email }).then((userFromDB) => {
		console.log(userFromDB);
		if (userFromDB !== null) {
			res.render('signup', { message: 'Your e-mail is already registred' });
		} else {
			// we can use that username
			// hash the password
			const salt = bcrypt.genSaltSync();
			const hash = bcrypt.hashSync(password, salt);
			// create the user
			User.create({ password: hash, email: email })
				.then((createdUser) => {
					console.log(createdUser);
					res.redirect('/playlists');
				})
				.catch((err) => {
					next(err);
				});
		}
	});
});

router.get('/login', (req, res, next) => {
	res.render('auth/login');
});

router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	User.findOne({ username: username }).then((userFromDB) => {
		if (userFromDB === null) {
			// username is not correct -> show the login form again
			res.render('auth/login', { message: 'Wrong credentials' });
			return;
		}
		// username is correct
		// check if the password from the input form matches the hash from the db
		if (bcrypt.compareSync(password, userFromDB.password)) {
			// the password is correct -> the user can be logged in
			// req.session is an object provided to us by 'express-session'
			// this is how we log the user in:
            req.login()
			console.log(userFromDB);
			res.redirect('/playlists');
		} else {
			res.render('auth/login', { message: 'Wrong credentials' });
			return;
		}
	});
});

router.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

module.exports = router;
