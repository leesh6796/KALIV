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
			if(!(userID in room.userList))
			{
				console.log('add User');
				room.addUser(userID);

				let me = await User.findOne({username:username});
				await me.enterChatRoom(room._id);
			}
			//res.send('/chat/'+ room._id);
			res.redirect('/chat/'+ room._id);
		}
	},

	getEnterRoomList: async function(req, res)
	{
		res.send(req.session.enterChatRooms);
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