const Service = require('./service');

class CarService extends Service {
    async changeSkin(userId, carId, skinId) {
        const {skins, user_cars} = this.ctx.db;
        const skin = await skins.findOne({where: {id: skinId}});
        if (!skin) {
            return false;
        }

        const userCar = await user_cars.update({
            skin_id: skinId,
        }, {
            where: {
                user_id: userId,
                car_id: carId,
            }
        });

        return userCar;
    }
}

module.exports = (ctx) => new CarService(ctx);