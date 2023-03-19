const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/user");

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route('/').get(auth.verifyAuth)
router.route('/signup').get(auth.verifyAuth)

router.route('/logout').get(auth.destroyAuth, (req, res) =>
res.redirect('/')
)
module.exports = router;
