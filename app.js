var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/js-sha512/src'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret: '@#$%^&*($)',
  resave: false,
  saveUninitialized: true
}));

global.dev = true;
let port = dev ? 10500 : 80;
app.listen(port, function() {
        console.log('Connected at ' + port.toString());
});


var uri = 'mongodb://localhost:27017/KALIV';
global.db = mongoose.createConnection(uri)
db.Promise = global.Promise;


var router = require('./router/router');
app.use('/', router);
