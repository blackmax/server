module.exports = async function ({services, data, socket}) {
    const user = await services.user.getUser(data.token);
    const droppedItems = await services.drop_service.handleDrop(user, data.container_id);
    socket.emit('drop', {items: droppedItems});
};