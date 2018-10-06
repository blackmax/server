module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('cars', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        class: TEXT,
        name: TEXT,
        price: INTEGER,
        upgrade_price: INTEGER,
    }, {
        timestamps: false
    });

