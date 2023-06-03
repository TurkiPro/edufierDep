const Error = require("../middleware/error-handler");
const { responseHandler } = require("../middleware/response-handler.js");
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../service/mongo.service");


// regiser user

exports.signup = async (req, res, next) => {
    try {
        if (!req.body || !req.body.email || !req.body.password || !req.body.name ) {
            throw new Error.BadRequest("Insufficient request body data");
        }

        // if same email exists in db, throw error
        const user = await service.findOne(userModel, { email: req.body.email.toLowerCase() });
        if (user) {
            throw new Error.BadRequest("User already exist with given email");
        }

        const body = req.body

        body["password"] = await bcrypt.hash(req.body.password, 10);

        let userResponse = await service.create(userModel, body);

        return res.status(200).json({message: 'success'}).redirect("/")
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        let filter = {};
        if (!req.body.email || !req.body.password) {
            throw new Error.BadRequest("Insufficient request body data");
        }

        filter["email"] = req.body.email.trim().toLowerCase()

        const user = await service.findOne(userModel, filter);

        if (!user) {
            throw new Error.BadRequest("Email or Password is wrong, please check your enteries.");
        }

        // login via password
            const result = await bcrypt.compare(req.body.password, user.password);
            if (!result) {
                throw new Error.Unauthorized("Email or Password is wrong, please check your enteries.");
            }

        let token = jwt.sign({ _id: user._id, roles: user.roles }, process.env.ACCESS_SECRET_TOKEN, {
            expiresIn: "24h",
        });
        return res.cookie('Authorization', 'Bearer ' + token, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(Date.now() + 24 * 3600000
            ) // cookie will be removed after 24 hours
        }).status(200).json({message: 'success'});

    } catch (err) {
        next(err);
    }
};


exports.showEditProfile = async (req, res, next) => {
    try {
        let userId = check_user(req)
        const user = await userModel.findById(userId)
        let bday;
        if (user.userProfile !== undefined){ 
            if (user.userProfile.birthDate !== undefined) {
                 bday = user.userProfile.birthDate.toISOString().substring(0, 10)
                }
            }
        res.render('profile/edit', {title: 'Edit your information', user: user, bday: bday})
    } catch (err) {
        next(err);
    }
};

exports.updateEditProfile = async (req, res, next) => {
    try {

        userId = check_user(req, res)
        const currentUser = await userModel.findById(userId)

        let filter = {};
        if (!req.body || !req.body.email || !req.body.password || !req.body.name ) {
            throw new Error.BadRequest("Insufficient request body data");
        }
        filter["email"] = req.body.email.trim().toLowerCase()

        const user = await service.findOne(userModel, filter);
        if (!user) {
            throw new Error.BadRequest("Email doesn't match your credentials, please check your enteries.");
        }
        if(currentUser.id !== user.id){
            return res.cookie('Authorization', null, {
                httpOnly: true,
                sameSite: "strict",
                expires: new Date(Date.now()- 24 * 3600000
                ) // cookie will be removed
            })
            .redirect('/')
        }
        const body = req.body
        if(req.body.newEmail){
            filter["email"] = req.body.newEmail.trim().toLowerCase()
            // if same email exists in db, throw error
            const secondUser = await service.findOne(userModel, filter);
            if (secondUser === user) {
                throw new Error.BadRequest("User already exist with given email, please use another email");
            }else{
                body["email"] = req.body.newEmail.trim().toLowerCase()
            }
        }

        
        body["userProfile"] = {};
        let profileFilter = {};

        if(req.body.newPassword){
            if(req.body.newPassword !== req.body.cNewPassword){
                throw new Error.BadRequest("The confirmation of your new password does not match, please re-enter your new password");
            }else{
                body["password"] = await bcrypt.hash(req.body.newPassword, 10);
            }
        }else{
            body["password"] = currentUser.password;
        }
        if(req.body.birthDay){
            profileFilter['birthDate'] = req.body.birthDay;
        }
        if(req.file){
            profileFilter['profileImage'] = req.file.filename;
        }else{
            if(user.userProfile?.profileImage !== undefined){
                profileFilter['profileImage'] = user.userProfile.profileImage
            }
        }
        body["userProfile"] = profileFilter;
        let userResponse = await service.findOneAndUpdate(userModel, user.email, body);
        // console.log(userResponse.userProfile.birthDate)
        // console.log(userResponse.userProfile.profileImage)
        return res.status(200).json({message: 'success'})
    } catch (err) {
        console.log(err)
        next(err);
    }
};


function check_user(header, res){
    let token = header.cookies.Authorization;
    if (!token) {
        return responseHandler(null, res, 'Server Error', 500);
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

