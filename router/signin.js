var User = require('./model').user;

module.exports = {
	postSignIn : async function(req, res)
	{
		let username = req.body.username;
		let password = req.body.password;

		result = await User.signIn(username, password);
		if(result)
		{
			req.session.signin = true;
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