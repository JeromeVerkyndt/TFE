const express = require('express');
const router = express.Router();
const { addNews, getAllNews } = require('../controllers/newsController');

router.post('/', addNews);
router.get('/', getAllNews);

module.exports = router;