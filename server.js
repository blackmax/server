const user = require('./services/user_services.js');

var net = require('net');
const {host, port} = require('config').get('server');

var server = net.createServer();
server.listen(port, host);

server.on('connection', function(sock) {
    //sock.setTimeout(3000);
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    sock.write("TCP sending message : l");

    sock.on('data', function (buffer) {
        const message = new MessageParser(buffer.toString());
        message.executeCommand()
            .then(data => {
               //send data to user;
            });
    });

    sock.on('close', function () {
        console.log("CLOSE!");
    });

    sock.on('end', function () {
        console.log("END!");
    });

    sock.on('timeout', function () {
        console.log("TimeOut!");
    });

    sock.on('error', function (error) {
        console.log(error);
    });
});


server.on('listening', function () {
    console.log('Server listening on ' + server.address().address + ':' + server.address().port);
});

user().GetAllUsers().then(function (users) {
    users.map(function (user) {
        console.log(user.token);

        user.token = 4444;
        user.save();

    })
});