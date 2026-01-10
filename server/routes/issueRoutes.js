const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(['citizen', 'admin', 'worker']), issueController.createIssue);
router.get('/', authMiddleware(), issueController.getIssues);
router.get('/public', authMiddleware(), issueController.getPublicIssues); // Add public route
router.put('/:issueId/assign', authMiddleware(['admin']), issueController.assignIssue);
router.put('/:issueId/resolve', authMiddleware(['worker']), issueController.resolveIssue);
router.put('/:issueId/verify', authMiddleware(['admin']), issueController.verifyIssue);
router.put('/:issueId/dismiss', authMiddleware(['admin']), issueController.dismissIssue);
router.put('/:issueId/cost', authMiddleware(['admin']), issueController.updateCost);
router.get('/summary', authMiddleware(['admin']), issueController.getSummary);

module.exports = router;
