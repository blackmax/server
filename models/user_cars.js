module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('user_cars', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: INTEGER,
        car_id: INTEGER,
        skin_id: INTEGER,
        disk_id: INTEGER,
        engine_max: {type: INTEGER(4), default: 1},
        engine_current: {type: INTEGER(4), default: 1},
        suspension_max: {type: INTEGER(4), default: 1},
        suspension_current: {type: INTEGER(4), default: 1},
        grip_max: {type: INTEGER(4), default: 1},
        grip_current: {type: INTEGER(4), default: 1},
        downforce_max: {type: INTEGER(4), default: 1},
        downforce_current: {type: INTEGER(4), default: 1},
        parts_engine: {type: INTEGER(4), default: 0},
        parts_turbo: {type: INTEGER(4), default: 0},
        parts_suspension: {type: INTEGER(4), default: 0},
        parts_tire: {type: INTEGER(4), default: 0},
        parts_fuel: {type: INTEGER(4), default: 0},
        parts_mass: {type: INTEGER(4), default: 0},
    }, {
        timestamps: false
    });

