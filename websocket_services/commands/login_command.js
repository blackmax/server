const authService = require("../../services/auth_service");

module.exports = async function(data){
    const user = await authService.checkUserAuth(data.authData, data.service);
    return user;
};