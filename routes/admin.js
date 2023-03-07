const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");


router.route('/dashboard').get(admin.verifyAdministration, (req, res) =>
    res.render('admin/index',{title: 'Admin Dashboard'})
)

module.exports = router;
