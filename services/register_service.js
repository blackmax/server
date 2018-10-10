const Service = require("./service");
const crypto = require('crypto');

class RegisterService extends Service {

    static getToken() {
        return crypto
            .createHash('md5')
            .update(new Date().getTime().toString())
            .digest('hex');
    }

    async registerUser(data) {
        try {
            const user = await this.ctx.db.users.create({
                token: RegisterService.getToken(),
                iOS: data.device === 'iOS',
                android: data.device === 'android',
            });

            const userCar = this.ctx.db.user_cars.create({
                user_id: user.id,
                car_id: 1,
            });

            const userIcon = this.ctx.db.user_icons.create({
                user_id: user.id,
                icon_id: 1,
            });

            const endlessLevel = this.ctx.db.endless_levels.create({
                user_id: user.id,
            });

            const common = await Promise.all([userCar, userIcon, endlessLevel]);

            const payload = {
                user,
                user_cars: [common[0]],
                user_icons: [common[1]],
                endless_level: common[2],
            };


            this.ctx.logger.info(`user registered ${JSON.stringify(payload)}`);

            return payload;

        } catch (e) {
            this.ctx.logger.error(e.toString());
            throw e;
        }
    }
}

module.exports = (ctx) => new RegisterService(ctx);