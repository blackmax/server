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

        return true;
    }
}

module.exports = ctx => new UserService(ctx);