const express = require('express');
const router = express.Router();
const { addToCart, getAllCartItems, updateCartItem, updateCartItemQuantity, deleteFromCart} = require('../controllers/CartController');
const { isAuthenticatedUser } = require("../middlewares/auth");


// Create Cart
router.post("/add", isAuthenticatedUser, addToCart);

//Get Cart
router.get("/all", isAuthenticatedUser, getAllCartItems);

//Update Cart Item
router.put("/update", isAuthenticatedUser, updateCartItem); 

//Update Cart Item Quantity
router.put("/update-quantity", isAuthenticatedUser, updateCartItemQuantity); 

//Delete Cart Item
router.delete("/delete", isAuthenticatedUser, deleteFromCart); 


module.exports = router;
