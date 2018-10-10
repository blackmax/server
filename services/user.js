const Service = require('./service');

class UserService extends Service {
    constructor(ctx) {
        super(ctx);
        this.user = false;
    }

    async getUser() {
        if (this.user) {
            return this.user;
        }

        if (!this.ctx.data.token) {
            throw "NO_USER_TOKEN";
        }

        const users = await this.ctx.db.users.findAll({
            where: {token: this.ctx.data.token}
        });

        if (users.length === 0) {
            throw "NO_USER_WAS_FOUND";
        }
        this.ctx.logger.info(`set user ${users[0].id} for socket ${this.ctx.socket.id}`);
        this.user = users[0];

        return this.user;

    }

    setUser(user) {
        this.user = user;
    }

    // Покупка машины
    async buyCar(carId) {
        const user = await this.getUser();
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

    addLevel(){
        this.user.level += 1;
        return this;
    }

    // Сохранение сервисов (google_play, game_center, facebook)
    setServices(type, token){
        switch (type){
            case "google_play": this.user.google_play = token; break;
            case "game_center": this.user.game_center = token; break;
            case "facebook": this.user.facebook = token; break;
            default: throw "SERVICES_ERROR";
        }
        return this;
    }

    // Добавление валюты по типу (money, gold, event)
    addCurrency(type, amount){
        switch (type) {
            case "money": this.user.money += amount; break;
            case "gold": this.user.gold += amount; break;
            case "event": this.user.event_money += amount; break;
            default: throw "CURRENCY_ERROR";
        }
        return this;
    }

    // Проверка валюты по типу (money, gold, event)
    checkCurrency(type, price){
        switch (type) {
            case "money": return this.user.money - price >= 0;
            case "gold": return this.user.gold - price >= 0;
            case "event": return this.user.event_money - price >= 0;
            default: throw "CURRENCY_ERROR";
        }
    }

    save(){
        this.user.save();
        return this;
    }
}

module.exports = ctx => new UserService(ctx);