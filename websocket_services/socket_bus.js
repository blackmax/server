const loginCommand = require('./commands/login_command');
const registerCommand = require('./commands/register_command');
const userCars = require('./commands/user_cars');
const query = require('./commands/query_command');
const services = require('./services');

const events = {
    super_event: loginCommand,
    register: registerCommand,
    user_cars: userCars,
    query,
};

module.exports = (ctx) => {
    Object.keys(events).forEach(key => ctx.socket.on(key, async (data) => {
        ctx.logger.info({message: `message received`, socketId: ctx.socket.id, event: key});
        ctx.logger.debug(`received data: ${data}`);
        console.time("handle time");
        const parsedData = JSON.parse(data);
        try {
            await events[key]({
                ...ctx,
                services: services({...ctx, data: parsedData}),
                action: key,
                events,
                data: parsedData,
            });
        } catch (e) {
            ctx.logger.error(e.toString());
            ctx.socket.emit('_' +
                'error', e.toString());
        }
        console.timeEnd("handle time");
        ctx.logger.info({message: `message handled`, socketId: ctx.socket.id, event: key});
    }));
};