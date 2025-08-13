const express = require('express');
const router = express.Router();
const { addNews, getAllNews, addImageUrlToNews, softDeleteNews } = require('../controllers/newsController');
const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

router.post('/', verifyToken, verifyRole('ADMIN'), addNews);
router.post('/image/:id', verifyToken, verifyRole('ADMIN'), addImageUrlToNews);
router.get('/', verifyToken, verifyRole('ADMIN', 'CLIENT', 'HUB'), getAllNews);
router.delete('/delete/:id', verifyToken, verifyRole('ADMIN'), softDeleteNews);

module.exports = router;