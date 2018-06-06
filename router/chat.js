var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;
var _ = require('underscore');

module.exports = {
	enterRoom : async function(req, res)
	{
		let roomName = req.body.roomName.toString();
		let username = req.body.username.toString();
		let userID = await User.getUserID(username);

		let isOverlap = await ChatRoom.isOverlap(roomName);
		if(!isOverlap) // 없으면 새로 만들어야 한다.
		{
			var newRoom = new ChatRoom();
			newRoom.name = roomName;
			newRoom.creationDate = (new Date(Date.now())).toString();
			newRoom.userList = [];

			await newRoom.save();
			console.log('[ChatRoom] New Chatroom is made (name : ' + roomName + ')');
		}

		let room = await ChatRoom.findOne({name: roomName})
		if(room !== null)
		{
			let hasUser = await room.hasUser(userID);
			if(!hasUser)
			{
				console.log('add User ' + username + ' into ' + roomName);
				room.addUser(userID);

				let me = await User.findOne({username:username});
				await me.enterChatRoom(room._id);

				req.session.enterChatRooms.push(roomName);
			}
			//res.send('/chat/'+ room._id);
			res.send('/chat/'+ room._id);
		}
	},

	getEnterRoomList: async function(req, res)
	{
		res.send(req.session.enterChatRooms);
	},

	getUsername: async function(req, res)
	{
		res.send(req.session.username);
	},

	getNickname: async function(req, res)
	{
		res.send(req.session.nickname);
	},

	getRoomNames: async function(roomList) // [roomID] => [roomName]
	{
		let roomNames = [];

		let i;
		for(i=0; i<roomList.length; i++)
		{
			let room = await ChatRoom.findOne({_id: roomList[i]});
			roomNames.push(room.name);
		}

		return roomNames;
	},
};