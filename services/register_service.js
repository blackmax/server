const Service = require("./service");
var crypto = require('crypto');

class RegisterService extends Service {

    static getToken() {
        return crypto
            .createHash('md5')
            .update(new Date().getTime())
            .slice(0, 31);
    }

    async registerUser() {
        try {
            const user = await this.ctx.db.users.create({
                token: RegisterService.getToken(),
            });

            return user;
        } catch(e){
            this.ctx.logger.error(e.toString());
        }
    }
}

module.exports = (ctx) => new RegisterService(ctx);