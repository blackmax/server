module.exports = (sequelize, {INTEGER, TEXT, STRING, BOOLEAN}) =>
    sequelize.define('users', {
        id: {
            type: INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        token: STRING(32),
        google_play: TEXT,
        game_center: TEXT,
        facebook: TEXT,
        user_name: TEXT,
        name_changer: BOOLEAN,
        level: INTEGER,
        adventure_stats: INTEGER,
        current_icon: INTEGER,
        money: INTEGER,
        event_money: INTEGER,
        bonus_level: BOOLEAN,
        android: BOOLEAN,
        iOS: BOOLEAN
    }, {
        timestamps: false
    });

