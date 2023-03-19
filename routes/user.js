const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/user");

// router.route("").post(customerController.create);

router.route('/edit').get(userController.showEditProfile)
router.route('/edit').put(userController.updateEditProfile)

module.exports = router;
