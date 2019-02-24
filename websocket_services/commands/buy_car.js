module.exports = async ctx => {
    const user = await ctx.services.user.getUser(ctx.data.token);
    const result = await ctx.services.car_service.buyCar(user, ctx.data.car_id);

    return result;
};