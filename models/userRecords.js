const mongoose = require("mongoose");

const userRecordsSchema = new mongoose.Schema({

    completionId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'completions' 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users' 
    },
    date: {
        type: Date,
        default: Date.now
    }

}, {
    strictQuery: true
  }
);


module.exports = mongoose.model("userRecords", userRecordsSchema);