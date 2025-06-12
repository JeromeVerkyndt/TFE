const express = require('express');
const router = express.Router();
const {
    getTransactionByUserId,
    createTransaction,
} = require('../controllers/transactionController');


router.get('/user/:user_id', getTransactionByUserId);
router.post('/create', createTransaction);

module.exports = router;
