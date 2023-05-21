const express = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Course = require("../models/courses");
const courseController = require("../controllers/api/course");
const lessons = require("../models/lessons");
const Quiz = require("../models/quizzes");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth")
const router = express.Router();       

router.route("/fetchcourses").get(courseController.index)

      // get user name from db
        fetchName = id => {
          return User.findOne({_id: id}).then(user => user.name);
        };

        //  Get each post details. 
        // router.get('/course/:id', async (req, res) => {
        //     let userName;
        //     let postUsername;
        //     let userComments = [];
        //     const user = check_user(req);
        //     fetchName(user).then(name => userName = name)
        //     Post.findById(req.params.id)
        //         .populate('comments')
        //         .exec(async function (err, results) {
        //           if (err) { console.log(err); };
        //           // call fetch name to get post user name
        //           fetchName(results.user).then(name => postUsername = name)
        //           //make a loop to call fetch name to get names of the commenters and save it in an array
        //           for (let comment of results.comments) {
        //             await fetchName(comment.user).then((name) => {
        //               comment =
        //               {
        //                 text: comment.text,
        //                 post: comment.post,
        //                 userName: name,
        //                 user: comment.user,
        //                 date: comment.date
        //               };
        //             });
        //             userComments.push(comment);
        //           };
        //           res.render('course/show', { title: 'discussion details', post: results, comments: userComments, currentUser: user, postUsername: postUsername });
        //         })
        //     })
        router.get('/course/:id/lessons/',admin.verifyAdministration, async (req, res) => {
          const courseId = req.params.id;
          await Course.findById(courseId)                    
              .populate('lessons')
              .exec(async function (err, results) {
                if (err) { console.log(err); };
                res.render('admin/lessons/index', {title: 'All lessons', courses: results})
              })  
         })
         
          router.get('/new',admin.verifyAdministration, (req, res) => {
            res.render('course/create', {title: 'Create a course'})
           })
   
          router.post('/new',admin.verifyAdministration, (req, res) => {
            // find the user
            const user = check_user(req);
            if(user === null){
                res.redirect('/')
            }
            const course = new Course({
              name: req.body.name,
              isActive: req.body.activation
             });
             course.save(function(err) {
              if(err) {console.log(err)}
                res.redirect('/')
             })
            })
   
          router.get('/', admin.verifyAdministration, (req, res) => {
             Course.find()
                .exec(function(err, results) {
                 if(err) {console.log(err)}
                 res.render('course/index', {title: 'All courses', courses: results})
              })
          });

          router.get('/course/:id',auth.verifyAuth, async (req, res) =>{
            let courseId = req.params.id
            await Course.findById(courseId).populate('lessons').exec(async function (err, results) {
              if (err) { console.log(err); };
              res.render('course/show', { title: 'Course '+ results.name, course: results, lessons: results.lessons, user: req.userType });
            })
          })

          router.get('/course/:id/edit', admin.verifyAdministration, async (req, res) =>{
            let courseId = req.params.id
            await Course.findById(courseId).exec(async function (err, results) {
              if (err) { console.log(err); };
              res.render('course/edit', { title: 'Editing '+ results.name, course: results });
            })
          })
          
          router.put('/course/:id/edit',admin.verifyAdministration, async (req, res) => {
            let courseId = req.params.id
            const course = await Course.findById(courseId)
            course.name = req.body.name;
            course.isActive = req.body.activation;
            try {
              const result = await course.save();
              console.log(result); // result
              res.status(200).json({message: "success"});
            } catch (err) {
              console.error("something goes wrong");
              res.json({ error: error })
            }
              res.redirect('/')
          })

          router.delete('/course/:id',admin.verifyAdministration, async (req, res) => {
            let courseId = req.params.id;
            await Course.findByIdAndDelete(courseId)
                .then(async course => {
                  if(course.lessons.length){
                    for (const lesson of course.lessons) {
                      await lessons.findByIdAndDelete(lesson._id)
                      .then(async lesson => {
                        if(lesson.quizzes.length){
                          for (const quiz of lesson.quizzes) {
                            await Quiz.findByIdAndDelete(quiz._id)
                          }
                        }
                      })
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