const express = require('express');
const router = express.Router();
const {
    createOrder,
    softDeleteOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
} = require('../controllers/orderController');
const verifyToken = require("../middleware/authMiddleware");

router.post('/create', verifyToken, createOrder);
router.delete('/:id', verifyToken, softDeleteOrder);
router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrderById);
router.get('/user/:user_id', verifyToken, getOrdersByUserId);

module.exports = router;
