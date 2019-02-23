const Service = require('./service');

class CarService extends Service {
    /**
     * сколько денег надо на следующий апгрейд
     * @param from
     * @param level
     * @returns {*}
     */
    static getUpgradePrice(from, level) {
        const half = from / 2;
        let price = from;
        for (let i = 2; i < level + 1; i++) {
            price += half + 100 * (i - 2);
        }

        return price;
    }

    async changeSkin(userId, carId, skinId) {
        const {skins, user_cars, user_skin} = this.ctx.db;
        const skin = await skins.findOne({where: {id: skinId}});
        if (!skin) {
            return false;
        }
        const field = skin.type === 'body' ? 'skin_id' : 'disk_id';

        const userCarsUpdate = user_cars.create({
            [field]: skinId,
        }, {
            where: {
                user_id: userId,
                car_id: carId,
            }
        });

        const userSkinUpdate = user_skin.update({
            new: 0,
        }, {where: {skin_id: skin.id, user_id: userId, car_id: carId}});

        Promise.all([userCarsUpdate, userSkinUpdate]);
    }

    async attachCarToUser(user, carId) {
        //получаем базовый скин машины
        const carSkinPromise = this.ctx.db.skins.find({
            where: {car_id: carId, type: 'body'},
            order: [['id', 'asc']]
        });
        //получаем базовый диск машины
        const diskSkinPromise = this.ctx.db.skins.find({
            where: {car_id: carId, type: 'disk'},
            order: [['id', 'asc']],
        });
        const [carSkin, diskSkin] = await Promise.all([carSkinPromise, diskSkinPromise]);
        console.log({user_id: user.id, skin_id: carSkin.id, car_id: carId},{user_id: user.id, skin_id: diskSkin.id, car_id: carId} );
        
        const userSkins =
            await Promise.all([
                this.ctx.db.user_skin.create({user_id: user.id, skin_id: carSkin.id, car_id: carId, new: 1}), 
                this.ctx.db.user_skin.create({user_id: user.id, skin_id: diskSkin.id, car_id: carId, new: 1}),
            ]);
        const userCar = await this.ctx.db.user_cars.create({
            user_id: user.id,
            car_id: carId,
            skin_id: carSkin.id,
            disk_id: diskSkin.id,
        });

        return {
            userSkins, userCar
        }
    }

    // Покупка машины
    async buyCar(user, carId) {
        const car = await this.ctx.db.cars.findOne({where: {id: carId}});

        // Проверка (есть ли у игрока столько денег?)
        if (!user.checkCurrency("money", car.price)) {
            throw "NOT_ENOUGH_CURRENCY";
        }

        user.addCurrency('money', car.price * -1);

        // Создаем запись о машине
        const {userCars, userSkins} = await Promise.all([
            this.attachCarToUser(user, carId),
            user.save(),
        ]);
        return {
            user_car: userCar,
            user_skin: userSkins,
        };
    }

    async upgradeCar(user, carId, type) {
        const {cars, user_cars} = this.ctx.db;
        const [car, userCar] = await Promise.all([
            cars.find({where: {id: carId}}),
            user_cars.find({where: {user_id: user.id, car_id: carId}}),
        ]);

        if (!userCar || !car) {
            return false;
        }
        const currLevel = userCar[type + "_max"];

        if (!currLevel) {
            return false;
        }

        const moneyNeeded = CarService.getUpgradePrice(car.upgrade_price, currLevel);
        if (!user.checkCurrency('money', moneyNeeded) && userCar[type + '_max'] + 1 < 20) {
            return false;
        }
        userCar[type + '_max'] += 1;
        user.addCurrency('money', moneyNeeded * -1);

        await Promise.all([userCar.save(), user.save()]);

        return true;
    }

    async saveCar(userId, car) {
        const {user_cars} = this.ctx.db;
        //todo: upgrade validation
        const upgradedCar = await user_cars.update(car, {
            where: {
                user_id: userId,
                car_id: car.id,
            }
        });

        return upgradedCar;
    }
}

module.exports = (ctx) => new CarService(ctx);