const express = require('express');
const router = express.Router();
const {
    createOrderItem,
    softDeleteOrderItem,
    getAllOrderItems,
    getOrderItemsByOrderId
} = require('../controllers/orderItemController');

router.post('/create', createOrderItem);
router.delete('/:id', softDeleteOrderItem);
router.get('/', getAllOrderItems);
router.get('/order/:order_id', getOrderItemsByOrderId);

module.exports = router;
