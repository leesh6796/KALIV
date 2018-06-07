var User = require('./model').user;
var Chat = require('./chat');

module.exports = {
	postSignIn : async function(req, res)
	{
		let username = req.body.username;
		let password = req.body.password;

		result = await User.signIn(username, password);
		if(result)
		{
			let me = await User.findOne({username: username});

			req.session.signin = true;
			req.session.username = username;
			req.session.nickname = me.nickname;
			req.session.userID = me._id;
			
			res.redirect('/');
		}
		else
		{
			res.redirect('/signin/fail');
		}
	},
	getLogout : function(req, res)
	{
		if(req.session.signin)
		{
			req.session.signin = false;
			res.redirect('/signin');
		}
		else
		{
			res.redirect('/');
		}
	}
};