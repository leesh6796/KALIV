var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    password: String,
    email: String,
    signupDate: { type: Date, default: Date.now },
    enterChatRoomList: [Schema.Types.ObjectId],
    profilePictureURL : String,
    hateIndex: Number,
    blockIndex: Number,
});

module.exports = mongoose.model('user', userSchema); // first parameter는 schema name. schema name의 복수형을 collection name으로 사용한다.
