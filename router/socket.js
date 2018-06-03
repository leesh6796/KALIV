var socketio = require('socket.io');
var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;
var _ = require('underscore');

/*

disconnect : 채팅방에서 퇴장한다 => socket의 접속자 리스트에서 삭제
exit : 채팅방에서 퇴장한다 => socket의 접속자 리스트, DB의 참가자 목록에서 삭제
join {roomID: Number, username: String} : 채팅방에 입장한다. DB에 추가하지 않는다. socket의 접속자 리스트에만 추가한다.
new_message {chatroom: Integer, username: String, msg: String} : 클라이언트가 새로운 메세지를 보낸다.
*/


var clients = {}; // chatroom id를 key로 가지고, value는 {sockID: SocketID, username: String} list

function init(server)
{
	var io = socketio(server);

	io.on('connection', function(socket)
	{
		console.log("[chat] Socket Connected id = " + socket.id);

		socket.on('join', async function(params) // 유저 목록은 ajax로 db에 직접 요청하자
		{
			let roomID = params.roomID;
			let username = params.username;
			let nickname = await User.getNickname(username);

			if(!(roomID in clients)) // 없으면 새로운 array 생성
			{
				clients[roomID] = [];
			}

			_.each(clients[roomID], (member) => {
				io.sockets(member.sockID).emit('chat_member_change', {type: 'join', chatroom: roomID, members: nickname})
			});
			
			// clients[roomID]에 접속한 client 추가
			clients[roomID].push({sockID: socket.id, username: nickname});

			// 새로 접속한 클라이언트에게는 접속자 모두를 보내준다.
			let memberList = _.pluck(clients[roomID], 'username');
			socket.emit('chat_member_change', {type:'update', chatroom: roomID, members: memberList});

			console.log(clients);
		});

		socket.on('disconnect', function() // 퇴장하면서 연결된 채팅방 모두 접속 끊는다.
		{
			console.log("[chat] Socket Disconnected id = " + socket.id);

			_.each(clients, function(room, roomID) // val, key
			{
				clients[roomID] = _.without(room, _.findWhere(room, {id: socket.id}));
				console.log('after');
			});
		});

		socket.on('new_message', function(params)
		{
			let username = params.username;
			let chatroom = params.chatroom;
			let nickname = params.nickname;

			timestamp = new Date(Date.now());
			msg = params.msg;
			console.log("[chat] message : " + msg);
		});
	});

	return io;
}

module.exports = init;