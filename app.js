var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var mongoose = require('mongoose');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret: '@#$%^&*($)',
  resave: false,
  saveUninitialized: true
}));

let dev = true;
let port = dev ? 10500 : 80;
app.listen(port, function() {
        console.log('Connected at ' + port.toString());
});

var router = require('./router/router');
app.use('/', router);
