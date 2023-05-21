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
    numberOfTires: {
        type: Number,
        default: 1
    }
},
    {
        timestamps: true
    }, 
    {
        strictQuery: true
    }
);


module.exports = mongoose.model("userRecords", userRecordsSchema);