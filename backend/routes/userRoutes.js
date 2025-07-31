const express = require('express');
const router = express.Router();
const {
    softDeleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    getAllClients,
    subtractFromUserBalance,
    subtractFromUserExtraBalance,
} = require('../controllers/userController');

router.get('/clients', getAllClients);
router.delete('/:id', softDeleteUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/update/:id', updateUserById);
router.put('/update/subtract/:id', subtractFromUserBalance);
router.put('/update/subtract/balance/extra/:id', subtractFromUserExtraBalance);

module.exports = router;
