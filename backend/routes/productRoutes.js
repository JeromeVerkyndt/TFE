const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, softDeleteProduct, updateProductById } = require('../controllers/productController');

router.post('/', addProduct);
router.get('/', getAllProducts);
router.delete('/:id', softDeleteProduct);
router.put('/update/:id', updateProductById);

module.exports = router;
