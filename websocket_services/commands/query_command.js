module.exports = async ({data, db, socket, logger}) => {
    const allowedModels = ['cars', 'icons'];
    logger.debug(`query command for model ${data.model}`);
    if (allowedModels.indexOf(data.model) === -1) {
        logger.error(`rejected model ${data.model}`);
        socket.emit('_error', {error: 'REJECTED_MODEL'});
        return false;
    }

    const model = db[data.model];
    if (model === undefined) {
        logger.error("query model not found");
        socket.emit('_error', {error: 'MODEL_NOT_FOUND'});
        return false;
    }
    const attributes = data.attributes;

    const dbData = await model.findAll({
        attributes,
    });

    socket.emit("query", {
        model,
        attributes,
        [data.model]: dbData,
    });

    return true;
};