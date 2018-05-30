var socketio = require('socket.io');
var User = require('./model').user;
var _ = require('underscore');

/*

disconnect : 채팅방에서 퇴장한다 => socket의 접속자 리스트에서 삭제
exit : 채팅방에서 퇴장한다 => socket의 접속자 리스트, DB의 참가자 목록에서 삭제
join {roomID: Number username: String} : 채팅방에 입장한다. DB에 추가하지 않는다. socket의 접속자 리스트에만 추가한다.
newMessage {username: String, msg: String} : 클라이언트가 새로운 메세지를 보낸다.

*/


var clients = {}; // chatroom id를 key로 가지고, value는 {id: SocketID, username: String} list

function init(server)
{
	var io = socketio(server);

	io.on('connection', function(socket)
	{
		console.log("[chat] Socket Connected id = " + socket.id);

		socket.on('join', function(params)
		{
			let roomID = params.roomID;
			let username = params.username;

			if(!(roomID in clients)) // 없으면 새로운 array 생성
			{
				clients[roomID] = [];
			}
			
			clients[roomID].push({id: socket.id, username: username});
			console.log(clients);
		})

		socket.on('disconnect', function() // 퇴장하면서 연결된 채팅방 모두 접속 끊는다.
		{
			console.log("[chat] Socket Disconnected id = " + socket.id);

			_.each(clients, function(room, roomID) // val, key
			{
				clients[roomID] = _.without(room, _.findWhere(room, {id: socket.id}));
				console.log('after');
			});
		});

		socket.on('newMessage', function(params)
		{
			username = params.username;
			msg = params.msg;
			console.log("[chat] message : " + msg);
		});
	});

	return io;
}

module.exports = init;