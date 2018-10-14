module.exports = (ctx) => ({
    registerService: require("./register_service")(ctx),
    user: require('./user')(ctx),
    car_service: require('car_service')(ctx),
});