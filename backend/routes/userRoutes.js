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
const verifyRole = require("../middleware/verifyRole");

router.get('/clients', verifyToken, verifyRole('HUB'), getAllClients);
router.delete('/delete/:id', verifyToken, verifyRole('ADMIN'), softDeleteUser);
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getUserById);
router.get('/all-client/information', verifyToken, verifyRole('ADMIN'), getAllClientsInformation);
router.put('/update/:id', verifyToken, updateUserById);
router.put('/update/subtract/:id', verifyToken, verifyRole('ADMIN','HUB'), subtractFromUserBalance);
router.put('/update/subtract/balance/extra/:id', verifyToken, verifyRole('ADMIN','HUB'), subtractFromUserExtraBalance);
router.put('/update/balance/extra/:id', verifyToken,  verifyRole('ADMIN'), updateUserExtraBalance);
router.put('/update/balance/:id', verifyToken,  verifyRole('ADMIN'), updateUserBalance);
router.put('/update/subscription/:id', verifyToken,  verifyRole('ADMIN', 'CLIENT'), updateUserSubscription);
router.put("/:id/email", verifyToken,  verifyRole('ADMIN', 'CLIENT', 'HUB'), updateEmail);


module.exports = router;
