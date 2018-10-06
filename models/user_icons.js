module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('user_icons', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: INTEGER,
        icon_id: INTEGER,
    }, {
        timestamps: false
    });

