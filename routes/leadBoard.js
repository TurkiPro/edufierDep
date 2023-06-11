const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const leadBoard = require("../controllers/leadBoard");


router.route('/').get(auth.verifyAuth, leadBoard.index)


module.exports = router;
