const express = require("express");
const cookieParser = require("cookie-parser");
const { useErrorHandler } = require("../middleware/error-handler");


const authAPI = require("./api/auth");
// const users = require("./user");
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
    app.use("/control", admin);
    // app.use("/api/v1/users", users);
    app.use("/posts", post);
    app.use("/comments", comment);
    app.use("/courses", course);
    app.use("/lessons", lesson);
    app.use("/quizzes", quiz);

    app.get('*', function(req, res){
        res.status(404).send('Not found');
      });
    app.use(useErrorHandler);
};