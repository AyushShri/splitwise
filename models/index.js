const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User')(sequelize, Sequelize);
const Group = require('./Group')(sequelize, Sequelize);
const Expense = require('./Expense')(sequelize, Sequelize);
const Balance = require('./Balance') (sequelize, Sequelize);

Group.belongsToMany(User, { through: 'GroupMembers' });
User.belongsToMany(Group, { through: 'GroupMembers' });

Group.hasMany(Expense);
Expense.belongsTo(Group, { foreignKey: 'groupId' });
Expense.belongsTo(User, { as: 'paidBy', foreignKey: 'paidById' });
Expense.belongsToMany(User, { through: 'ExpenseSplits', as: 'splitBetween' });

Balance.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Balance.belongsTo(User, { as: 'owesUser', foreignKey: 'owesUserId' });
Balance.belongsTo(Group, { foreignKey: 'groupId' });

sequelize.sync({ alter: true });

module.exports = { User, Group, Expense, Balance };