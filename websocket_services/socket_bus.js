const loginCommand = require('./commands/login_command');
const registerCommand = require('./commands/register_command');
const userCars = require('./commands/user_cars');
const query = require('./commands/query_command');
const buy_car = require('./commands/buy_car');
const add_currency = require('./commands/add_currency');

const events = {
    super_event: loginCommand,
    register: registerCommand,
    user_cars: userCars,
    query,
    buy_car,
    add_currency
};

module.exports = (ctx) => {
    Object.keys(events).forEach(key => ctx.socket.on(key, async (data) => {
        ctx.logger.info({message: `message received`, socketId: ctx.socket.id, event: key});
        ctx.logger.debug(`received data: ${data}`);
        console.time("handle time");
        try {
            try {
                const parsedData = JSON.parse(data);
            } catch () {
                const parsedData = data;
            }
            if (parsedData.token) {
                await ctx.services.user.loadUserByToken(parsedData.token);
            }

            await events[key]({
                ...ctx,
                action: key,
                events,
                data: parsedData,
            });
        } catch (e) {
            ctx.logger.error(e.toString());
            ctx.socket.emit('_error', e.toString());
        }
        ctx.logger.info({message: `message handled`, socketId: ctx.socket.id, event: key});
        console.timeEnd("handle time");
    }));
};