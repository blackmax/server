module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('parts', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        class: STRING(2),
        type: STRING(20),
        rarity: STRING(20),
        max_lvl_upgrade: INTEGER.UNSIGNED,
        upgrade_price: INTEGER,
        upgrade_coefficient: INTEGER,
        min_boost: INTEGER,
        max_boost: INTEGER,
    }, {
        timestamps: false
    });

