const express = require('express');
const router = express.Router();
const {
    getTransactionByUserId,
    createTransaction,
    updatePaidStatus,
    getUnpaidSubscriptions,
} = require('../controllers/transactionController');
const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");


router.get('/user/:user_id', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getTransactionByUserId);
router.post('/create', createTransaction);
router.put("/:id/paid", verifyToken, verifyRole('ADMIN'), updatePaidStatus);
router.get("/paid-subscriptions/:userId", verifyToken, verifyRole('ADMIN'), getUnpaidSubscriptions);


module.exports = router;
