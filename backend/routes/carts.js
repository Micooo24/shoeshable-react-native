const express = require('express');
const router = express.Router();
// const { addToCart, deleteFromCart, getAllCartItems, updateCartItemQuantity, getCartByCustomerId} = require('../controllers/CartController');
const { addToCart, getAllCartItems} = require('../controllers/CartController');
const { isAuthenticatedUser } = require("../middlewares/auth");


// Create Cart
router.post("/add", isAuthenticatedUser, addToCart);

//Get Cart
router.get("/all", isAuthenticatedUser, getAllCartItems); // fetch all carts


// // Route to delete an item from the cart
// router.delete("/delete",isAuthenticatedUser, deleteFromCart); // Using DELETE with request body for customerId and productId


// router.get('/:customerId',getCartByCustomerId);

// router.put("/update-quantity", isAuthenticatedUser, updateCartItemQuantity);


module.exports = router;
