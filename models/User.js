const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String, /* -> Ideally, should be unique, but its up to you */
      require:true
    },
    avatarUrl: String,
    googleId: String,
    googleAvatarUrl: String,
    password: String,
    email: {
      type: String,
      unique: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    playlists: [{
      type: Schema.Types.ObjectId,
		  // this refers to the model the id above belongs to
		  ref: 'Playlist'
    }],
    videoNotes:[{
      id: String,
      // type: Schema.Types.ObjectId,
		  // this refers to the model the id above belongs to
		  // ref: 'Video',
      notes:[{
        time: String,
        note:String,
        date: String
      }]
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    versionKey: false, //   versionKey: false,  remove version _V
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
