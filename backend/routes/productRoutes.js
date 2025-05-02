const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts } = require('../controllers/productController');

router.post('/', addProduct);
router.get('/', getAllProducts);

module.exports = router;
