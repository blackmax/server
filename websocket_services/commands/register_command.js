module.exports = async ({services, socket, data}) => {
    const user = await services.registerService.registerUser(data);
    socket.emit("profile", await services.user.getFullProfile(user.token));
};