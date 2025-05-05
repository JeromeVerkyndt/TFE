const express = require('express');
const router = express.Router();
const { getAllStock, createStock, softDeleteStock, getAllDataStock, updateStockById } = require('../controllers/stockController');

router.get('/', getAllStock);
router.get('/all_data', getAllDataStock)
router.post('/', createStock);
router.delete('/:id', softDeleteStock);
router.put('/update/:id', updateStockById);


module.exports = router;
