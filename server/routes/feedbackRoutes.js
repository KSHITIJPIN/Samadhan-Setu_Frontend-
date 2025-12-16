const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(['citizen']), feedbackController.createFeedback);
router.get('/', authMiddleware(['admin']), feedbackController.getFeedback);

module.exports = router;
