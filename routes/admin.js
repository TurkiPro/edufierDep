const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const { verifyAuth } = require("../middleware/auth");


router.route('/dashboard').get(verifyAuth, admin.verifyAdministration, (req, res) =>
    res.render('admin/index',{title: 'Admin Dashboard', user: req.userType})
)

module.exports = router;
