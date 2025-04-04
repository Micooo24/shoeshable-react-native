const express = require('express');
const router = express.Router();
const { 
    createOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/OrderController');

const { isAuthenticatedUser } = require("../middlewares/Auth");

// User routes
router.post('/create', isAuthenticatedUser, createOrder);
router.get('/myorders', isAuthenticatedUser, myOrders);
router.get('/:id', isAuthenticatedUser, getSingleOrder);

// Admin routes
router.get('/', isAuthenticatedUser,  getAllOrders);
router.put('/:id', isAuthenticatedUser, updateOrder);
router.delete('/:id', isAuthenticatedUser,  deleteOrder);

module.exports = router;