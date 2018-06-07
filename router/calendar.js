var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;
var Calendar = require('./model').calendar;
var _ = require('underscore');

module.exports = {
	bindCalendar: async function(req, res)
	{
		let roomID = req.params.roomID;

		var newCalendar = new Calendar();
		newCalendar.parentRoom = roomID;
		newCalendar.eventList = [];
		newCalendar.save();
	},

	getEnterRoomList: async function(req, res)
	{
		res.send(req.session.enterChatRooms);
	},

	getNameInfo: async function(req, res)
	{
		let nameInfo = {
			username: req.session.username,
			nickname: req.session.nickname
		};

		res.send(nameInfo);
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