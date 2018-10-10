module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('user_adventure_levels', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: INTEGER(10),
        type: STRING(20),
        stars: INTEGER(4),
        best_time: INTEGER,
    }, {
        timestamps: false
    });

