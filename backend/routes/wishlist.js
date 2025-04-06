const express = require('express');
const router = express.Router();

const { addtoWishlist, getWishlist, removeFromWishlist, clearWishlist } = require('../controllers/WishlistController');
const { isAuthenticated } = require('../middlewares/Auth');

router.post('/add', addtoWishlist);
router.get('/get', getWishlist);
router.delete('/remove/:id', removeFromWishlist);
router.delete('/clear', clearWishlist);

module.exports = router;