const express = require('express');
const router = express.Router();
const {
    createOrder,
    softDeleteOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
} = require('../controllers/orderController');

router.post('/create', createOrder);
router.delete('/:id', softDeleteOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/user/:user_id', getOrdersByUserId);

module.exports = router;
