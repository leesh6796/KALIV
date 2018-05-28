module.exports = {
    getIndex : function(req, res)
    {
        res.render('index.html', {title : 'KALIV main page'});
    },
    getSignIn : function(req, res)
    {
    	res.render('signin.html', {title : 'KALIV Login'});
    },
    getSignUp : (req, res) =>
    {
    	res.render('signup.html', {title : 'KALIV Sign Up'});
    },
};