const { Expense, Group, User, Balance } = require('../models');
const SplitTypes = require ('../utils/splitTypes');

exports.addExpense = async (req, res) => {
    const { groupId, description, amount, paidBy, splitBetween, splitType, splitDetails } = req.body;
    console.log("different values are " + Object.values(SplitTypes));
    if (!Object.values(SplitTypes).includes(splitType)) {
        return res.status(400).json({ msg: 'Invalid split type' });
      }

  try {
    const users = await User.findAll({ where: { id: splitBetween } });   
    const groupData = await Group.findByPk(groupId);

    if (splitType === SplitTypes.UNEQUAL && (!splitDetails || splitDetails.length !== users.length) || splitDetails.reduce((sum, amt) => sum + amt, 0) !== amount) {
        return res.status(400).json({ msg: 'Invalid split details for unequal split' });
      }
  
    if (splitType === SplitTypes.PERCENTAGE && (!splitDetails || splitDetails.reduce((sum, perc) => sum + perc, 0) !== 100)) {
        return res.status(400).json({ msg: 'Invalid split details for percentage split' });
      }

    const expense = await Expense.create({ groupId: groupData.id, description, amount, paidById: paidBy, splitType, splitDetails });
    await expense.addSplitBetween(users);
    await groupData.addExpense(expense);

    const splitAmounts = expense.calculateSplit(users, splitDetails);
    for (const [index, user] of users.entries()) {
      if (user.id !== paidBy) {
        const [balance, created] = await Balance.findOrCreate({
          where: { userId: user.id, owesUserId: paidBy, groupId },
          defaults: { amount: 0 }
        });
        await balance.increment({ amount: splitAmounts[index] });
      }
    }
    res.json(expense);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { groupId: req.params.groupId },
      include: [
        { model: User, as: 'paidBy', attributes: ['name', 'email'] },
        { model: User, as: 'splitBetween', through: { attributes: [] }, attributes: ['name', 'email'] }
      ]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

Expense.prototype.calculateSplit = function(users, splitDetails) {
    const splitAmounts = [];
  
    switch (this.splitType) {
      case SplitTypes.EQUAL:
        const equalAmount = this.amount / users.length;
        users.forEach(() => splitAmounts.push(equalAmount));
        break;
  
      case SplitTypes.UNEQUAL:
        splitDetails.forEach((detail, index) => {
          splitAmounts[index] = (detail / 100) * this.amount;
        });
        break;
  
      case SplitTypes.PERCENTAGE:
        splitDetails.forEach((percentage, index) => {
          splitAmounts[index] = (percentage / 100) * this.amount;
        });
        break;
  
      default:
        throw new Error('Invalid split type');
    }
  
    return splitAmounts;
  };