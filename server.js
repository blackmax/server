const socket = require('config').get('socket');
const logger = require('./logger');
const createUserBus = require('./websocket_services/socket_bus');
const db = require("./models")({logger});
const services = require('./services');

const io = require('socket.io')({
    transports: ['websocket'],
});

io.attach(socket.port, function () {
    logger.info("Socket started on port: " + socket.port);
});

io.on('connection', function (socket) {
    logger.info("user connected");
    // создаем локальные сервисы в памяти существующие внутри подключения юзера
    const privateServices = services({logger, socket, db});
    // создаем контекст
    const ctx = {logger, socket, db, io, services: privateServices};
    // подключаем всё к событиям
    createUserBus(ctx);
});