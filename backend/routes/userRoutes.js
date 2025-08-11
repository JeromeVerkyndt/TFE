const express = require('express');
const router = express.Router();
const {
    softDeleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    getAllClients,
    getAllClientsInformation,
    subtractFromUserBalance,
    subtractFromUserExtraBalance,
    updateUserExtraBalance,
    updateUserBalance,
    updateUserSubscription,
    updateEmail
} = require('../controllers/userController');
const verifyToken = require("../middleware/authMiddleware");

router.get('/clients', verifyToken, getAllClients);
router.delete('/delete/:id', verifyToken, softDeleteUser);
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.get('/all-client/information', verifyToken, getAllClientsInformation);
router.put('/update/:id', verifyToken, updateUserById);
router.put('/update/subtract/:id', verifyToken, subtractFromUserBalance);
router.put('/update/subtract/balance/extra/:id', verifyToken, subtractFromUserExtraBalance);
router.put('/update/balance/extra/:id', verifyToken, updateUserExtraBalance);
router.put('/update/balance/:id', verifyToken, updateUserBalance);
router.put('/update/subscription/:id', verifyToken, updateUserSubscription);
router.put("/:id/email", verifyToken, updateEmail);


module.exports = router;
