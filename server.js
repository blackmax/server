const socket = require('config').get('socket');
const logger = require('./logger');
const createUserBus = require('./websocket_services/socket_bus');
const db = require("./models")({logger});

const io = require('socket.io')({
    transports: ['websocket'],
});

io.attach(socket.port, function () {
    logger.info("Socket started on port: " + socket.port);
});

io.on('connection', function (socket) {
    logger.info("user connected");
    userBus = createUserBus({logger, socket, db, io});
});