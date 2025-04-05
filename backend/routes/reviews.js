const express = require('express');
const router = express.Router();
const { createReview, getAllReviews, updateReview, deleteReview } = require('../controllers/ReviewController');
const { isAuthenticatedUser } = require("../middlewares/Auth");

router.post('/create', isAuthenticatedUser, createReview);
router.get('/allReviews', isAuthenticatedUser, getAllReviews);   
router.put('/update/:id', isAuthenticatedUser, updateReview); 
router.delete('/delete/:id', isAuthenticatedUser, deleteReview); 

module.exports = router;