module.exports = (sequelize, DataTypes) => {
    const Balance = sequelize.define('Balance', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      owesUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    }, {
        freezeTableName : true
    });
  
    return Balance;
  };