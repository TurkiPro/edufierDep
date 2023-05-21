const Error = require("../middleware/error-handler");
const { responseHandler } = require("../middleware/response-handler.js");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../service/mongo.service");
const Completions = require("../models/completions");
const userRecords = require("../models/userRecords");
const point = require("../controllers/point");

const addCompletion = async (actType, actId, user, points, maxTries, solved) => {
    const checkCompeltion = Completions.exists( {activityID: actId} ,async (error, result)=>{
        if (error){
          console.log(error)
          return false;
        } else {
          //result is true if Data already exists, null if not
          if(result){
            const record_exist = await userRecords.find().and([{completionId: result}, {userId: user}])
            const recordUser = await userRecords.findById(record_exist)
            if(record_exist.length != 0){
              if(maxTries <= recordUser.numberOfTires){
                console.log('hi max')
                return false;
              }else{
              await userRecords.findByIdAndUpdate(record_exist, { $inc: {'numberOfTires': 1 } })
                .exec(async function (err, results) {
                    if (err) { console.log(err); }
                    console.log(results+'inloop')
                    if(maxTries == (results.numberOfTires+1)){
                      const completion = await Completions.findById(result._id);
                      await point.assignPoints(points[results.numberOfTires], completion._id, user)
                    }else if(solved){
                      const completion = await Completions.findById(result._id);
                      await point.assignPoints(points[results.numberOfTires], completion._id, user)
                    }
                  }
                );
            }
            }else{
              const user_record = new userRecords({
                completionId: result,
                userId: user
              })
              await user_record.save()
              console.log('here1'+result)
              const completion = await Completions.findById(result._id);
              await completion.completedUsers.push(user_record._id);
              const check = await completion.save(async function(err) {
                if(err) {
                  console.log(err)
                  return false;
                }
                console.log('happy1'+completion)
                if(solved){
                  await point.assignPoints(points[0], completion._id, user)
                }
                return true;
                })
                if(check == false){
                  return false;
                }else{
                  return true
                }
              }
          }
          else{
            // if completion does not exist, create a new one with all other stuff.
            const check = await createCompletion(actType, actId, user, points, solved);

            if(check == false){
              return false;
            }else{
              return true
            }
          }
        }
      });
      if(checkCompeltion == false){
        return false;
      }else{
        console.log('here:)')
        return true
      }
}


const addPoints = async () =>{
  
}

const createCompletion = async (actType, actId, user, points, solved) =>{
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
  await user_record.save()
  console.log('here2'+completion)
  console.log(user_record)
  completion.completedUsers.push(user_record._id)
  await completion.save(async function(err) {
    if(err) {
      console.log(err)
      return false;
    }
      console.log('happy2')

      if(solved){
        await point.assignPoints(points[0], completion._id, user)
      }
      
      return true;
    })
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
