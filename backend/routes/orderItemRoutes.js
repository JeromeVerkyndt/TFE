const express = require('express');
const router = express.Router();
const {
    createOrderItem,
    softDeleteOrderItem,
    getAllOrderItems,
    getOrderItemsByOrderId
} = require('../controllers/orderItemController');
const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

router.post('/create', verifyToken, verifyRole('ADMIN', 'HUB'), createOrderItem);
router.delete('/:id', verifyToken, verifyRole('ADMIN', 'HUB'), softDeleteOrderItem);
router.get('/', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getAllOrderItems);
router.get('/order/:order_id', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getOrderItemsByOrderId);

module.exports = router;
