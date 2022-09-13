const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const playlistSchema = new Schema(
	{
        title: {
			type: String,
			require: true,
		},
        description: String,
        img: String,
        // playlistUrl: String,
        // playlistAuthor: String,
        // creatorID:{
        //     type: Schema.Types.ObjectId,
        //     // this refers to the model the id above belongs to
        //     ref: 'User'
        // },
        playlistCreator: {
            type: Schema.Types.ObjectId,
            // this refers to the model the id above belongs to
            ref: 'User'
        },
        videos:[{
            type: Schema.Types.ObjectId,
            // this refers to the model the id above belongs to
            ref: 'Video'
        }]
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		versionKey: false, //   versionKey: false,  quita el key de cada elemento
		timestamps: true,
	}
);

const Playlist = model('Playlist', playlistSchema);

module.exports = Playlist;