const { json } = require("express");
const Users = require("../models/users");

module.exports = {
    index: async (req, res) => {
        await Users.find({})
                        .sort({earnedPoints: 'desc'})
                            .exec( function(err, results){
                                if(err){console.log(err)}
                                res.render('leadboard/show', {title: 'Leader Board', users: results, user: req.userType})
         }
        );
    }
}