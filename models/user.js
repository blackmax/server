
module.exports = (sequelize, DataTypes) => {
    const User = db.sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        token: Sequelize.STRING(32),
    
    },{
        timestamps: false
    });

    return User;
}