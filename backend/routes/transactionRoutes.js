const express = require('express');
const router = express.Router();
const {
    getTransactionByUserId,
    createTransaction,
} = require('../controllers/transactionController');
const verifyToken = require("../middleware/authMiddleware");


router.get('/user/:user_id', verifyToken, getTransactionByUserId);
router.post('/create', verifyToken, createTransaction);

module.exports = router;
