const express = require('express');
const router = express.Router();
const {
    createOrderItem,
    softDeleteOrderItem,
    getAllOrderItems,
    getOrderItemsByOrderId
} = require('../controllers/orderItemController');
const verifyToken = require("../middleware/authMiddleware");

router.post('/create', verifyToken, createOrderItem);
router.delete('/:id', verifyToken, softDeleteOrderItem);
router.get('/', verifyToken, getAllOrderItems);
router.get('/order/:order_id', verifyToken, getOrderItemsByOrderId);

module.exports = router;
