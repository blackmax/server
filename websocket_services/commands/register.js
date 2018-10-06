module.exports = async ({services, socket}) => {
    const user = await services.registerService.registerUser();
    socket.emit("profile", {user})
}