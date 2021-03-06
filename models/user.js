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
const Containers = require('./containers');

module.exports = (sequelize, Types) => {
    const {INTEGER, TEXT, BOOLEAN, STRING} = Types;
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
            adventure_stars: INTEGER,
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

    User.hasOne(EndlessLevels(sequelize, Types), {foreignKey: 'user_id'});
    User.hasMany(UserAdventureLevels(sequelize, Types), {foreignKey: 'user_id'});
    User.hasMany(Containers(sequelize, Types), {foreignKey: 'user_id'});
    User.hasMany(UserCars(sequelize, Types), {foreignKey: 'user_id'});
    User.hasMany(UserIcons(sequelize, Types), {foreignKey: 'user_id'});
    User.hasMany(UserParts(sequelize, Types), {foreignKey: 'user_id'});
    User.hasMany(UserSkins(sequelize, Types), {foreignKey: 'user_id', localKey: 'id', unique: false});


    User.prototype.checkCurrency = function (type, price) {

        switch (type) {
            case "money":
                return this.money - price >= 0;
            case "gold":
                return this.gold - price >= 0;
            case "event":
                return this.event_money - price >= 0;
            default:
                throw "CURRENCY_ERROR";
        }
    };

    User.prototype.addCurrency = function (type, amount) {
        switch (type) {
            case "money":
                this.money += amount;
                break;
            case "gold":
                this.gold += amount;
                break;
            case "event":
                this.event_money += amount;
                break;
            default:
                throw "CURRENCY_ERROR";
        }
        return this;
    };

    return User;
};
