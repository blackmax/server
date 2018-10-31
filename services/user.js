const Service = require('./service');

class UserService extends Service {

    constructor(ctx) {
        super(ctx);
        this.user = false;
    }

    async loadUserByToken(token) {
        if (this.user.token === token) {
            return this.user;
        }

        if (!token) {
            throw "NO_USER_TOKEN";
        }

        const users = await this.ctx.db.users.findAll({
            attributes: ['id', 'token', 'name_changer', 'level', 'adventure_stars', 'current_icon', 'money', 'event_money', 'bonus_level'],
            where: {token}
        });

        if (users.length === 0) {
            throw "NO_USER_WAS_FOUND";
        }

        this.ctx.logger.info('user loaded', {token, id: users[0].id});

        this.user = users[0];
    }

    async getUser(token) {
        await this.loadUserByToken(token);

        return this.user;

    }

    setUser(user) {
        this.user = user;
    }

    addLevel() {
        this.user.level += 1;
        return this;
    }

    // Сохранение сервисов (google_play, game_center, facebook)
    setServices(type, token) {
        switch (type) {
            case "google_play":
                this.user.google_play = token;
                break;
            case "game_center":
                this.user.game_center = token;
                break;
            case "facebook":
                this.user.facebook = token;
                break;
            default:
                throw "SERVICES_ERROR";
        }
        return this;
    }

    // Добавление валюты по типу (money, gold, event)
    addCurrency(type, amount) {
        switch (type) {
            case "money":
                this.user.money += amount;
                break;
            case "gold":
                this.user.gold += amount;
                break;
            case "event":
                this.user.event_money += amount;
                break;
            default:
                throw "CURRENCY_ERROR";
        }
        return this;
    }

    async save() {
        await this.user.save();
        return this;
    }

    /**
     * loading full user profile
     * @param token - token of profile
     * @param refresh - is need to refresh user in local memory
     */
    async getFullProfile(token, refresh = true) {
        const {user_cars, endless_levels, user_icons, user_parts, user_skin, user_adventure_levels, containers} = this.ctx.db;
        const user = await this.ctx.db.users.findOne({
            attributes: UserService.publicAttributes,
            where: {token},
            include: [
                {model: user_cars},
                {model: endless_levels},
                {model: user_icons},
                {model: user_parts},
                {model: user_skin},
                {model: user_adventure_levels},
                {model: containers}
            ]
        });

        if (refresh && (this.user.id === user.id || !this.user)) {
            this.ctx.logger.info({message: `set user ${this.user.id}`});
            this.setUser(user);
        }

        return user;
    }

    async changeIcon(iconId) {
        // check if icon exists in db
        const icon = await this.ctx.db.user_icons.findOne({
            where: {icon_id: iconId}
        });

        if (!icon) {
            return false;
        }
        this.user.current_icon = iconId;

        return true;
    }
}

UserService.publicAttributes = [
    'id',
    'token',
    'user_name',
    'name_changer',
    'level',
    'adventure_stars',
    'current_icon',
    'money',
    'gold',
    'event_money',
    'bonus_level',
];

module.exports = ctx => new UserService(ctx);