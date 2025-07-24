const express = require('express');
const router = express.Router();
const { addNews, getAllNews, addImageUrlToNews } = require('../controllers/newsController');

router.post('/', addNews);
router.post('/image/:id', addImageUrlToNews);
router.get('/', getAllNews);

module.exports = router;