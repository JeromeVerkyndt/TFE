const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, softDeleteProduct, updateProductById } = require('../controllers/productController');
const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

router.post('/', verifyToken, verifyRole('ADMIN'), addProduct);
router.get('/', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getAllProducts);
router.delete('/:id',  verifyToken, verifyRole('ADMIN'), softDeleteProduct);
router.put('/update/:id', verifyToken, verifyRole('ADMIN'), updateProductById);

module.exports = router;
