const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   title: {
     type: String,
     trim: true,
      required: true
   },
   text: {
     type: String,
     trim: true,
     required: true
   },
   date: {
     type: Date,
     default: Date.now
    },
 // a post can have multiple comments, so it should be in a array.
 // all comments info should be kept in this array of this post.
  comments: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Comment'
   }],
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
 },
 hearts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
 }]
   })

   postSchema.virtual('url').get(function(){
      return '/posts/' + this._id
   })

 module.exports = mongoose.model('Post', postSchema);