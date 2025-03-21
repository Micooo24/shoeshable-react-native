const express = require("express");
const router = express.Router();

const { Register, Login} = require('../controllers/Auth');

router.post("/signup", Register);
router.post("/login", Login);

module.exports = router;