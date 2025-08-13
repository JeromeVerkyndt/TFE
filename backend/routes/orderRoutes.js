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
const verifyRole = require("../middleware/verifyRole");

router.post('/create', verifyToken, verifyRole('ADMIN', 'HUB'), createOrder);
router.delete('/:id', verifyToken, verifyRole('ADMIN', 'HUB'), softDeleteOrder);
router.get('/', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getAllOrders);
router.get('/:id', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getOrderById);
router.get('/user/:user_id', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getOrdersByUserId);

module.exports = router;
