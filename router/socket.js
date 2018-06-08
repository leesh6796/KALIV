var socketio = require('socket.io');
var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;
var Message = require('./model').message;
var Calendar = require('./model').calendar;
var _ = require('underscore');

/*

disconnect : 채팅방에서 퇴장한다 => socket의 접속자 리스트에서 삭제
exit : 채팅방에서 퇴장한다 => socket의 접속자 리스트, DB의 참가자 목록에서 삭제
join {roomID: Number, nickname: String} : 채팅방에 입장한다. DB에 추가하지 않는다. socket의 접속자 리스트에만 추가한다.
new_message {chatroom: Integer, nickname: String, msg: String} : 클라이언트가 새로운 메세지를 보낸다.
*/


var clients = {}; // chatroom id를 key로 가지고, value는 {sockID: SocketID, nickname: String} list

function init(server)
{
	var io = socketio(server);

	io.on('connection', function(socket)
	{
		console.log("[chat] Socket Connected id = " + socket.id);

		socket.on('join', async function(params)
		{
			let i;
			let roomName = '';
			let roomID = params.roomID;
			let username = params.username;
			let nickname = await User.getNickname(username);

			if(!(roomID in clients)) // 없으면 새로운 array 생성
			{
				clients[roomID] = [];
			}

			// 클라이언트는 join type 받으면, 자기가 가지고 있는 접속자 목록과 비교해 없으면 리스트에 새로 추가한다.
			_.each(clients[roomID], (member) => {
				console.log('%s에게 join', member.nickname);
				io.to(member.sockID).emit('chat_member_change', {type: 'join', chatroom: roomID, nickname: nickname})
			});
			
			// clients[roomID]에 접속한 client 추가
			clients[roomID].push({sockID: socket.id, nickname: nickname});

			// 새로 접속한 클라이언트에게는 접속자 모두를 보내준다.
			let room = await ChatRoom.findOne({_id: roomID});
			roomName = room.name;

			// 채팅방 이름을 보내준다.
			socket.emit('room_name', {roomName: roomName});

			// 접속자 목록을 보내준다.
			let userList = room.userList;
			let members = [];
			for(i=0; i<userList.length; i++)
			{
				let nick = await User.getNicknameById(userList[i]);
				members.push(nick);
			}
			socket.emit('chat_member_change', {type:'update', chatroom: roomID, members: members});

			// 채팅방의 기존 메세지들을 보내준다.
			let foundMessages = await Message.getMessages(roomID, 0);
			let messages = [];

			for(i=0; i<foundMessages.length; i++)
			{
				let senderID = foundMessages[i].sender;
				let nick = await User.getNicknameById(senderID)

				messages.push({
					nickname: nick,
					text: foundMessages[i].Text,
					timestamp: foundMessages[i].timestamp
				});
			}
			socket.emit('load_message', messages);

			// 캘린더 채팅방이면, 이벤트들을 보내준다.
			if(room.type === 1)
			{
				let cal = await Calendar.findOne({roomID: roomID});
				if(cal.eventList.length > 0) socket.emit('load_event', cal.eventList);
			}

			// ignore list를 보내준다.
			let ignoreList = await User.getIgnoreList(username);
			let ignores = []

			for(i=0; i<ignoreList.length; i++)
			{
				let targetID = ignoreList[i];
				let targetNick = await User.getNicknameById(targetID);

				ignores.push(targetNick);
			}
			socket.emit('load_ignore', ignores);

			console.log(clients);
		});

		socket.on('exit', async function(params) // 채팅방 퇴장
		{
			let roomID = params.roomID;
			let roomName = await ChatRoom.findRoomName(roomID);
			let username = params.username;
			let userID = await User.getUserID(username);
			let nickname = await User.getNickname(username);

			let userSch = await User.findOne({_id: userID});
			userSch.exitChatRoom(roomID);

			let roomSch = await ChatRoom.findOne({_id: roomID});
			roomSch.removeUser(userID);

			// exit이 성공했음을 알린다.
			socket.emit('exit_success', {});

			console.log("[chat] %s exit from %s", username, roomName);

			clients[roomID] = _.without(clients[roomID], _.findWhere(clients[roomID], {sockID: socket.id}));
			console.log(clients[roomID]);

			// 클라이언트는 exit type 받으면, 자기가 가지고 있는 접속자 목록과 비교해 있으면 리스트에서 지운다.
			_.each(clients[roomID], (member) => {
				io.to(member.sockID).emit('chat_member_change', {type: 'exit', chatroom: roomID, nickname: nickname})
			});
		});

		socket.on('disconnect', function() // 퇴장하면서 연결된 채팅방 모두 접속 끊는다.
		{
			console.log("[chat] Socket Disconnected id = " + socket.id);

			_.each(clients, function(room, roomID) // val, key
			{
				clients[roomID] = _.without(room, _.findWhere(room, {sockID: socket.id}));
			});

			console.log('clients list');
			console.log(clients);
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
				io.to(member.sockID).emit('new_message', {type: 0, nickname: nickname, text: message, timestamp: timestamp});
			});
		});

		socket.on('new_event', async function(params)
		{
			//console.log(params);
			let nickname = params.nickname;
			let roomID = params.roomID;
			let eventID = params.eventID;
			let eventName = params.eventName;
			let startDate = params.startDate;
			let endDate = params.endDate;
			let allDay = params.allDay;

			let cal = await Calendar.findOne({roomID: roomID});
			if(cal !== null)
			{
				cal.addEvent(eventID, eventName, startDate, endDate, allDay);

				_.each(clients[roomID], (member) => {
					if(member.nickname !== nickname)
					{
						io.to(member.sockID).emit('new_event', {
							eventID: eventID,
							eventName: eventName,
							startDate: startDate,
							endDate: endDate,
							allDay: allDay,
						});
					}
				});
			}
			else
			{
				console.log("null이다.");
			}
		});

		socket.on('remove_event', async function(params)
		{
			let nickname = params.nickname;
			let roomID = params.roomID;
			let eventID = params.eventID;

			let cal = await Calendar.findOne({roomID: roomID});
			cal.removeEvent(eventID);

			_.each(clients[roomID], (member) => {
				if(member.nickname !== nickname)
				{
					io.to(member.sockID).emit('remove_event', {
						eventID: eventID,
					});
				}
			});
		});

		socket.on('add_ignore', async function(params)
		{
			let roomID = params.roomID;
			let username = params.username;
			let targetNick = params.targetNick;
			let targetID = await User.getUserIDbyNick(targetNick);

			let me = await User.findOne({username: username});
			me.addIgnore(targetID);
		});

		socket.on('remove_ignore', async function(params)
		{
			let roomID = params.roomID;
			let username = params.username;
			let targetNick = params.targetNick;
			let targetID = await User.getUserIDbyNick(targetNick);

			let me = await User.findOne({username: username});
			me.removeIgnore(targetID);
		});
	});

	return io;
}

module.exports = init;