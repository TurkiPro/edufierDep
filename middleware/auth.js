const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { responseHandler } = require("./response-handler.js");
const User = require('../models/users.js');

module.exports.verifyToken = function (req, res, next) {
    //get the token from the header if present
    let token = 
    req.headers.authorization || req.body.authorization || req.query.authorization || req.headers["x-access-authorization"] || req.cookies.Authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
        return responseHandler(null, res, 'Unauthorized!', 401);
    }
    try {
        if (token.includes("Bearer")) {
            token = token.substr(7);
        }
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        return next()
    } catch (ex) {
        console.log(ex + 'verify token')
        responseHandler(null, res, "Unauthorized", 401);
    }
};

module.exports.verifyAuth = async function (req, res, next) {
    //get the token from the header if present
    let token = 
    req.headers.authorization || req.body.authorization || req.query.authorization || req.headers["x-access-authorization"] || req.cookies.Authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
        if(req.path.includes("signup")){
            return res.render('signup',{title: 'Sign Up'})
        }else{
            return res.render('login',{title: 'Login'})
    }
    }
    try {
        if (token.includes("Bearer")) {
            token = token.substr(7);
        }
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        let userType = await User.findById(req.user._id);
        req.userType = userType.roles[0];
        req.userName = userType.name;
        req.userId = userType._id;
        req.userPoints = userType.earnedPoints;
        if(req.originalUrl === '/'){
            return res.render('dashboard',{title: 'Dashboard', user: req.userType, userName: req.userName, points: req.userPoints})
        }
        console.log('done auth')
        return next();
    } catch (ex) {
        console.log(ex + 'verifyauth')
        responseHandler(null, res, "Unauthorized", 401);
    }
};

module.exports.destroyAuth = function (req, res, next) {
    //get the token from the header if present
    let token = 
    req.headers.authorization || req.body.authorization || req.query.authorization || req.headers["x-access-authorization"] || req.cookies.Authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
        return next();
    }
    try {
        if (token.includes("Bearer")) {
            token = token.substr(7);
        }
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        return res.cookie('Authorization', null, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(Date.now()- 24 * 3600000
            ) // cookie will be removed
        })
        .redirect('/')
    } catch (ex) {
        console.log(ex + 'destroyauth')
        responseHandler(null, res, "Unauthorized", 401);
    }
};