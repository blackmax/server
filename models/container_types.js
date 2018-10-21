module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('containers_types', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: STRING(50),
        slots: INTEGER(11),
        open_time_minutes: INTEGER(11),
        price_money: INTEGER(11),
        price_gold: INTEGER(11),
    }, {
        timestamps: false
    });

