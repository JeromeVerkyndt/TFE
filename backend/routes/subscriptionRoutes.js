const express = require('express');
const router = express.Router();
const { createSubscription, softDeleteSubscription, getAllSubscriptions, updateSubscriptionVisibility, getUserSubscriptions} = require('../controllers/subscriptionController');

router.post('/add', createSubscription);
router.get('/all', getAllSubscriptions);
router.get('/user', getUserSubscriptions);
router.delete('/:id', softDeleteSubscription);
router.put('/visibility/:id', updateSubscriptionVisibility);


module.exports = router;
