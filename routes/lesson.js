const express = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Course = require("../models/courses");
const Lesson = require("../models/lessons");
const Quiz = require("../models/quizzes");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth")
const completion = require("../controllers/completion");
const router = express.Router();       

const multer = require("multer");

const fileFilterMiddleware = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"])
    console.log(file)
    if ((file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") && fileSize <= 1282810) {
        cb(null, true)
    } else if(file.mimetype === "audio/mpeg" && fileSize <= 2282810){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({dest: 'public/uploads/courses/lessons', fileFilter: fileFilterMiddleware});


      // get user name from db
        // fetchName = id => {
        //   return User.findOne({_id: id}).then(user => user.name);
        // };
        router.get('/lesson/:id/quizzes/:page', auth.verifyAuth, admin.verifyAdministration, async (req, res) => {
            let limit = 10
            let page = req.params.page || 1
            const lessonId = req.params.id;
            await Lesson.findById(lessonId)                    
                .populate('quizzes')
                .skip((limit * page) - limit)
                .limit(limit)
                .exec(async function (err, results) {
                  if (err) { console.log(err); };
                  count = results.quizzes.length;
                  res.render('admin/quizzes/index', {title: 'All quizzes', lessons: results, user: req.userType, current: page, pages: Math.ceil(count / limit)})
                })
           })
        router.get('/course/:id/lesson/new', auth.verifyAuth, admin.verifyAdministration, (req, res) => {
            res.render('lesson/create', {title: 'Create a lesson', courseId: req.params.id, user: req.userType})
           })
        // Create and Post lessons
        router.post('/course/:id/lesson/new',upload.fields([{ name: 'interAud', maxCount: 1 }, { name: 'interImg', maxCount: 1 }]), auth.verifyAuth, admin.verifyAdministration, async (req, res) => {
            let lesson;
            let dataArray = [];
            //used as an object for data array
            let tempLessonData;
            // find out which course you are adding a lesson to
            const id = req.params.id;
            const isTrueSet = (String(req.body.pointstf).toLowerCase() === 'true');
            let points = [];
            for (let index = 0; index < req.body.tries; index++) {
                points[index] = req.body.points[index];
            }
            // set the lesson info and record course id in lesson object
            switch(req.body.lessonType){
                case '1':
                    //video type lesson
                    lesson = new Lesson({
                        name: req.body.name,
                        typeOfLesson: req.body.lessonType,
                        data: [req.body.information],
                        givePoints: isTrueSet,
                        maxTries: req.body.tries,
                        pointsArray: points,
                        course: id
                    })
                case '2':
                case '3':
                    //cicle and cards type lesson
                    for (let index = 0; index < req.body.information.length; index = index+2) {
                        tempLessonData = {
                            title: req.body.information[index],
                            information: req.body.information[index+1]
                        }
                        dataArray.push(tempLessonData);
                    }
                    lesson = new Lesson({
                        name: req.body.name,
                        typeOfLesson: req.body.lessonType,
                        data: dataArray,
                        givePoints: isTrueSet,
                        maxTries: req.body.tries,
                        pointsArray: points,
                        course: id
                    })
                    console.log(lesson)
                    break;
                case '4':
                    //three cards type lesson
                    break;
                case '5':
                    //interactive image type lesson
                    console.log(req.body.yPos);
                    lesson = new Lesson({
                        name: req.body.name,
                        typeOfLesson: req.body.lessonType,
                        data: [req.files['interImg'][0].filename,req.files['interAud'][0].filename,req.body.information,req.body.xPos, req.body.yPos],
                        givePoints: isTrueSet,
                        maxTries: req.body.tries,
                        pointsArray: points,
                        course: id
                    })
                    break;
            }
            // save lesson
            await lesson.save();
            // get this particular course
            const courseRelated = await Course.findById(id);
            // push the comment into the post.comments array
            courseRelated.lessons.push(lesson);
            // save and redirect...
            await courseRelated.save(function(err) {
            if(err) {console.log(err)}
            res.redirect('/lessons/')
            })

        })

        router.get('/lesson/:id',auth.verifyAuth, async (req, res) => {
            let lessonId = req.params.id;
            let checker = undefined;
            await Lesson.findById(lessonId)
                .then(async lesson => {
                    await Course.findById(lesson.course).then(course =>{
                        for (let i = 0; i < course.lessons.length; i++) {
                            if(course.lessons[i]._id == lessonId){
                                if(course.lessons[i+1] !== undefined){
                                    checker = true;
                                }
                            }
                        }
                        if (lesson.quizzes.length){
                            return res.render('lesson/show', {title: lesson.name, information: lesson, quiz: lesson.quizzes[0], nextLesson: checker, user: req.userType})
                        }
                        return res.render('lesson/show', {title: lesson.name, information: lesson, quiz: undefined, nextLesson: checker, user: req.userType})
                    }).catch(error => {
                        return res.json({ error: error })
                    })  
                })
                .catch(error => {
                    return res.json({ error: error })
                })
        });

        router.get('/:page', auth.verifyAuth, admin.verifyAdministration, (req, res) => {
            let limit = 10
            let page = req.params.page || 1
            Lesson
                .find({})
                .skip((limit * page) - limit)
                .limit(limit)
               .exec(function(err, results) {
                if(err) {console.log(err)}
                Lesson
                    .count()
                    .exec(function(err, count) {
                    if(err) {console.log(err)}
                    res.render('lesson/index', {title: 'All Lessons', courses: results, user: req.userType, current: page, pages: Math.ceil(count / limit)})
             })
         })});

        router.get('/lesson/:id/next',auth.verifyAuth, async (req, res) => {
            let lessonId = req.params.id;
            const user = check_user(req);
            if(user === null){
                res.redirect('/')
            }
            await Lesson.findById(lessonId)
                .then(async lesson => {
                    await completion.addCompletion('lesson', lesson._id, user, lesson.pointsArray, lesson.maxTries, true).then(result =>{
                        if(result == true){
                            console.log('done correct lesson')
                            // res.json({ message: 'Good job!' })
                        }
                    })
                    .catch(error =>{
                        console.log('hi')
                        res.status(400).json({ error: error })
                    })
                    console.log('debg lesson')
                    await Course.findById(lesson.course).then(course =>{
                    //    let nextLesson = Course.aggregate([{
                    //     $match: { _id: course._id }
                    //     },
                    //     {$project: 
                    //         {
                    //             index: {
                    //                  $map: { input: "$lessons", as: "lesson", in: [ {$eq: ["$$lesson", lesson._id] } ] } 
                    //             }
                    //         }
                    //     }
                    //     ]).exec((err, locations) => {
                    //         if (err) throw err;
                    //         console.log('here3')
                    //         console.log(locations);
                    //         res.json({locations})
                    //     })
                    if (course.lessons.length){
                        for (let i = 0; i < course.lessons.length; i++) {
                            if(course.lessons[i]._id == lessonId){
                                if(course.lessons[i+1] !== undefined){
                                    return res.redirect('/lessons/lesson/'+course.lessons[i+1]) 
                                }else{
                                    return res.redirect('/lessons/lesson/'+lessonId) 
                                }
                            }
                        }
                    }
                    })
                    
                })
        });

        router.get('/lesson/:id/edit', auth.verifyAuth, admin.verifyAdministration, async (req, res) =>{
            let lessonId = req.params.id
            await Lesson.findById(lessonId).exec(async function (err, results) {
              if (err) { console.log(err); };
              res.render('admin/lessons/edit', { title: 'Editing '+ results.name, lesson: results, user: req.userType });
            })
          })
          
          router.put('/lesson/:id/edit', auth.verifyAuth, admin.verifyAdministration, async (req, res) => {
            let lessonId = req.params.id
            const isTrueSet = (String(req.body.pointstf).toLowerCase() === 'true');
            let points = [];
            for (let index = 0; index < req.body.tries; index++) {
                points[index] = req.body.points[index];
            }
            const lesson = await Lesson.findById(lessonId)
            lesson.name = req.body.name;
            lesson.data = [req.body.information];
            lesson.givePoints = isTrueSet;
            lesson.maxTries = req.body.tries;
            lesson.pointsArray = points;
            try {
              const result = await lesson.save();
              console.log(result); // result
              res.status(200).json({message: "success"});
            } catch (err) {
              console.error("something goes wrong");
              res.json({ error: error })
            }
              res.redirect('/lessons/1')
          })

        router.delete('/lesson/:id', auth.verifyAuth, admin.verifyAdministration, async (req, res) => {
            let lessonId = req.params.id;
            await Lesson.findByIdAndDelete(lessonId)
                .then(async lesson => {
                    await Course.findById(lesson.course).then(course => {
                        course.lessons.pull(lessonId);
                    })
                    if (lesson.quizzes.length){
                        for (const quiz of lesson.quizzes) {
                            await Quiz.findByIdAndDelete(quiz._id)
                        }
                    }
                })
                .catch(error => {
                    res.json({ error: error })
                })
                res.status(200).json({message: 'success'})
         });

        function check_user(header){
        let token = header.cookies.Authorization;
        if (!token) {
            return null
        }
        try {
            if (token.includes("Bearer")) {
                token = token.substr(7);
            }
            //if can verify the token, set req.user and pass to next middleware
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
            const user = decoded._id;
            return user;
        } catch (ex) {
            console.log(ex + 'test')
            return null;
        }
        }


module.exports = router;