module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('user_skin', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: INTEGER(10).UNSIGNED,
        car_id: INTEGER(10).UNSIGNED,
        skin_id: INTEGER(10).UNSIGNED,
        new: BOOLEAN,
    }, {
        timestamps: false,
        tableName: 'user_skin',
    });