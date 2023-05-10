const mongoose = require("mongoose");

const completionsSchema = new mongoose.Schema({
    activityType:{
        type: String,
        trim: true,
        required: true
    },
    activityID: { 
        type: mongoose.Schema.Types.ObjectId 
    },
    completedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'userRecords'
        }
    ]
}, {
    strictQuery: true
  }
);


module.exports = mongoose.model("completions", completionsSchema);