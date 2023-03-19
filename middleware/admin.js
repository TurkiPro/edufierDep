const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { responseHandler } = require("./response-handler.js");

module.exports.verifyAdministration = function (req, res, next) {
    let token = 
    req.headers.authorization || req.body.authorization || req.query.authorization || req.headers["x-access-authorization"] || req.cookies.Authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
        return responseHandler(null, res, "Unauthorized", 401);
    }
    try {
        if (token.includes("Bearer")) {
            token = token.substr(7);
        }
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        console.log(req.user)
        if(req.user.roles[0] !== "admin"){
            throw new Error('Not allowed here')
        }
        next();
    } catch (ex) {
        console.log(ex + 'test')
        responseHandler(null, res, "Unauthorized", 401);
    }
}