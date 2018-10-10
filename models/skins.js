module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('skins', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        car_id: INTEGER(10).UNSIGNED,
        type: STRING(10),
        rarity: TEXT,
    }, {
        timestamps: false
    });
