var socketio = require('socket.io');

var clients = {}; // chatroom id를 key로 가지고, value는 socket id list

function init(server)
{
	var io = socketio(server);

	io.on('connection', function(socket) {
		console.log("[chat] Socket Connected id = " + socket.id);

		socket.on('disconnect', function() {
			console.log("[chat] Socket Disconnected id = " + socket.id);
		});

		socket.on('chat message', function(msg) {
			console.log("[chat] message : " + msg);
		});
	});

	return io;
}

module.exports = init;