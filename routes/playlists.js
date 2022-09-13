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

router.get('/edit/:playlistID', (req, res, next) => {
	Playlist.findById(req.params.playlistID)
		.then(playlist => {
			res.render('playlists/edit', { playlist })
		})
		.catch(err => next(err))
});

router.post('/edit/:playlistID', (req, res, next) => {
	const { title, description } = req.body
	console.log(req.params.playlistID)
	Playlist.findByIdAndUpdate(req.params.playlistID,{ title, description})
	.then(playlist=>{
		res.redirect(`/playlists/${playlist._id}`)
	})
	.catch(err => next(err))
})

router.get('/delete/:playlistID', (req, res, next) => {
	Playlist.findByIdAndDelete(req.params.playlistID)
		.then(() => {
			res.redirect('/playlists')
		})
		.catch(err => next(err))
});


router.get('/:playlistID', (req, res, next) => {
    const user = req.user.id
    const playlistID = req.params.playlistID

	let buttons = ''	

    Playlist.findById( playlistID )
		.populate('playlistCreator')
		.then(playlist => {
			let playlistUserName = playlist.playlistCreator.username ||  playlist.playlistCreator.email

			if(playlist.playlistCreator.id === user){
				buttons += `<a href="/playlists/delete/${playlistID}"> ❌ Delete </a>
							<a href="/playlists/edit/${playlistID}"> 📝 Edit</a>
							<a href="/playlists/add-video/${playlistID}"> ➕ Add Video </a>`
			}

			res.render(`playlists/view`,{ playlist, buttons, playlistUserName}) 
		})
		.catch(err => next(err))
});

/* VIDEOS ROUTES */

router.get('/add-video/:playlistID', (req, res, next) => {
    const playlistID = req.params.playlistID
	res.render('videos/add',{playlistID})
});

router.post('/add-video/:playlistID', (req, res, next) => {
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