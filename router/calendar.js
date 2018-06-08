var mongoose = require('mongoose');
var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;
var Calendar = require('./model').calendar;
var _ = require('underscore');

module.exports = {
	bindCalendar: async function(req, res)
	{
		let roomID = req.params.roomID;

		let found = await Calendar.findOne({roomID: roomID});
		if(found === null)
		{
			var newCalendar = new Calendar();
			console.log("TESt : %s", roomID);
			newCalendar.roomID = roomID;
			newCalendar.eventList = [];
			await newCalendar.save();

			ChatRoom.findOne({_id: roomID})
				.then((room) => {
					room.type = 1;
					room.save();
				});
		}

		res.redirect('/');
	},
};