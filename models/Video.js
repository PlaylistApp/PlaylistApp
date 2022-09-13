const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const videoSchema = new Schema(
	{
        title: {
			type: String,
			require: true,
		},
        description: String,
        videoUrl: String,
        videoAuthor: String,
        playlistID:{
            type: Schema.Types.ObjectId,
            // this refers to the model the id above belongs to
            ref: 'Playlist'
        },
        playlistCreator: {
            type: Schema.Types.ObjectId,
            // this refers to the model the id above belongs to
            ref: 'User'
        }
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		versionKey: false, //   versionKey: false,  quita el key de cada elemento
		timestamps: true,
	}
);

const Video = model('Video', videoSchema);

module.exports = Video;