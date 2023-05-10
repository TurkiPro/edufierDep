const mongoose = require("mongoose");

const pointsSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users' 
    },
    completionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'completions' 
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    strictQuery: true
  }
);


module.exports = mongoose.model("points", pointsSchema);