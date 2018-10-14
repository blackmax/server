module.export = async ({socket, services, data}) => {
    const user = await services.user.getUser(data.token);
    const userCar = await services.car_service.changeSkin(user.id, data.car_id, data.skin_id);
    if (!userCar) {
        socket.emit('status', {status: 'RELOAD'});
    }

    socket.emit('status', {status: 'SKIN_CHANGED'});
};