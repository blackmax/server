module.exports = async ({services, socket, data}) => {
    const user = await services.registerService.registerUser(data);
    socket.emit("profile", {
        user: await services.user.getFullProfile(user.user.token)
    });
};