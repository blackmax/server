/*
    ctx - содержит services (/services) , db (/models), data(информация из запроса), socket(сокет юзера)
    в сервисах лежит авторизованный пользователь если прислан токен data.token
 */
module.exports = async function (ctx) {
    //модели из db - смотреть документацию sqilize
    // ищем в бд
    const userCars = await ctx.db.user_cars.findAll({
        where: {
            user_id: ctx.services.user.getModel().id,
        }
    });
    //назначаем имя юзеру
    const user = ctx.services.user.getModel();
    user.name = data.name;
    // метод из документации sqilize
    await user.save();

    //user.create();
    //user.findOne();
    //user.count();
    //http://docs.sequelizejs.com/manual/tutorial/models-usage.html
    //http://docs.sequelizejs.com/manual/tutorial/querying.html

    //что бы сообщить пользователю
    // 1 аргумент - канал, 2 аргумент - данные
    socket.emit('on_example', {
        user: user,
        user_cars: userCars,
    });
};