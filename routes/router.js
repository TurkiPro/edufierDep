const express = require("express");
const cookieParser = require("cookie-parser");
const { useErrorHandler } = require("../middleware/error-handler");


const authAPI = require("./api/auth");
const user = require("./user");
const auth = require("./auth");
const admin = require('./admin');
const post = require("./post");
const comment = require("./comment");
const course = require("./course");
const lesson = require("./lesson");
const quiz = require('./quiz');


module.exports.default = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use("/", auth);
    app.use("/profile", user);
    app.use("/control", admin);
    // app.use("/api/v1/users", users);
    app.use("/posts", post);
    app.use("/comments", comment);
    app.use("/courses", course);
    app.use("/lessons", lesson);
    app.use("/quizzes", quiz);
    app.get("/course/gamifier", function(req, res){
        res.render('course/gamefier')
    });

    app.get('*', function(req, res){
        res.status(404).send('Error 404, Not found');
      });
    app.use(useErrorHandler);
};