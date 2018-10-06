const loginCommand = require('./commands/login_command');
const registerCommand = require('./commands/register_command');
const userCars = require('./commands/user_cars');

const events = {
    super_event: loginCommand,
    register: registerCommand,
    user_cars: userCars
};

module.exports = (ctx) => {
    Object.keys(events).forEach(key => ctx.socket.on(key, async (data) => {
        ctx.logger.info({message: `message received`, socketId: ctx.socket.id, event: key});
        ctx.logger.debug(`received data: ${data}`);
        console.time("handle time");
        await events[key]({
            ...ctx,
            action: key,
            events,
            data: JSON.parse(data),
        });
        console.timeEnd("handle time");
        ctx.logger.info({message: `message handled`, socketId: ctx.socket.id, event: key});
    }));
};