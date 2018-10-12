const Car = require("./car");
const UserCars = require("./user_cars");
const UserAdventureLevels = require('./user_adventure_levels');
const Icons = require('./icon');
const UserIcons = require('./user_icons');
const Parts = require('./parts');
const UserParts = require('./user_parts');
const EndlessLevels = require('./endless_levels');
const Skins = require('./skins');
const UserSkins = require('./user_skin');

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

    User.hasOne(EndlessLevels(sequelize, Types));

    User.hasMany(UserAdventureLevels(sequelize, Types));

    User.belongsToMany(Car(sequelize, Types), {
        through: UserCars(sequelize, Types), 
        foreignKey: 'user_id', 
        otherKey: 'car_id'
    });

    User.belongsToMany(Icons(sequelize, Types), {
        through: UserIcons(sequelize, Types),
        foreignKey: 'user_id',
        otherKey: 'icon_id',
    });

    User.belongsToMany(Parts(sequelize, Types), {
        through: UserParts(sequelize, Types),
        foreignKey: 'user_id',
        otherKey: 'part_id',
    });

    User.belongsToMany(Skins(sequelize, Types), {
        through: UserSkins(sequelize, Types),
        foreignKey: 'user_id',
        otherKey: 'skin_id',
    });

    return User
};
