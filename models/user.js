const Car = require("./car");
const UserCars = require("./user_cars");

module.exports = (sequelize, Types) => {
    const { INTEGER, TEXT, BOOLEAN, STRING} = Types;
    const User = sequelize.define('users', {
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
        }, 
        {
            timestamps: false
        },
    );

    User.belongsToMany(Car(sequelize, Types), {
        through: UserCars(sequelize, Types), 
        foreignKey: 'user_id', 
        otherKey: 'car_id'
    });

    return User
}
