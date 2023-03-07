const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
 name: {
      type: String,
      trim: true,
      required: true
   },
   typeOfQuiz: {
      type: Number,
      required: true
   },
   data:{
      type: Array
   },
   answer: {
      type: String,
      trim: true,
      required: true
   },
date: {
      type: Date,
      default: Date.now
   },
// each quiz can only relates to one lesson, so it's not in array
lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
   }
 })

module.exports = mongoose.model('Quiz', quizSchema);