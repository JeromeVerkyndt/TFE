const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, softDeleteProduct, updateProductById } = require('../controllers/productController');
const verifyToken = require("../middleware/authMiddleware");

router.post('/', verifyToken, addProduct);
router.get('/', verifyToken, getAllProducts);
router.delete('/:id', verifyToken, softDeleteProduct);
router.put('/update/:id', verifyToken, updateProductById);

module.exports = router;
