var User = require('./model').user;
var ChatRoom = require('./model').chatRoom;

var Chat = require('./chat');

module.exports = {
	commandProcess : function(req, res)
	{
		let command = req.body.command;
		let arr = command.split('$');

		if(arr[0] == 'enterChatRoom')
		{
			let roomName = arr[1];
			let username = arr[2];

			Chat.enterRoom()
		}
	},
};