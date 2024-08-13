module.exports= (sequelize, DataTypes) =>{
    const Expense = sequelize.define('Expense', {
        description: {
            type : DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type : DataTypes.FLOAT,
            allowNull: false,
        },
        splitType: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        splitDetails: {
            type: DataTypes.JSON, // This will store details about unequal and percentage splits
            allowNull: true,
          },
    }, {
        freezeTableName : true
    });
    Expense.prototype.calculateSplit = function(users, splitDetails) {
        throw new Error('This method should be overridden.');
      };
    return Expense;   
}
