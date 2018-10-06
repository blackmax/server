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
        ctx.logger.info("handling socket message " + key + ":");
        data && ctx.logger.info(data);
        await events[key]({...ctx, action: key, events, data});
        ctx.logger.info("handling finished " + key)
    }));
};