const Error = require("../middleware/error-handler");
const { responseHandler } = require("../middleware/response-handler.js");
const User = require("../models/users");
const Point = require("../models/points");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../service/mongo.service");
const Completions = require("../models/completions");
const userRecords = require("../models/userRecords");


const addCompletion = (actType, actId, user) => {
    Completions.exists( {activityID: actId} ,async (error, result)=>{
        if (error){
          console.log(error)
          return false;
        } else {
          //result is true if Data already exists, null if not
          if(result){
            const user_record = new userRecords({
              completionId: result,
              userId: user
            })
            await user_record.save()
            console.log('here1'+result)
            console.log(user_record)
            const completion = await Completions.findById(result._id);
            await completion.completedUsers.push(user_record._id);
            await completion.save(function(err) {
              if(err) {console.log(err)}
              console.log('happy1'+completion)
              })
                
            return true;
          }
          else{
            const completion = new Completions({
              activityType: actType,
              activityID: actId
            })
            // save quizz
            await completion.save();
            const user_record = new userRecords({
              completionId: completion._id,
              userId: user
            })
            console.log('here2'+completion)
            console.log(user_record)
            completion.completedUsers.push(user_record._id)
            await completion.save(function(err) {
              if(err) {console.log(err)}
                console.log('happy2')
              })
            return true;
          }
        }
      });
}

module.exports ={

    index: (req, res) => {
        Course.find()
        .exec(function(err, results) {
         if(err) {console.log(err)}
        //  res.render('course/index', {title: 'All courses', courses: results})
        console.log(results)
      })
    },
    addCompletion

}
