const mongoose = require('mongoose');
//temporary for tetsing email token
const crypto = require('crypto');

Schema = mongoose.Schema;

const profileSchema = Schema({
    birthDate: {
        type: Date,
        required: "birthdate is required"
    },
    profileImage: {
        type: String,
    }
})
const userSchema = Schema({
    name: {
        type: String,
        required: "name is required"
    },
    email: {
        type: String,
        unique: true,
        required: "email is required"
    },
    phone:{
        type:String
    },
    password: {
        type: String,
        required: "password is required"
    },
    isVerified: {
        type: Boolean,
        defaultValue: false,
    },
    emailToken: {
        type: String,
        default: crypto.randomBytes(64).toString('hex'),
    },
    roles: {
        type: [
            {
                type: String,
                enum: ["manager", "admin", "customer"],
            },
        ],
        default: ["customer"],
    },
    earnedPoints: {
        type: Number,
        default: 0
    },
    userProfile: {
        type:profileSchema
    }
},
    {
        timestamps: true
    }
    , {
        strictQuery: true
      }
);

module.exports = mongoose.model("users", userSchema);