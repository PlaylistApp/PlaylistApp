const router = require("express").Router();

const User = require('../models/User');
const Video = require('../models/Video');
const Playlist = require('../models/Playlists')


router.get('/create-playlist', (req, res, next) => {
	res.render('playlists/create')
})

router.post('/create-playlist', (req, res, next) => {
    const user = req.user.id
	const { title, description } = req.body
    
	Playlist.create({  title, description, playlistCreator: user })
		.then(createdVideo => {
			console.log(createdVideo)
			res.redirect(`/playlists/${createdVideo._id}`)
		})
		.catch(err => next(err))
	
})

router.get('/:playlistID', (req, res, next) => {
    const user = req.user.id
    const playlistID = req.params.playlistID

	let buttons = ''	

    Playlist.findById( playlistID )
		.populate('playlistCreator')
		.then(playlist => {
			let playlistUserName = playlist.playlistCreator.username ||  playlist.playlistCreator.email

			if(playlist.playlistCreator.id === user){
				buttons += `<a href="#"> ❌ Delete </a>
							<a href="#"> 📝 Edit</a>
							<a href="#"> ➕ Add Video </a>`
			}

			res.render(`playlists/view`,{ playlist, buttons, playlistUserName}) 
		})
		.catch(err => next(err))
});

router.get('/:playlistID/add-video', (req, res, next) => {
    const playlistID = req.params.playlistID
	res.render('videos/add',{playlistID})
});

router.post('/:playlistID/add-video', (req, res, next) => {
    const playlistID = req.params.playlistID
    // const playlistCreator = res.user._id
	console.log(req.user)
	const { title,videoUrl,videoAuthor, description } = req.body
    
	Video.create({  title,videoUrl,videoAuthor, description, playlistID, playlistCreator })
		.then(createdVideo => {
			console.log(createdVideo)
			res.redirect(`/playlists/${playlistID}`)
		})
		.catch(err => next(err))
});


module.exports = router;