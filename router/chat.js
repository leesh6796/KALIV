var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;

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
			newRoom.userList = [userID];

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
			}
			res.send('/chat/'+ room._id);
			//res.redirect('/chat/'+ room._id);
		}
	},

	/*isOverlap : async function(req, res)
	{
		let roomName = req.params.roomName.toString();

		isOverlap = ChatRoom.isOverlap(roomName);
		if(isOverlap) // 중복이면
		{
			res.send({result:"overlap"});
		}
		else
		{
			res.send({result:"success"});
		}
	},*/
};