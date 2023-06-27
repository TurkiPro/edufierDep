const { json } = require("express");
const Users = require("../models/users");

module.exports = {
    index: async (req, res) => {
        await Users.find({})
                        .sort({earnedPoints: 'desc'})
                            .exec( function(err, results){
                                let currentUserIndex,currentUserInfo;
                                for (let i = 0; i < results.length; i++) {
                                    if(String(results[i]._id)==req.userId){
                                        currentUserIndex = i;
                                        currentUserInfo = results[i]
                                    }
                                }
                                if(err){console.log(err)}
                                res.render('leadboard/show', {title: 'Leader Board', users: results, user: req.userType, userIndex: currentUserIndex, userInfo: currentUserInfo})
         }
        );
    }
}