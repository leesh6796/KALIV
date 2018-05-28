var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    type: Number,
    userList: [Schema.Types.ObjectId],
    messageList: [Schema.Types.ObjectId],
    creationDate: [type: Date, default: Date.now]
});

module.exports = mongoose.model('chatRoom', chatRoomSchema);
