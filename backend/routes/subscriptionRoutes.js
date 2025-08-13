const express = require('express');
const router = express.Router();
const { createSubscription, softDeleteSubscription, getAllSubscriptions, updateSubscriptionVisibility, getUserSubscriptions} = require('../controllers/subscriptionController');
const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

router.post('/add', verifyToken, verifyRole('ADMIN'), createSubscription);
router.get('/all', verifyToken, verifyRole('ADMIN', 'CLIENT'), getAllSubscriptions);
router.get('/user', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getUserSubscriptions);
router.delete('/:id', verifyToken, verifyRole('ADMIN'), softDeleteSubscription);
router.put('/visibility/:id', verifyToken, verifyRole('ADMIN'), updateSubscriptionVisibility);


module.exports = router;
