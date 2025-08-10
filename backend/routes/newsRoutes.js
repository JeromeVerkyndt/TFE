const express = require('express');
const router = express.Router();
const { addNews, getAllNews, addImageUrlToNews } = require('../controllers/newsController');
const verifyToken = require("../middleware/authMiddleware");

router.post('/', verifyToken, addNews);
router.post('/image/:id', verifyToken, addImageUrlToNews);
router.get('/', verifyToken, getAllNews);

module.exports = router;