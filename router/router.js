var express = require('express');

var redirector = require('./redirect');
var signup = require('./signup');
var signin = require('./signin');

var router = express.Router();

// redirector는 rendering, 그 외에는 control
router.route('/').get(redirector.getIndex);
router.route('/index').get(redirector.getIndex);
router.route('/signin').get(redirector.getSignIn);
router.route('/signup').get(redirector.getSignUp);
router.route('/logout').get(signin.getLogout);
router.route('/devchat').get(redirector.getDevChat);

router.route('/signup/req').post(signup.postSignUp);
router.route('/signup/check/:username/:email').get(signup.getCheckOverlap);
router.route('/signup/verify/:token').get(signup.getVerify);

router.route('/signin/auth').post(signin.postSignIn);
router.route('/signin/fail').get(redirector.getSignInFail);

module.exports = router;
