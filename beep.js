var io = require('socket.io')({
	transports: ['websocket'],
});

io.attach(7777);


io.on('connection', function(socket){

	socket.on('beep', function(){
		//ДЛЯ ВСЕХ
        io.sockets.emit('boop', {some: socket.id});

        // ДЛЯ ОДНОГО
		socket.emit('boop', { some: socket.rooms });
	});
	
	socket.on('getUser', function (data) {
		console.log(data);
		socket.emit('userData', {some: data});
    });


});

