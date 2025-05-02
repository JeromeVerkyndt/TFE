const express = require('express');
const router = express.Router();
const { getAllStock, createStock, softDeleteStock } = require('../controllers/stockController');

router.get('/', getAllStock);
router.post('/', createStock);
router.delete('/:id', softDeleteStock);

module.exports = router;
