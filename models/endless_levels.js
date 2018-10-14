module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('endless_levels', {
        user_id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: false,
        },
        hills_available: BOOLEAN,
        hills_best_distance: INTEGER,
        desert_available: BOOLEAN,
        desert_best_distance: INTEGER,
        snow_available: BOOLEAN,
        snow_best_distance: INTEGER,
    }, {
        timestamps: false
    });

