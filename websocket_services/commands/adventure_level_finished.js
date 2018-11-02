module.exports = async ({services, data, socket}) => {
    const adventureLevel = await services.user.earnAdventureLevel(data.stars, data.time, data.level_id.data.level_type);
    if (!adventureLevel) {
        return socket.emit('_error', {status: 'RELOAD'});
    }

    socket.emit('adventure_level', {level: adventureLevel});
};