module.exports = async ctx => {
    const result = await ctx.services.user.buyCar(ctx.data.car_id);
    if (result) {
        ctx.socket.emit('buy_car', {success: true});
    }
};