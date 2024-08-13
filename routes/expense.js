const express = require('express');
const { addExpense, getExpenses } = require('../controllers/expenseController');
const router = express.Router();

router.post('/expense', addExpense);
router.get('/:groupId/expense', getExpenses);

module.exports = router;