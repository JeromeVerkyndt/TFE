const express = require('express');
const router = express.Router();
const { addNews, getAllNews, addImageUrlToNews, softDeleteNews } = require('../controllers/newsController');
const verifyToken = require("../middleware/authMiddleware");

router.post('/', verifyToken, addNews);
router.post('/image/:id', verifyToken, addImageUrlToNews);
router.get('/', verifyToken, getAllNews);
router.delete('/delete/:id', verifyToken, softDeleteNews);

module.exports = router;