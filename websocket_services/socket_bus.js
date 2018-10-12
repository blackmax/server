const loginCommand = require('./commands/login_command');
const registerCommand = require('./commands/register_command');
const userCars = require('./commands/user_cars');
const query = require('./commands/query_command');
const services = require('../services');
const buy_car = require('./commands/buy_car');
const profile = require("./commands/profile");
const add_currency = require('./commands/add_currency');
const icon_changed = require('./commands/icon_changed');

const events = {
    super_event: loginCommand,
    register: registerCommand,
    user_cars: userCars,
    query,
    profile,
    buy_car,
    add_currency,
    icon_changed,
};

function parseData(incomingData) {
    switch (typeof incomingData) {
        // если пришла строка - может быть джсон
        case 'string':
            try {
                //  пытаемся распарсить джсон
                return JSON.parse(incomingData)
            } catch (e) {
                // если ошибка, значит просто строка
                return incomingData;
            }
        default:
            // остальные типы возвращаем без изменений
            return incomingData;
    }
}

module.exports = (ctx) => {
    Object.keys(events).forEach(key => ctx.socket.on(key, async (data) => {
        ctx.logger.info({message: `message received`, socketId: ctx.socket.id, event: key});
        ctx.logger.debug(`received data: ${data}`);
        console.time("handle time");
        try {
            // парсим исходные данные
            const parsedData = parseData(data);

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