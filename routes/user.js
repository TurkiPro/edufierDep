const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/user");

const multer = require("multer");



// router.route("").post(customerController.create);

const fileFilterMiddleware = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"])

    if ((file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") && fileSize <= 1282810) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


const upload = multer({dest: 'public/uploads', fileFilter: fileFilterMiddleware});

router.route('/edit').get(userController.showEditProfile)
router.route('/edit').put(upload.single('profilePic'), userController.updateEditProfile)

module.exports = router;
