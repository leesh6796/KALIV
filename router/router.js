var express = require('express');

var redirector = require('./redirect');
var signup = require('./signup');
var signin = require('./signin');
var chat = require('./chat');
var dev = require('./dev');

var router = express.Router();

// redirector는 rendering, 그 외에는 control
router.route('/').get(redirector.getIndex);
router.route('/index').get(redirector.getIndex);
router.route('/main').get(redirector.getIndex);
router.route('/signin').get(redirector.getSignIn);
router.route('/signup').get(redirector.getSignUp);
router.route('/logout').get(signin.getLogout);
router.route('/devchat/:roomID').get(redirector.getDevChat);
//router.route('/chat').get(redirector.getChat);
router.route('/calendar').get(redirector.getCalendar);
router.route('/dev').get(redirector.getDev);

router.route('/signup/req').post(signup.postSignUp);
router.route('/signup/check/:username/:email').get(signup.getCheckOverlap_Email);
router.route('/signup/check/:nickname').get(signup.getCheckOverlap_Nickname);
router.route('/signup/verify/:token').get(signup.getVerify);

router.route('/signin/auth').post(signin.postSignIn);
router.route('/signin/fail').get(redirector.getSignInFail);

router.route('/chat/enter').post(chat.enterRoom);
router.route('/chat/:roomID').get(redirector.getChat)
router.route('/chat/get/enter/roomlist').get(chat.getEnterRoomList);
router.route('/chat/get/my/username').get(chat.getUsername);
router.route('/chat/get/my/nickname').get(chat.getNickname);

router.route('/dev/process').post(dev.commandProcess);

module.exports = router;
