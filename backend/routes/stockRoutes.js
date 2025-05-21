const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getAllStock, createStock, softDeleteStock, getAllDataStock, updateStockById } = require('../controllers/stockController');

router.get('/', verifyToken, getAllStock);
router.get('/all_data', verifyToken, getAllDataStock);
router.post('/', verifyToken, createStock);
router.delete('/:id', verifyToken, softDeleteStock);
router.put('/update/:id', verifyToken, updateStockById);


module.exports = router;
