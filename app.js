var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var socket = require('./router/socket');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/js-sha512/src'));
app.use('/js', express.static(__dirname + '/node_modules/socket.io-client/dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret: '@#$%^&*($)',
  resave: false,
  saveUninitialized: true
}));

global.dev = true;
let port = dev ? 10500 : 80;
var server = app.listen(port, function() {
        console.log('Connected at ' + port.toString());
});

global.io = socket(server); // socket.io 객체를 생성해 global에 저장해둔다.


var uri = 'mongodb://localhost:27017/KALIV';
global.db = mongoose.createConnection(uri)
db.Promise = global.Promise; // mongoose에서 promise를 사용하기 위해 global promise를 mongoose promise에 저장해둔다.


var router = require('./router/router');
app.use('/', router);
