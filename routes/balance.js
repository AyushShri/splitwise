const express = require('express');
const { getBalances, settleUpBetweenUsersInGroup } = require('../controllers/balanceController');
const router = express.Router();

router.get('/balance/:userId', getBalances);
router.post('/settleUp', settleUpBetweenUsersInGroup);

module.exports = router;