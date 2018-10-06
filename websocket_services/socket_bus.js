const events = {
    message: ctx => {
        ctx.logger.info(data);
    },
    __ping: ctx => new Promise((resolve, reject) => {
        ctx.socket.emit("__pong")
        setTimeout(() => {
            ctx.logger.info("resolving");
            resolve()
        }, 2000);
    })
};

module.exports = (ctx) => {
    Object.keys(events).forEach(key => ctx.socket.on(key, async (data) => {
        const parsedData = JSON.parse(data);
        ctx.logger.info(`[${key}]  message received`);
        ctx.logger.debug(`received data: \n${data}`);
        await events[key]({...ctx, action: key, events, data: parsedData});
        ctx.logger.info(`[${key}] message handled`);
    }));
};