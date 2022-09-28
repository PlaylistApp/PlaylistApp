const router = require('express').Router();
// npm install bcryptjs express-session connect-mongo
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

/* GET home page */
// SETUP GOOGLE ROUTES
// router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// router.get(
// 	'/google/callback',
// 	passport.authenticate('google', {
// 		failureRedirect: '/login',
// 	}) /* CREATE LOGIN AND DASHBOARD VIEWS AND ROUTES */,
// 	function (req, res) {
// 		// Successful authentication, redirect dashboard.
// 		res.redirect('/playlists');
// 	}
// );

// END GOOGLE ROUTES

router.get('/signin', (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	res.render('auth/signin',{userIsLogged, userIsNotLogged});
});

router.post('/signin', (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	const { email, password } = req.body;
	//validation
	if (password.length < 4) {
		res.render('auth/signin', { message: 'Password has to be 4  chars min' ,userIsLogged, userIsNotLogged});
		return;
	}

	if (!email.includes('@') || !email.includes('.')) {
		res.render('auth/signin', { message: 'Please use a valid e-mail',userIsLogged, userIsNotLogged });
		return;
	}

	// validation passed
	// check if the username is already used
	User.findOne({ email: email }).then((userFromDB) => {
		console.log(userFromDB);
		if (userFromDB !== null) {
			res.render('signup', { message: 'Your e-mail is already registred',userIsLogged, userIsNotLogged });
		} else {
			// we can use that username
			const username = email.split('@')[0]
			// hash the password
			const salt = bcrypt.genSaltSync();
			const hash = bcrypt.hashSync(password, salt);
			// create the user
			User.create({ password: hash, email, username })
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
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	res.render('auth/login',{userIsLogged, userIsNotLogged});
});

// router.post('/login', passport.authenticate('local', {
// 	successRedirect: '/playlists',
// 	failureRedirect: '/auth/login'
// }));

router.post('/login', (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	const { username, password } = req.body;
	User.findOne({ username: username }).then((userFromDB) => {
		if (userFromDB === null) {
			// username is not correct -> show the login form again
			res.render('auth/login', { message: 'Oops! Wrong credentials', userIsLogged, userIsNotLogged});
			return;
		}
		// username is correct
		// check if the password from the input form matches the hash from the db
		if (bcrypt.compareSync(password, userFromDB.password)) {
			// the password is correct -> the user can be logged in
			// req.session is an object provided to us by 'express-session'
			// this is how we log the user in:
            req.session.user = userFromDB
			console.log(userFromDB);
			res.redirect('/playlists');
		} else {
			res.render('auth/login', { message: 'Oops! Wrong credentials',userIsLogged, userIsNotLogged });
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
