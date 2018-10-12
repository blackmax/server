module.exports = async ({data, socket, services}) => {
    const user = await services.user.getFullProfile(data.token);

    socket.emit('profile', {user});
};