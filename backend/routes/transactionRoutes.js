const express = require('express');
const router = express.Router();
const {
    getTransactionByUserId,
} = require('../controllers/transactionController');


router.get('/user/:user_id', getTransactionByUserId);

module.exports = router;
