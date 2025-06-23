const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getAllStock, createStock, softDeleteStock, getAllDataStock, updateStockById, decreaseStockById } = require('../controllers/stockController');

router.get('/', verifyToken, getAllStock);
router.get('/all_data', verifyToken, getAllDataStock);
router.post('/', verifyToken, createStock);
router.delete('/:id', verifyToken, softDeleteStock);
router.put('/update/:id', verifyToken, updateStockById);
router.put('/decrease/:id', verifyToken, decreaseStockById);


module.exports = router;
