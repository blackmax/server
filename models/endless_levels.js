module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('endless_levels', {
        user_id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        hills_available: BOOLEAN,
        hills_best_distance: INTEGER,
        desert_available: BOOLEAN,
        desert_bet_distance: INTEGER,
        show_available: INTEGER,
        show_best_distance: INTEGER,
    }, {
        timestamps: false
    });

