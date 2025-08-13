const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getAllStock, createStock, softDeleteStock, getAllDataStock, updateStockById, decreaseStockById } = require('../controllers/stockController');
const verifyRole = require("../middleware/verifyRole");

router.get('/', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getAllStock);
router.get('/all_data', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getAllDataStock);
router.post('/', verifyToken, verifyRole('ADMIN'), createStock);
router.delete('/:id', verifyToken, verifyRole('ADMIN'), softDeleteStock);
router.put('/update/:id', verifyToken, verifyRole('ADMIN', 'HUB'), updateStockById);
router.put('/decrease/:id', verifyToken, verifyRole('ADMIN', 'HUB'), decreaseStockById);


module.exports = router;
