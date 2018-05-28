var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
    name: {type: String, unique: true},
    type: Number,
    userList: [Schema.Types.ObjectId],
    messageList: [Schema.Types.ObjectId],
    creationDate: {type: Date, default: Date.now},
});

module.exports = db.model('chatRoom', chatRoomSchema);
