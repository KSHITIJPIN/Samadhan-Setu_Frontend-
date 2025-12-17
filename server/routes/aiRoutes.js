const express = require('express');
const router = express.Router();
const { processVoiceCommand } = require('../controllers/aiController');

router.post('/process-voice', processVoiceCommand);

module.exports = router;
