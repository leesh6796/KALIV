var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


var chatRoomSchema = new Schema({
    name: {type: String, unique: true},
    type: Number,
    userList: [{type: Schema.Types.ObjectId, ref: 'user'}],
    //messageList: [{type: Schema.Types.ObjectId, ref: 'message'}],
    creationDate: {type: Date, default: Date.now},
});

chatRoomSchema.methods = {
    hasUser: async function(userID)
    {
    	let userList = await this.userList;

    	let i;
    	let exists = false;
    	for(i=0; i<userList.length; i++)
    	{
    		if(userList[i].toString() === userID.toString())
    		{
    			exists = true;
    		}
    	}

    	return exists;
    },

    addUser: async function(userID)
    {
    	this.userList.push(userID);
    	this.save();
    },
};

chatRoomSchema.statics = {
	isOverlap: async function(roomName)
	{
		try
        {
            let res = await this.find({"name": roomName});
            let count = Object.keys(res).length;
            return !(count === 0);
        }
        catch(err)
        {
            console.error(err);
            return true;
        }
	},

	findRoomName: async function(roomID)
	{
		let res = await this.findOne({_id: roomID});
		if(res !== null)
			return res.name;
		else
			return '';
	},

	findRoomID: async function(roomName)
	{
		let res = await this.find({'name': roomName});
		if(res.length > 0)
		{
			return res[0]._id;
		}
		else return null;
	},
};

module.exports = db.model('chatRoom', chatRoomSchema);
