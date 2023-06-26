const express = require("express");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const Comment = require("../models/comments");
const User = require("../models/users");
const Post = require("../models/posts");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const router = express.Router();

// get user name from db
fetchName = async (id) => {
  return await User.findOne({ _id: id }).then((user) => user.name);
};

//  Get each post details.
router.get("/post/:id", auth.verifyAuth, async (req, res) => {
  let userName;
  let postUsername;
  let userComments = [];
  const user = toString(req.userId);
  const isNewPost = !req.user.openedPosts.includes(req.params.id);
  Post.findById(req.params.id)
    .populate("comments")
    .exec(async function (err, results) {
      if (err) {
        console.log(err);
      }
      const postHearts = results.hearts.length;
      // call fetch name to get post user name
      await fetchName(results.user).then((name) => (postUsername = name));
      //make a loop to call fetch name to get names of the commenters and save it in an array
      for (let comment of results.comments) {
        userName = await fetchName(comment.user);
        comment = {
          id: comment._id,
          text: comment.text,
          post: comment.post,
          userName: userName,
          user: toString(comment.user),
          hearts: comment.hearts.length,
          date: comment.date,
        };
        userComments.push(comment);
      }
      res.render("post/show", {
        isNewPost: isNewPost,
        title: "discussion details",
        post: results,
        comments: userComments,
        currentUser: user,
        postUsername: postUsername,
        user: req.userType,
        postHearts: postHearts
      });
    });
});

router.get("/new", auth.verifyAuth, (req, res) => {
  res.render("post/create", {
    title: "Create a discussion",
    user: req.userType,
  });
});

router.post('/post/:id/heart', auth.verifyAuth, async(req, res) => {
  const id = req.userId;
  Post.findById(req.params.id).then(async post => {
      if(post.hearts.includes(id)){
        post.hearts.pull(id);
          await post.save()
          res.status(200).json({message: 'Post has been un liked'})
      }else{
        post.hearts.push(id);
          await post.save()
          console.log(post)
          res.status(200).json({message: 'Post has been liked'})
      }
  }).catch(err => {
      console.log(err)
      res.status(404).json({message: 'error'})
  })
})

router.post(
  "/new",
  [
    check("title", "Title is required")
      .notEmpty()
      .isLength({ min: 5 })
      .trim()
      .escape(),
    check("text", "Text is required").notEmpty().isLength({ min: 10 }).escape(),
  ],
  auth.verifyAuth,
  (req, res) => {
    // find the user
    const user = check_user(req);
    if (user === null) {
      res.redirect("/");
    }
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      user: user,
    });
    post.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect("/posts/");
    });
  }
);

router.get("/", auth.verifyAuth, (req, res) => {
  Post.find().exec(function (err, results) {
    if (err) {
      console.log(err);
    }
    res.render("post/index", {
      title: "All Posts",
      posts: results,
      user: req.userType,
    });
  });
});

function check_user(header) {
  let token = header.cookies.Authorization;
  if (!token) {
    return responseHandler(null, res, "Server Error", 500);
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
    console.log(ex + "test");
    return null;
  }
}

module.exports = router;
