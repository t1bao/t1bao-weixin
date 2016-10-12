'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var sessions = require('../lib/session').get();

var shared = require('./shared');
var common = require('errorable-common');

// the errorable library
var errorable = require('errorable');

// Get the generator
var Generator = errorable.Generator;

// Generate the errors
var errors = new Generator(common, 'zh-CN').errors;
shared.errors = errors;

var http = express();
http.use(bodyParser.urlencoded({
  extended: false
}));
http.use(bodyParser.json());
http.use(bodyParser.raw({
  type: 'text/xml'
}));
http.use(cookieParser());
http.use(function (req, res, next) {
  // The errorable middleware for express
  var errorableExpress = require('errorable-express');
  var callback = errorableExpress(errors);
  callback(req, res, next);
});
http.set('trust proxy', 1);
// trust first proxy
http.use(session({
  secret: 'mysecret',
  cookie: {
    maxAge: 60000
  },
  resave: true,
  saveUninitialized: true
}));
// register the template engine
http.set('view engine', 'ejs');

http.all('/merchant/login', function (req, res) {
  req.session.grocery = {
    id: 1
  };
  res.end();
});

http.all('/session/set', function (req, res) {
  sessions.set(req, 'openid', shared.weixin, function () {
    res.end();
  });
});

module.exports = http;
