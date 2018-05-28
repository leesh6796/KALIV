var express = require('express');

var redirector = require('./redirect');
var signup = require('./signup');

var router = express.Router();

router.route('/').get(redirector.getIndex);
router.route('/signin').get(redirector.getSignIn);
router.route('/signup').get(redirector.getSignUp);

router.route('/signup/req').post(signup.postSignUp);
router.route('/signup/check/:username/:email').get(signup.getCheckOverlap);

module.exports = router;
