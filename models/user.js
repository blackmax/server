module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        token: DataTypes.STRING(32),
    },{
        timestamps: false
    });

    return User;
}