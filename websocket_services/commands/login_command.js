const authService = require("../../services/auth_service");

module.exports = async function(ctx){
    ctx.socket.emit('profile', await ctx.db.users.all())
};