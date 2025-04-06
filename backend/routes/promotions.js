const express = require('express');
const router = express.Router();
const { getAllPromotions, sendSelectedPromotionNotifications } = require('../controllers/PromotionController');
const { isAuthenticatedUser } = require('../middlewares/Auth');

// Route to fetch all promotions (accessible to all authenticated users)
router.get('/all', isAuthenticatedUser, getAllPromotions);

// Route to send notifications for selected promotions (accessible to all authenticated users)
router.post('/send-notifications', isAuthenticatedUser, sendSelectedPromotionNotifications);

module.exports = router;