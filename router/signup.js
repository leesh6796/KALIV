var nodemailer = require('nodemailer');
var smtpPool=require('nodemailer-smtp-pool');
var sha512 = require('js-sha512').sha512;

var User = require('./model').user;

module.exports = {
	postSignUp : async function(req, res)
	{
		let username = req.body.username;
		let email = req.body.email;
		let password = req.body.password;
		let token = sha512(username);

		var user = new User();
		user.username = username;
		user.email = email;
		user.password = password;
		user.verifyToken = token;

		await user.save((err) => {
			if(err)
			{
				console.log(err);
				res.json({result:-1});
				return;
			}

			res.json({result:0});
		});

		var smtpTransport = nodemailer.createTransport(smtpPool({
		    service:'Gmail',
		    host:'localhost',
		    port:'465',
		    tls:{
		        rejectUnauthorize:false
		    },

		    //이메일 전송을 위해 필요한 인증정보

		    //gmail 계정과 암호 
		    auth:{
		        user:'kaliv.kaist',
		        pass:'qlalfqjsgh97'
		    },
		    /*maxConnections:5,
		    maxMessages:10*/
		}) );

		let url = dev ? "http://localhost:10500/signup/verify/" + token : "";
		var mailOptions = {
		    from: 'KALIV <kaliv.kaist@gmail.com>',
		    to: email,
		    subject: 'KALIV Sign Up Verification',
		    html: '<h3>Please Visit</h3><br /><a href=\'' + url + '\'>' + url + '</a>'
		};

		smtpTransport.sendMail(mailOptions, function(error, response){

		    if (error){
		        console.log(error);
		    } else {
		        console.log("Message sent : " + response.message);
		    }
		    smtpTransport.close();
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

	getVerify : async function(req, res)
	{
		try
		{
			let token = req.params.token.toString();
			let user = await User.findOne({verifyToken: token});
			await user.verify();

			res.send("KAIST Verification Complete");
		}
		catch(err)
		{
			res.send("Verification Failure");
		}
	},
};