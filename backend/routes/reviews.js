const express = require('express');
const router = express.Router();
const { createReview, getAllReviews, updateReview, deleteReview } = require('../controllers/ReviewController');

router.post('/create', createReview);
router.get('/allReviews', getAllReviews);   
router.put('/update/:id', updateReview); 
router.delete('/delete/:id', deleteReview); 

module.exports = router;