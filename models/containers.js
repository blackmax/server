module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('containers', {
        user_id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: false,
        },
        current: TEXT,
        slot_1: INTEGER(4),
        slot_2: INTEGER(4),
        slot_3: INTEGER(4),
        slot_4: INTEGER(4),
    }, {
        timestamps: false
    });

