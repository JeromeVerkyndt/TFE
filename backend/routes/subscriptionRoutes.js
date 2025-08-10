const express = require('express');
const router = express.Router();
const { createSubscription, softDeleteSubscription, getAllSubscriptions, updateSubscriptionVisibility, getUserSubscriptions} = require('../controllers/subscriptionController');
const verifyToken = require("../middleware/authMiddleware");

router.post('/add', verifyToken, createSubscription);
router.get('/all', verifyToken, getAllSubscriptions);
router.get('/user', verifyToken, getUserSubscriptions);
router.delete('/:id', verifyToken, softDeleteSubscription);
router.put('/visibility/:id', verifyToken, updateSubscriptionVisibility);


module.exports = router;
