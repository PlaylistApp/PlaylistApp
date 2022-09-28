const router = require('express').Router();

const User = require('../models/User');
const { isLogged } = require('../utils/middlewares')

/* GET home page */
router.get('/', (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	}
	res.render('index',{userIsLogged, userIsNotLogged});
});

router.get('/profile', isLogged, (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	}
	let user = req.session.user._id;
	User.findById(user)
		.then((user) => {
			res.render('profile/profile', { user, userIsLogged, userIsNotLogged });
		})
		.catch((err) => next(err));
});

router.get('/profile/edit/:userID', isLogged, (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	}
	let user = req.params.userID;
	User.findById(user)
		.then((user) => {
			res.render('profile/edit', { user, user, userIsLogged, userIsNotLogged });
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
