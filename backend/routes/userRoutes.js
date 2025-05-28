const express = require('express');
const router = express.Router();
const {
    softDeleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    getAllClients,
} = require('../controllers/userController');

router.get('/clients', getAllClients);
router.delete('/:id', softDeleteUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/update/:id', updateUserById);

module.exports = router;
