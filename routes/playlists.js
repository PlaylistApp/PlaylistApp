const router = require('express').Router();

const { isLogged } = require('../utils/middlewares')

const User = require('../models/User');
const Video = require('../models/Video');
const Playlist = require('../models/Playlists');


router.get('/', (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	}
	Playlist.find()
	.populate('playlistCreator').populate('videos')
	.then((playlists) => {
		res.render('playlists', {playlists, userIsLogged, userIsNotLogged});
	})
	.catch((err) => next(err));
	
});

router.get('/create-playlist', isLogged, (req, res, next) => {let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	}
	res.render('playlists/create', {userIsLogged, userIsNotLogged});
});

router.post('/create-playlist', (req, res, next) => {
	let user = null
	if (req.session.user!==undefined) {
		user = req.session.user._id 
	}
	const { title, description } = req.body;

	Playlist.create({ title, description, playlistCreator: user })
		.then((createdVideo) => {
			res.redirect(`/playlists/${createdVideo._id}`);
		})
		.catch((err) => next(err));
});

router.get('/edit/:playlistID',isLogged, (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	
	Playlist.findById(req.params.playlistID)
		.then((playlist) => {
			res.render('playlists/edit', { playlist,userIsLogged, userIsNotLogged });
		})
		.catch((err) => next(err));
});

router.post('/edit/:playlistID', (req, res, next) => {
	const { title, description } = req.body;
	Playlist.findByIdAndUpdate(req.params.playlistID, { title, description })
		.then((playlist) => {
			res.redirect(`/playlists/${playlist._id}`);
		})
		.catch((err) => next(err));
});

router.get('/delete/:playlistID',isLogged, (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	Playlist.findByIdAndDelete(req.params.playlistID)
		.then(() => {
			res.redirect('/playlists',{userIsLogged, userIsNotLogged});
		})
		.catch((err) => next(err));
});


router.get('/:playlistID', (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	let user = null
	if (req.session.user!==undefined) {
		user = req.session.user._id 
	}
	const playlistID = req.params.playlistID;

	let playlistButtons = '';
	let ownerInterface = false;
	let userInterface = true;
	let videosAvailable = false

	Playlist.findById(playlistID)
		.populate('playlistCreator')
		.populate('videos')
		.then((playlist) => {
			let playlistUserName =
				playlist.playlistCreator.username || playlist.playlistCreator.email;

			if (playlist.playlistCreator.id === user) {
				playlistButtons += `<a href="/playlists/delete/${playlistID}"> ❌ Delete </a>
							<a href="/playlists/edit/${playlistID}"> 📝 Edit</a>
							<a href="/playlists/add-video/${playlistID}"> ➕ Add Video </a>`;
				ownerInterface = true;
				userInterface = false;
			}
			res.render(`playlists/view`, {
				playlist,
				playlistButtons,
				playlistUserName,
				ownerInterface,
				userInterface,userIsLogged, userIsNotLogged
			});
		})
		.catch((err) => next(err));
});

/* VIDEOS ROUTES */

router.get('/add-video/:playlistID',isLogged, (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	const playlistID = req.params.playlistID;
	res.render('videos/add', { playlistID,userIsLogged, userIsNotLogged });
});

router.post('/add-video/:playlistID', (req, res, next) => {
	let playlistCreator = null
	if (req.session.user!==undefined) {
		playlistCreator = req.session; 
	}
	const playlistID = req.params.playlistID;
	const { title, videoUrlnotEmbed, videoAuthor, description } = req.body;
	let videoCode = videoUrlnotEmbed.slice(videoUrlnotEmbed.indexOf('v=') + 2);
	const videoUrl = `https://www.youtube.com/embed/${videoCode}`;

	Video.create({
		title,
		videoUrl,
		videoAuthor,
		description,
		playlistID,
		playlistCreator,
	})
		.then((createdVideo) => {
			Playlist.findByIdAndUpdate(playlistID, {
				$push: { videos: createdVideo._id },
			}).then(() => {
				res.redirect(`/playlists/${playlistID}`);
			});
		})
		.catch((err) => next(err));
});

router.get('/delete-video/:playlistID/:videoID',isLogged, (req, res, next) => {
	Video.findByIdAndDelete(req.params.videoID)
		.then((videoDeleted) => {
			Playlist.findByIdAndUpdate(req.params.playlistID, {
				$pull: { videos: videoDeleted._id },
			}).then(() => {
				res.redirect(`/playlists/${req.params.playlistID}`);
			});
		})
		.catch((err) => next(err));
});

router.get('/edit-video/:playlistID/:videoID', isLogged,(req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	} 
	Video.findById(req.params.videoID)
		.then((video) => {
			res.render('videos/edit', { video,userIsLogged, userIsNotLogged });
		})
		.catch((err) => next(err));
});

router.post('/edit-video/:playlistID/:videoID', (req, res, next) => {
	let user = null
	if (req.session.user!==undefined) {
		user = req.session.user._id 
	} 
	const { title, videoUrlnotEmbed, videoAuthor, description } = req.body;
	let videoUrl = videoUrlnotEmbed;
	if (videoUrlnotEmbed.includes('v=')) {
		let videoCode = videoUrlnotEmbed.slice(videoUrlnotEmbed.indexOf('v=') + 2);
		videoUrl = `https://www.youtube.com/embed/${videoCode}`;
	}
	Video.findByIdAndUpdate(req.params.videoID, {
		title,
		videoUrl,
		videoAuthor,
		description,
	})
		.then((video) => {
			res.redirect(`/playlists/${video.playlistID._id}`);
		})
		.catch((err) => next(err));
});

router.get("/:playlistID/:videoID", (req, res, next) => {
	let userIsLogged = false
	let userIsNotLogged = true
	if (req.session.user!==undefined) {
		userIsLogged = true
		userIsNotLogged = false
	}
	let userID = null
	if (req.session.user!==undefined) {
		userID = req.session.user._id 
	}
	Video.findById(req.params.videoID)
	// .populate('playlistID')
	.populate(({
		path: 'playlistID',
		populate: {
		  path: "videos",
		//   strictPopulate: false
		}
	  }))
	.populate('playlistCreator')
		.then((video) => {
			User.findById(userID).populate(({
				path: 'videoNotes',
				
			  })).then((user) =>{
				let notes = []
				if(user){
					let result = user.videoNotes.filter(obj=>{return obj.id===req.params.videoID})
					
					
					if (result[0]) {
						notes= result[0].notes
					}
				}
				res.render("videos/view", { video,user,notes,userID, userIsLogged, userIsNotLogged });
			  })
			
		})
		.catch((err) => next(err));
  });

module.exports = router;
