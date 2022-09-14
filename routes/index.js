const router = require('express').Router();

const User = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/playlists', (req, res, next) => {
	res.render('playlists');
});

router.get('/profile', (req, res, next) => {
	let user = req.user.id;
	User.findById(user)
		.then((user) => {
			res.render('profile/profile', { user });
		})
		.catch((err) => next(err));
});

router.get('/profile/edit/:userID', (req, res, next) => {
	let user = req.params.userID;
	User.findById(user)
		.then((user) => {
			res.render('profile/edit', { user });
		})
		.catch((err) => next(err));
});

router.post('/profile/edit/:userID', (req, res, next) => {
	let user = req.params.userID;
	const {username, email} = req.body
	User.findByIdAndUpdate(user,{username, email})
		.then((user) => {
			res.redirect('/profile');
		})
		.catch((err) => next(err));
});


module.exports = router;
