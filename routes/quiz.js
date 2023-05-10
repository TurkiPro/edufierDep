const express = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Lesson = require("../models/lessons");
const Quizz = require("../models/quizzes");
const completion = require("../controllers/completion");
const router = express.Router();       


      // get user name from db
        // fetchName = id => {
        //   return User.findOne({_id: id}).then(user => user.name);
        // };
        router.get('/lesson/:id/quiz/new', (req, res) => {
            res.render('quiz/create', {title: 'Create a quizz', lessonId: req.params.id})
           })
        // Create and Post quizzes
        router.post('/lesson/:id/quiz/new', async (req, res) => {
            // find out which lesson you are adding a quizz to
                const id = req.params.id;
            // find the user
                const user = check_user(req);
                if(user === null){
                    res.redirect('/')
                }
            // make incoming string a boolean
                const isTrueSet = (String(req.body.pointstf).toLowerCase() === 'true');
                console.log(isTrueSet)
            // get the quizz info and record lesson id
                const quizz = new Quizz({
                name: req.body.name,
                typeOfQuiz: req.body.quizType,
                data: [req.body.information],
                answer: req.body.answer,
                givePoints: isTrueSet,
                pointsArray: [req.body.points],
                lesson: id
            })
            // save quizz
            await quizz.save();
            // get this particular lesson
            const lessonRelated = await Lesson.findById(id);
            // push the quizz into the lesson array
            lessonRelated.quizzes.push(quizz);
            // save and redirect...
            await lessonRelated.save(function(err) {
            if(err) {console.log(err)}
                res.redirect('/quizzes/')
            })

        })

        router.post('/quiz/:id/answer', async (req, res) =>{
            let quizzId = req.params.id;
            await Quizz.findById(quizzId)
                .then(quizz=>{
                    if(quizz.answer == req.body.answer){
                        const user = check_user(req);
                        if(user === null){
                            res.redirect('/')
                        }
                        completion.addCompletion('quizz',quizzId,user)
                    }else{
                        console.log('wrong')
                    }
                }).catch(error =>{
                    console.log('hi')
                    res.json({ error: error })
                })
        });

        router.get('/quiz/:id', async (req, res) => {
            let quizzId = req.params.id;
            await Quizz.findById(quizzId)
                .then(quizz => {
                    res.render('quiz/show', {title: quizz.name, information: quizz})
                })
                .catch(error => {
                    res.json({ error: error })
                })
        });

        router.get('/', (req, res) => {
            Quizz.find()
               .exec(function(err, results) {
                if(err) {console.log(err)}
                res.render('quiz/index', {title: 'All quizzes', quizzes: results})
             })
         });

        router.get('/quiz/:id/next', async (req, res) => {
            let quizzId = req.params.id;
            await Quizz.findById(quizzId)
                .then(async quizz => {
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

                        for (let i = 0; i < course.lessons.length; i++) {
                            if(course.lessons[i]._id == lessonId){
                                if(course.lessons[i+1] !== undefined){
                                    return res.redirect('/lessons/lesson/'+course.lessons[i+1]) 
                                }else{
                                    return res.redirect('/lessons/lesson/'+lessonId) 
                                }
                            }
                        }
                    })
                    
                })
        });

        router.delete('/quiz/:id', async (req, res) => {
            let quizzId = req.params.id;
            await Quizz.findByIdAndDelete(quizzId)
                .then(async quizz => {
                    await Lesson.findById(quizz.lesson).then(lesson => {
                        lesson.quizzes.pull(quizzId);
                        console.log(lesson.quizzes)
                    })
                    
                    // res.render('quiz/show /lesson/:id/quizzes/', {title: quizz.name, information: quizz})
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