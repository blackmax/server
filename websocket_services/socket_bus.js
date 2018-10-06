const loginCommand = require('./commands/login_command');

const events = {
    super_event: loginCommand
};

module.exports = (ctx) => {
    Object.keys(events).forEach(key => ctx.socket.on(key, async (data) => {
        const parsedData = JSON.parse(data);
        ctx.logger.info({message: `message received`, socketId: ctx.socket.id, event: key});
        ctx.logger.debug(`received data: \n${data}`);

        await events[key]({
            ...ctx,
            action: key,
            events,
            data: parsedData
        });

        ctx.logger.info({message: `message handled`, socketId: ctx.socket.id, event: key});
    }));
};