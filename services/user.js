const Service = require('./service');

class UserService extends Service {
    constructor(ctx) {
        super(ctx);
        this.user = false;
    }

    async getUser() {
        if (!this.user) {
            return this;
        }

        if (!this.data.token) {
            throw "NO_USER_TOKEN";
        }

        const users = await this.ctx.db.users.findAll({
            where: {token: this.data.token}
        });

        if (users.length === 0) {
            throw "NO_USER_WAS_FOUND";
        }

        if (users.length > 1) {
            throw "MANY_USERS_CONTAIN_ONE_TOKEN";
        }

        this.user = users[0];

        return this.user;

    }

    setUser(user) {
        this.user = user;
    }

    async buyCar(carId) {
        const user = await this.getUser();
        const car = await this.ctx.db.cars.findOne({where: {id: carId}});
        if (user.money < car.price) {
            throw "NO_ENOUGH_MONEY";
        }

        this.ctx.db.user_cars.create({
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

    addMoney(amount) {
        this.user.money += amount;
        return this;
    }

    save() {
        this.user.save();
        return this;
    }

    /**
     * loading full user profile
     * @param token - token of profile
     * @param refresh - is need to refresh user in local memory
     */
    async getFullProfile(token, refresh = true) {
        const {cars, endless_levels, icons, parts, skins, user_adventure_levels} = this.ctx.db;
        const user = await this.ctx.db.users.findOne({
            where: {token},
            include: [
                {model: cars},
                {model: endless_levels},
                {model: icons},
                {model: parts},
                {model: skins},
                {model: user_adventure_levels}
            ]
        });

        if (refresh && (this.user.id === user.id || !this.user)) {
            this.ctx.logger.info({message: `set user ${this.user.id}`});
            this.setUser(user);
        }

        return user;
    }
}

module.exports = ctx => new UserService(ctx);