module.exports = async ({services, data, socket}) => {
    const result = await services.user.changeIcon(data.icon_id);
    if (!result) {
        return socket.emit("update_icon", {_error : "RELOAD"});
    }
    await services.user.save();
    socket.emit("update_icon", {icons: "ICON_CHANGED"});
};