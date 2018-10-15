module.exports = async ({socket, services, data}) => {
    const user = await services.user.getUser(data.token);
    const {car_id, upgrade_type} = data;
    const result = await services.car_service.upgradeCar(user, car_id, upgrade_type);

    if (!result) {
        socket.emit('status', {status: 'RELOAD'});
    }

    socket.emit('status', {status: 'CAR_UPGRADED'});
};