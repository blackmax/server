module.exports = async ({services, data, socket}) => {
    const result = await services.user.changeIcon(data.icon_id);
    if (!result) {
        return socket.emit("icon", {status: "RELOAD"});
    }
    await services.user.save();
    socket.emit("icon", {status: "ICON_CHANGED"});
};