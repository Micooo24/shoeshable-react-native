const express = require("express");
const router = express.Router();

const { Register, Login, googleLogin} = require('../controllers/Auth');

router.post("/signup", Register);
router.post("/login", Login);
router.post("/google-login", googleLogin);

module.exports = router;