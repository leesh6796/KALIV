var express = require('express');
var redirector = require('./redirect');

var router = express.Router();

router.route('/').get(redirector.getIndex);
router.route('/signin').get(redirector.getSignIn);
router.route('/signup').get(redirector.getSignUp);

module.exports = router;
