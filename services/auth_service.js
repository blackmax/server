var userModel = require("../models/user");


class GameCenterAuthProvider{
    getUsers(data) {
        return userModel.findAll({
            where: {
                google_play: data.key
            }
        });

    }
    async auth(data) {
        const users = await this.getUsers(data);
        if (users.length > 1) {
            throw "MANY_USERS_WITH_GAMECENTER_KEY";
        }

        return users[0];
    }

    async isUserExists(data) {
        const users = await this.getUsers(data);
        return users.length > 0;
    }
}


class DBAuthProvider{
    getUsers(data) {
        return userModel.findAll({
            where: {
                token: data.token
            }
        });

    }
    async isUserExists(data){
        const users = await this.getUsers(data);
        return users.length > 0;
    }

    async checkUserAuth(data){
        const user = await userModel.find({
            where: {
                token: data.token,
                id: data.id,
            }
        });
        //todo: проверки всё ли ок
        return user;
    }

}


const getAuthProvider = (provider) => {
    switch (provider){
        case 'gamecenter':
            return new GameCenterAuthProvider();
            break;

        case 'db':
            return new DBAuthProvider();
            break;

        default:
            throw "NO_AUTH_PROVIDER_EXISTS";
            break;
    }
};

class AuthService {

    generateKey(length){
        let text = "";
        const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        while(length--){
            text += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }

        return text;
    }

    async setUser(userId) {
        const key = this.generateKey(32);
        const user = userModel.findById(userId);
        user.token = userId + "." + key;
        await user.save();

        return user;
    }

    async checkUserAuth(credentials, service){
        const provider = getAuthProvider(service):
        const user = await provider.checkUserAuth(credentials);
        return user;
    }

    isUserExistsForService(credentials, service) {
        const provider = getAuthProvider(service);
        return provider.isUserExists(credentials);
    }
}

const authService = new AuthService();

module.exports = authService;