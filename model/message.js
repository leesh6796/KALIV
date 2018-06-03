var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    chatRoom: {type: Schema.Types.ObjectId, ref: 'chatRoom'},
    sentDate: {type: Date, default: Date.now},
    type: Number,
    sender: {type: Schema.Types.ObjectId, ref: 'user'},

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
