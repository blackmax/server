const loginCommand = require('./commands/login_command');
const registerCommand = require('./commands/register_command');
const userCars = require('./commands/user_cars');
const query = require('./commands/query_command');
const services = require('../services');
const buy_car = require('./commands/buy_car');
const profile = require("./commands/profile");
const add_currency = require('./commands/add_currency');
const icon_changed = require('./commands/icon_changed');
const status = require('./commands/status');
const car_skin_changed = require('./commands/car_skin_changed');
const levelFinished = require('./commands/adventure_level_finished');
const drop = require('./commands/drop');
const car_upgrade = require('./commands/car_upgrade');

const events = {
    super_event: loginCommand,
    register: registerCommand,
    //юзер завершил уровень
    level_finished: levelFinished,
    user_cars: userCars,
    //login_by_service
    //auth[facebook]
    //level_finished
    //adv_watched
    car_upgraded: car_upgrade,

    //parts_upgraded
    //container_purchased
    //mission_finished
    //start_container_opening
    //открыть контейнер за донат
    query,
    profile,
    buy_car,
    add_currency,
    icon_changed,
    status,
    car_skin_changed,
    drop,
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

            const result = await events[key]({
                ...ctx,
                action: key,
                events,
                data: parsedData,
            });

            if(result === undefined){
                return true;
            }

            if(result.errors !== undefined){
                ctx.socket.emit(key, {success: false, ...result});
            }
        
            ctx.socket.emit(key, {success: true, ...result});

        } catch (e) {
            ctx.logger.error({message: e.toString()});
            ctx.socket.emit('_error', e.toString());
            if (process.env.NODE_ENV !== 'PRODUCTION') {
                throw e;
            }
        }
        ctx.logger.info({message: `message handled`, socketId: ctx.socket.id, event: key});
        console.timeEnd("handle time");
    }));
};