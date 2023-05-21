const express = require("express");
const jwt = require('jsonwebtoken');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const auth = require("../middleware/auth")
const router = express.Router();       
       
// Create and Post comments
    router.post('/comment/:id/new', auth.verifyAuth, async (req, res) => {
        // find out which post you are commenting
            const id = req.params.id;
        // find the user
            const user = check_user(req);
            if(user === null){
                res.redirect('/')
            }
        // get the comment text and record post id
            const comment = new Comment({
            text: req.body.comment,
            post: id,
            user: user
        })
        // save comment
        await comment.save();
        // get this particular post
        const postRelated = await Post.findById(id);
        // push the comment into the post.comments array
        postRelated.comments.push(comment);
        // save and redirect...
        await postRelated.save(function(err) {
        if(err) {console.log(err)}
        res.redirect('/posts/post/'+id)
        })

    })

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