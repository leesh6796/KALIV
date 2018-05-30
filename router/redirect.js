module.exports = {
    getIndex : function(req, res)
    {
    	if(req.session.signin)
        	res.render('index.html', {title : 'KALIV main page'});
        else
        	res.redirect('/signin');
    },
    getSignIn : function(req, res)
    {
    	if(req.session.signin)
    		res.redirect('/');
    	else
    		res.render('signin.html', {title : 'KALIV Login', signInFail: false});
    },
    getSignInFail : function(req, res)
    {
    	if(req.session.signin)
    		res.redirect('/');
    	else
    		res.render('signin.html', {title : 'KALIV Login', signInFail: true});
    },
    getSignUp : (req, res) =>
    {
    	if(req.session.signin)
    		res.redirect('/');
    	else
    		res.render('signup.html', {title : 'KALIV Sign Up'});
    },
};