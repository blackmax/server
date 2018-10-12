const Service = require('./service');

class UserService extends Service {

    constructor(ctx) {
        super(ctx);
        this.user = false;
    }

    async loadUserByToken(token) {
        if (this.user) {
            return this.user;
        }

        if (!token) {
            throw "NO_USER_TOKEN";
        }

        const users = await this.ctx.db.users.findAll({
            attributes: ['token', 'name_changer', 'level', 'adventure_stars', 'current_icon', 'money', 'event_money', 'bonus_level'],
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

    // Покупка машины
    async buyCar(carId) {
        const user = this.user;
        const car = await this.ctx.db.cars.findOne({where: {id: carId}});

        // Проверка (есть ли у игрока столько денег?)
        if (!this.checkCurrency("money", car.price)) {
            throw "NOT_ENOUGH_CURRENCY";
        }

        // Созд
        await this.ctx.db.user_cars.create({
            user_id: user.id,
            car_id: carId,
        });


        await this.addLevel().save();

        return true;
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

    // Проверка валюты по типу (money, gold, event)
    checkCurrency(type, price) {
        switch (type) {
            case "money":
                return this.user.money - price >= 0;
            case "gold":
                return this.user.gold - price >= 0;
            case "event":
                return this.user.event_money - price >= 0;
            default:
                throw "CURRENCY_ERROR";
        }
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
        const {cars, endless_levels, icons, parts, skins, user_adventure_levels, containers} = this.ctx.db;
        const user = await this.ctx.db.users.findOne({
            attributes: UserService.publicAttributes,
            where: {token},
            include: [
                {model: cars},
                {model: endless_levels},
                {model: icons},
                {model: parts},
                {model: skins},
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