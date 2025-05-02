const express = require('express');
const router = express.Router();
const {
    createUser,
    softDeleteUser,
    getAllUsers,
    getUserById
} = require('../controllers/userController');

router.post('/', createUser);
router.delete('/:id', softDeleteUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

module.exports = router;
