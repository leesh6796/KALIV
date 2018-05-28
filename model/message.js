var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    sentDate: {type: Date, default: Date.now},
    type: Number,
    sender: Schema.Types.ObjectId,
    parentChatRoom: Schema.Types.ObjectId,

    // Text Message
    Text: String,

    // File Message
    File: {
        fileName: String,
        fileURL: String,
        fileType: Number,
    }
});

module.exports = db.model('message', messageSchema);
