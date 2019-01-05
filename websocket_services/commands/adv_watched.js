module.exports = async ({services, socket, data}) => {
    const user = await services.user.getUser(data.token);
    await services.container_service.subTimeFromFristSlot(user, 100);
    const drop = await services.container_service.dropPossibleContainers(user);

    if(drop != null){
        socket.emit('drop', {items: drop});
    }
};