var User = require('./model').user;

module.exports = {
	postSignUp : function(req, res)
	{
		let username = req.body.username;
		let email = req.body.email;
		let password = req.body.password;

		var user = new User();
		user.username = username;
		user.email = email;
		user.password = password;

		user.save((err) => {
			if(err)
			{
				console.log(err);
				res.json({result:-1});
				return;
			}

			res.json({result:0});
		});
	},

	getCheckOverlap : async function(req, res)
	{
		let username = req.params.username.toString();
		let email = req.params.email.toString();

		let isOverlapped = await User.checkOverlap(username, email);

		if(isOverlapped) // 중복이면
		{
			res.send({result:"overlap"});
		}
		else
		{
			res.send({result:"success"});
		}
	},
};