const express = require('express');
const router = express.Router();
const {
    getTransactionByUserId,
    createTransaction,
} = require('../controllers/transactionController');
const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");


router.get('/user/:user_id', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getTransactionByUserId);
router.post('/create', verifyToken, verifyRole('ADMIN', 'HUB'), createTransaction);

module.exports = router;
