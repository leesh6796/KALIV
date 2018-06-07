var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    chatRoom: {type: Schema.Types.ObjectId, ref: 'chatRoom'},
    sentDate: {type: Date, default: Date.now},
    type: Number, // 0이면 Text, 1이면 File
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

messageSchema.statics = {
    addTextMessage: async function(sender, roomID, sentDate, message)
    {
        let newMessage = new this({
            sender: sender,
            chatRoom: roomID,
            type: 0,
            sentDate: sentDate,
            Text: message
        });
        await newMessage.save();
    },

    getMessages: async function(skip, count) // skip개 건너뛰고 count개 가져온다.
    {

    },
};

module.exports = db.model('message', messageSchema);
