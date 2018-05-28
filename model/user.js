var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    email: {type: String, unique: true},
    kaistVerification: {type: Boolean, Default: false},
    signupDate: { type: Date, default: Date.now },
    enterChatRoomList: {type: [Schema.Types.ObjectId], default: []},
    profilePictureURL: {type: String, default: ""},
    hateIndex: {type: Number, default: 0},
    blockIndex: {type: Number, default: 0},
});

userSchema.statics = {
    checkOverlap: async function(username, email)
    {
        try
        {
            let res = await this.find({"username": username, "email": email});
            let count = Object.keys(res).length;
            return !(count === 0);
        }
        catch(err)
        {
            console.error(err);
        }
    },
};

module.exports = db.model('user', userSchema); // first parameter는 schema name. schema name의 복수형을 collection name으로 사용한다.
