const Error = require("../middleware/error-handler");
const { responseHandler } = require("../middleware/response-handler.js");
const User = require("../models/users");
const Point = require("../models/points");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const service = require("../service/mongo.service");
const completion = require("./completion");
const { body, validationResult } = require("express-validator");

const assignPointsValidationRules = [
  body("amount")
    .isInt({ min: 0 })
    .withMessage("Amount must be a positive integer"),
  body("completionId").isMongoId().withMessage("Invalid completion ID"),
  body("userId").isMongoId().withMessage("Invalid user ID"),
];

const assignPoints = async (amount, completionId, userId) => {
  // Validate input using the defined validation rules
  await Promise.all(assignPointsValidationRules.map((rule) => rule.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, return an error response
    return res.status(400).json({ errors: errors.array() });
  }

  // get the comment text and record post id
  const points = new Point({
    amount: amount,
    userID: userId,
    completionId: completionId,
  });
  // save comment
  try {
    await points.save();
    await User.findByIdAndUpdate(userId, { $inc: { earnedPoints: amount } });
    console.log(points);
    return res.status(200).json({ message: "Points assigned successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllPoints: (req, res) => {
    Point.find({}).then((points) => {
      res.json(points);
    });
  },
  deletePoint: (req, res) => {
    let id = req.param.id;

    Point.findByIdAndDelete(id);
  },
  assignPoints,
};
