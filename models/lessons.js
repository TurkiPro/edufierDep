const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
 name: {
      type: String,
      trim: true,
      required: true
   },
typeOfLesson: {
      type: Number,
      required: true
   },
   data:{
      type: Array
   },
   givePoints:{
      type: Boolean,
      required: true
   },
   pointsArray: {
         type: Array
   },
date: {
      type: Date,
      default: Date.now
   },
// each lesson can only relates to one course, so it's not in array
course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'courses'
   },
   quizzes: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Quiz'
     }]
 })

module.exports = mongoose.model('Lesson', lessonSchema);