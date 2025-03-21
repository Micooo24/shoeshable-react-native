const express = require('express');
const router = express.Router();

const multer = require('multer');


const upload = multer({ dest: 'uploads/' });
const { create, getAllProducts, getProductBySlug, getProductById, update, remove} = require('../controllers/ProductController');


router.post('/products', upload.array('image', 5), create);
router.put('/products/:slug', upload.array('image', 5), update);

router.get('/products/all', getAllProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/products/:id', getProductById);
router.delete('/products/:slug', remove);
module.exports = router;