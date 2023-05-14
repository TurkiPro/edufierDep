const Error = require("../middleware/error-handler");
const { responseHandler } = require("../middleware/response-handler.js");
const User = require("../models/users");
const Point = require("../models/points");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../service/mongo.service");
const completion = require("./completion");


const assignPoints = async (amount, completionId, userId) =>{

    // get the comment text and record post id
    const points = new Point({
        amount: amount,
        userID: userId,
        completionId: completionId
    })
    // save comment
    await points.save();
    console.log(points)
    return true;
}


module.exports = {


    getAllPoints: (req, res) =>{
        Point.find({}).then(points => {res.json(points)})
    },
    deletePoint: (req, res) => {
        let id = req.param.id;

        Point.findByIdAndDelete(id);

    },
    assignPoints

}
