const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('config').get('server');

app.get('/ping', function (req, res) {
    res.send('pong');
});

http.listen(config.port, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});

