
module.exports= (sequelize, DataTypes) =>{
    const User = sequelize.define('User', {
        name:{
            type: DataTypes.STRING,
            allowNull : false,
        },
    }, {
        freezeTableName : true
    });
    return User;
}