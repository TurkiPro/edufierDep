const express = require("express");
const jwt = require('jsonwebtoken');
const Comment = require('../models/comments');
const User = require('../models/users');
const Post = require('../models/posts');
const router = express.Router();       

      
        fetchName = id => {
          return User.findOne({_id: id}).then(user => user.name);
        };

        //  Get each post details. 
        router.get('/post/:id', async (req, res) => {
            let userName;
            let postUsername;
            let userComments = [];
            const user = check_user(req);
            fetchName(user).then(name => userName = name)
            Post.findById(req.params.id)
                .populate('comments')
                .exec(async function (err, results) {
                  if (err) { console.log(err); };
                  fetchName(results.user).then(name => postUsername = name)
                  for (let comment of results.comments) {
                    await fetchName(comment.user).then((name) => {
                      comment =
                      {
                        text: comment.text,
                        post: comment.post,
                        userName: name,
                        user: comment.user,
                        date: comment.date
                      };
                    });
                    userComments.push(comment);
                  };
                  res.render('post/show', { title: 'discussion details', post: results, comments: userComments, currentUser: user, postUsername: postUsername });
                })
            })
   
          router.get('/new', (req, res) => {
            res.render('post/create', {title: 'Create a discussion'})
           })
   
          router.post('/new', (req, res) => {
            // find the user
            const user = check_user(req);
            if(user === null){
                res.redirect('/')
            }
            const post = new Post({
              title: req.body.title,
              text: req.body.text,
              user: user
             });
             post.save(function(err) {
              if(err) {console.log(err)}
                res.redirect('/')
             })
            })
   
          router.get('/', (req, res) => {
             Post.find()
                .exec(function(err, results) {
                 if(err) {console.log(err)}
                 res.render('post/index', {title: 'All Posts', posts: results})
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