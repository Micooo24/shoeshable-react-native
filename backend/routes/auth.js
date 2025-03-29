const express = require("express");
const router = express.Router();

const { Register, Login, googleLogin, getUserProfile, updateProfile} = require('../controllers/Auth');
const { isAuthenticatedUser } = require("../middlewares/auth");
const upload = require("../utils/multer");


//Authentication routes through Firebase
router.post("/signup", Register);
router.post("/login", Login);
router.post("/google-login", googleLogin);


//Authentication with middleware
router.get('/profile', isAuthenticatedUser, getUserProfile);
router.put('/profile/update', isAuthenticatedUser,  upload.single("profileImage"), updateProfile)
module.exports = router;