module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('user_cars', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: INTEGER,
        car_id: INTEGER,
        engine_max: INTEGER(4),
        engine_current: INTEGER(4),
        suspension_max: INTEGER(4),
        suspension_current: INTEGER(4),
        grip_max: INTEGER(4),
        grip_current: INTEGER(4),
        downforce_max: INTEGER(4),
        downforce_current: INTEGER(4),
        skin_id: INTEGER,
        disk_id: INTEGER,
        parts_engine: INTEGER(4),
        parts_turbo: INTEGER(4),
        parts_suspension: INTEGER(4),
        parts_tire: INTEGER(4),
        parts_fuel: INTEGER(4),
        parts_mass: INTEGER(4),
    }, {
        timestamps: false
    });

