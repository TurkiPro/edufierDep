const express = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Course = require("../models/courses");
const Lesson = require("../models/lessons");
const Quiz = require("../models/quizzes");
const admin = require("../middleware/admin");
const router = express.Router();       


      // get user name from db
        // fetchName = id => {
        //   return User.findOne({_id: id}).then(user => user.name);
        // };
        router.get('/lesson/:id/quizzes/', async (req, res) => {
            const lessonId = req.params.id;
            await Lesson.findById(lessonId)                    
                .populate('quizzes')
                .exec(async function (err, results) {
                  if (err) { console.log(err); };
                  res.render('admin/quizzes/index', {title: 'All quizzes', lessons: results})
                })
           })
        router.get('/course/:id/lesson/new',admin.verifyAdministration, (req, res) => {
            res.render('lesson/create', {title: 'Create a lesson', courseId: req.params.id})
           })
        // Create and Post lessons
        router.post('/course/:id/lesson/new',admin.verifyAdministration, async (req, res) => {
            // find out which course you are adding a lesson to
                const id = req.params.id;
            // find the user
                const user = check_user(req);
                if(user === null){
                    res.redirect('/')
                }
            // get the lesson info and record course id
                const lesson = new Lesson({
                name: req.body.name,
                typeOfLesson: req.body.lessonType,
                data: [req.body.information],
                course: id
            })
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

        router.get('/lesson/:id', async (req, res) => {
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
                            return res.render('lesson/show', {title: lesson.name, information: lesson, quiz: lesson.quizzes[0], nextLesson: checker})
                        }
                        return res.render('lesson/show', {title: lesson.name, information: lesson, quiz: undefined, nextLesson: checker})
                    }).catch(error => {
                        return res.json({ error: error })
                    })  
                })
                .catch(error => {
                    return res.json({ error: error })
                })
        });

        router.get('/', (req, res) => {
            Lesson.find()
               .exec(function(err, results) {
                if(err) {console.log(err)}
                res.render('lesson/index', {title: 'All Lessons', courses: results})
             })
         });

        router.get('/lesson/:id/next', async (req, res) => {
            let lessonId = req.params.id;
            await Lesson.findById(lessonId)
                .then(async lesson => {
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

        router.delete('/lesson/:id',admin.verifyAdministration, async (req, res) => {
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
         });

        function check_user(header){
        let token = header.cookies.Authorization;
        if (!token) {
            next();
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