const Service = require('./service');

class CarService extends Service {
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

    // Покупка машины
    async buyCar(user, carId) {
        const car = await this.ctx.db.cars.findOne({where: {id: carId}});

        // Проверка (есть ли у игрока столько денег?)
        if (!user.checkCurrency("money", car.price)) {
            throw "NOT_ENOUGH_CURRENCY";
        }
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
        user.addCurrency('money', car.price * -1);

        // Создаем запись о машине
        await Promise.all([
            this.ctx.db.user_cars.create({
                user_id: user.id,
                car_id: carId,
                skin_id: carSkin.id,
                disk_id: diskSkin.id,
            }),
            user.save(),
        ]);
        return true;
    }
}

module.exports = (ctx) => new CarService(ctx);