const { Balance, User } = require('../models');

exports.getBalances = async (req, res) => {
    const userId = req.params.userId;
  try {

    const owesBalances = await Balance.findAll({
        where: { userId },
        include: [{ model: User, as: 'owesUser', attributes: ['id', 'name'] }]
      });
  
      // Get balances where the user is owed money
      const owedBalances = await Balance.findAll({
        where: { owesUserId: userId },
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
      });
  
      res.json({ owes: owesBalances, getBack: owedBalances });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Internal Server error' });
  }
};

// assuming that we only allow full settlement of the pending amt between 2 users in a group
// No partial Settlement is allowed
exports.settleUpBetweenUsersInGroup = async (req, res) => {
    const { groupId, userId, owesUserId } = req.body;

  try {
    const balance = await Balance.findOne({ where: { groupId, userId, owesUserId } });

    if (!balance) {
        return res.status(404).json({ msg: 'Due Balance not found between these users in the given groupId' });
    }

    await balance.destroy(); // Settle the amount And clear entries
    res.json({ msg: 'Settled up successfully between the specified users in the group' });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server error' });
    }
    };
