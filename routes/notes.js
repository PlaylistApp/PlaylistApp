const router = require('express').Router();

const User = require('../models/User');

/* GET home page */
router.post('/:userID/:videoID', (req, res, next) => {
    const {time,note,date,user} = req.body
    let newNote = {
        id:req.params.videoID,
        notes:[{
           time: time,
           note:note,
           date:date,
           user:user
           }]
       }
    
    User.findById(req.params.userID).populate('videoNotes').then((user) =>{
        let videoSought = false
        for (let i = 0; i < user.videoNotes.length; i++) {
            if(user.videoNotes[i].id === req.params.videoID){
                videoSought = true
            }
        }
        if(videoSought){
            User.findById(req.params.userID).populate('videoNotes')
            .updateOne({'videoNotes.id':req.params.videoID},
                { $push: {'videoNotes.0.notes': newNote.notes[0] } })
            .then(() =>{
                User.findById(req.params.userID).populate('videoNotes')
                .then((user) =>{
                    let result = user.videoNotes.filter(obj=>{return obj.id===req.params.videoID})
                    result[0].id = user.username
                    res.send(result)
                    }).catch((err) => next(err));

            }).catch((err) => next(err));
        }else{
            User.findById(req.params.userID).populate('videoNotes')
            .updateOne(
                { $push: {'videoNotes': newNote } }).then(() =>{
                User.findById(req.params.userID).populate('videoNotes')
                .then((user) =>{
                    let result = user.videoNotes.filter(obj=>{return obj.id===req.params.videoID})
                    result[0].id = user.username
                    res.send(result)
                    }).catch((err) => next(err));
            }).catch((err) => next(err))}
        
      }).catch((err) => next(err));
    
});

router.get('/:userID/:videoID', (req, res, next) => {
    User.findById(req.params.userID).populate('videoNotes').then((user) =>{
        let videoSought = false
        for (let i = 0; i < user.videoNotes.length; i++) {
            if(user.videoNotes[i].id === req.params.videoID){
                videoSought = true
            }
        }
        if(videoSought){
            User.findById(req.params.userID).populate('videoNotes')
            .then(() =>{
                User.findById(req.params.userID).populate('videoNotes')
                .then((user) =>{
                    let result = user.videoNotes.filter(obj=>{return obj.id===req.params.videoID})
                    result[0].id = user.username
                    res.send(result)
                    }).catch((err) => next(err));

            }).catch((err) => next(err));
        }else{
            res.send([])
        }
        
      }).catch((err) => next(err));
    
});

//VER COMO crear un elemento en el array de videoNotes y lusgo buscarlo y agreagar la nota
// devolver las notas y pintarlas en pantalla



module.exports = router;