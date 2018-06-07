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
    addTextMessage: async function(sender, roomID, sentDate, message) // sender는 userID
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

    /*getMessages: async function(roomID, page) // page=1부터 시작. page * 100개씩 가져온다.
    {
        const perPage = 100;
        let docCount = await this.count({});
        let skip = docCount - page * perPage;
        let N = perPage;

        if(skip < 0) // 100개보다 적게 남으면
        {
            N = perPage + skip;
            skip = 0;
        }

        let messages = await this.find({chatRoom: roomID}).skip(skip).limit(N);
        return messages;
    },*/

    getMessages: async function(roomID, nowCount) // 현재 가지고 있는 메세지 개수를 변수로 받는다.
    {
        // 전체 메세지가 115개고, 100개를 가지고 있으면, 앞에 15개만 보여주는 식
        let docCount = await this.count({});
        const perPage = 1000;
        let skip = (docCount - nowCount) < perPage ? 0 : (docCount - nowCount - perPage);
        let N = (docCount - nowCount) < perPage ? (docCount - nowCount) : perPage;

        let messages = await this.find({chatRoom: roomID}).skip(skip).limit(N);
        return messages;
    },
};

module.exports = db.model('message', messageSchema);
