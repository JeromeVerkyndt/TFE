const express = require('express');
const router = express.Router();
const { getAllStock, createStock, softDeleteStock, getAllDataStock } = require('../controllers/stockController');

router.get('/', getAllStock);
router.get('/all_data', getAllDataStock)
router.post('/', createStock);
router.delete('/:id', softDeleteStock);


module.exports = router;
