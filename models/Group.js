module.exports= (sequelize, DataTypes) =>{
    const Group = sequelize.define('SplitGroup', {
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{
        freezeTableName : true
    });
    return Group;
} 