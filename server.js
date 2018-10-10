const socket = require('config').get('socket');
const logger = require('./logger');
const createUserBus = require('./websocket_services/socket_bus');
const db = require("./models")({logger});

const io = require('socket.io')({
    transports: ['websocket'],
});

io.attach(socket.port, function () {
    logger.info("socket started at port " + socket.port);
});

io.on('connection', function (socket) {
    logger.info("user connected");
    const userBus = createUserBus({logger, socket, db, io});
});
