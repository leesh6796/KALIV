var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    sentDate: {type: Date, default: Date.now},
    type: Number,
    sender: Schema.Types.ObjectId,
    parentChatRoom: Schema.Types.ObjectId,

    // Text Message
    Text: String,

    // File Message
    fileName: String,
    fileURL: String,
    fileType: Number,
});

module.exports = mongoose.model('message', messageSchema);
