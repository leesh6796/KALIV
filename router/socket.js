var socketio = require('socket.io');
var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;
var Message = require('./model').message;
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

			// 클라이언트는 join type 받으면, 자기가 가지고 있는 접속자 목록과 비교해 없으면 리스트에 새로 추가한다.
			_.each(clients[roomID], (member) => {
				io.to(member.sockID).emit('chat_member_change', {type: 'join', chatroom: roomID, nickname: nickname})
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

		socket.on('new_message', async function(params)
		{
			let username = params.username;
			let userID = await User.getUserID(username);
			let roomID = params.roomID;
			let nickname = await User.getNickname(username);
			let message = params.message;
			let timestamp = new Date(Date.now());

			Message.addTextMessage(userID, roomID, timestamp, message);
			console.log("[chat] [roomID = %s] %s : %s", roomID, nickname, message);

			_.each(clients[roomID], (member) => {
				// 특정 소켓에게 보낼 때에는 io.to(sockID).emit 사용한다.
				io.to(member.sockID).emit('new_message', {type: 0, nickname: nickname, message: message});
			});
		});
	});

	return io;
}

module.exports = init;