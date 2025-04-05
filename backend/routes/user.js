const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/Auth");
const { getUserOrders } = require('../controllers/UserController');

router.get('/orders', isAuthenticatedUser, getUserOrders);

module.exports = router;