module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('user_parts', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: INTEGER(10).UNSIGNED,
        part_id: INTEGER(10).UNSIGNED,
        part_lvl: INTEGER(4),
        part_number: INTEGER,
        new: BOOLEAN,
    }, {
        timestamps: false
    });