const Error = require("../middleware/error-handler");
const { responseHandler } = require("../middleware/response-handler.js");
const User = require("../models/users");
const Point = require("../models/points");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../service/mongo.service");


module.exports = {


    getAllPoints: (req, res) =>{
        Point.find({}).then(points => {res.json(points)})
    },
    assignPoints: async (req, res) =>{
        let id = req.body.user;
        let amount = req.body.earned;
        let user = User.findById(id);

        // get the comment text and record post id
        const points = new Point({
            amount: amount,
            userID: user.id
        })
        // save comment
        await points.save();
        
        res.status(200)
    },
    deletePoint: (req, res) => {
        let id = req.param.id;

        Point.findByIdAndDelete(id);

    }

}