const express = require('express');
const router = express.Router();

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const { create, getAllProducts, getProductBySlug, getProductById, update, remove} = require('../controllers/ProductController');


router.post('/add-product', upload.array('image', 5), create);
router.put('/update-product/:id', upload.array('image', 5), update);

router.get('/get-products', getAllProducts);
router.get('/get-product/:slug', getProductBySlug);
router.get('/get-product/:id', getProductById);
router.delete('/remove-product/:id', remove);
module.exports = router;