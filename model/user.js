var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    email: {type: String, unique: true},
    nickname: {type: String, unique: true},
    verifyToken: String,
    kaistVerification: {type: Boolean, default: false},
    signupDate: { type: Date, default: Date.now },
    enterChatRoomList: {type: [Schema.Types.ObjectId], default: []},
    profilePictureURL: {type: String, default: ""},
    hateIndex: {type: Number, default: 0},
    blockIndex: {type: Number, default: 0},
});

userSchema.methods = {
    verify: async function()
    {
        this.kaistVerification = true;
        var result = await this.save(function(err){
            if(err) return -1;
            return 0;
        });

        return result;
    },
};

userSchema.statics = {
    checkOverlapEmail: async function(username, email)
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
            return true;
        }
    },

    checkOverlapNickname : async function(nickname)
    {
        try
        {
            let res = await this.find({"nickname": nickname});
            let count = Object.keys(res).length;
            return !(count === 0);
        }
        catch(err)
        {
            console.error(err);
            return true;
        }
    },

    signIn: async function(username, password)
    {
        try
        {
            let res = await this.find({"username": username, "password": password});
            return res.length === 1 && res[0].kaistVerification;
        }
        catch(err)
        {
            console.error(err);
        }
    },

    getNickname : async function(username)
    {
        try
        {
            let res = await this.findOne({"username": username});
            if(res !== null) return res.nickname;
            else return '';
        }
        catch(err)
        {
            console.log(err);
        }
    },

    getUserID : async function(username)
    {
        try
        {
            let res = await this.find({"username": username});
            if(res.length === 1) return res[0]._id;
            else return 0;
        }
        catch(err)
        {
            console.log(err);
        }
    },
};

module.exports = global.db.model('user', userSchema); // first parameter는 schema name. schema name의 복수형을 collection name으로 사용한다.
