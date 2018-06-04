module.exports = {
    getIndex : function(req, res)
    {
    	if(req.session.signin)
        	res.render('index.html',
                {
                    title : 'KALIV main page',
                    username: req.session.username,
                    userID: req.session.userID,
                });
        else
        	res.redirect('/signin');
    },
    getSignIn : function(req, res)
    {
    	if(req.session.signin)
    		res.redirect('/');
    	else
    		res.render('signin.html',
                {
                    title : 'KALIV Login',
                    signInFail: false
                });
    },
    getSignInFail : function(req, res)
    {
    	if(req.session.signin)
    		res.redirect('/');
    	else
    		res.render('signin.html',
                {
                    title : 'KALIV Login',
                    signInFail: true
                });
    },
    getSignUp : (req, res) =>
    {
    	if(req.session.signin)
    		res.redirect('/');
    	else
    		res.render('signup.html', {title : 'KALIV Sign Up'});
    },
    getDevChat : function(req, res)
    {
    	if(req.session.signin)
        	res.render('devchat.html',
                {
                    username: req.session.username,
                    roomID: req.params.roomID,
                });
        else
        	res.redirect('/signin');
    },
    getChat : function(req, res)
    {
    	if(req.session.signin)
        	res.render('chat.html',
                {
                    title: 'KALIV chat',
                    username: req.session.username,
                    roomID: req.params.roomID,
                });
        else
        	res.redirect('/signin');
    },
    getCalendar : function(req, res)
    {
    	if(req.session.signin)
        	res.render('calendar.html',
                {
                    username: req.session.username,
                });
        else
        	res.redirect('/signin');
    },
    getDev : function(req, res)
    {
        if(req.session.signin)
            res.render('dev.html',
                {
                    username: req.session.username,
                });
        else
            res.redirect('/signin');
    }
};