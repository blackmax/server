module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('icons', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        }
    }, {
        timestamps: false
    });

