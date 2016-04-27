'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var request = require('supertest');

var http = express();
http.use(bodyParser.urlencoded({
  extended: false
}));
http.use(bodyParser.json());
http.use(bodyParser.raw({
  type: 'text/xml'
}));
http.use(cookieParser());
http.use(function(req, res, next) {
  var common = require('errorable-common'); //the errorable middleware for express
  var errorable = require('errorable'); //the errorable library
  var Generator = errorable.Generator; //Get the generator
  var errors = new Generator(common, 'zh-CN').errors; //Generate the errors
  var errorableExpress = require('errorable-express'); //the errorable middleware for express
  var callback = errorableExpress(errors);
  callback(req, res, next);
});
http.set('trust proxy', 1); // trust first proxy
http.use(session({
  secret: 'mysecret',
  cookie: {
    maxAge: 60000
  },
  resave: true,
  saveUninitialized: true
}));
http.set('view engine', 'ejs'); // register the template engine


module.exports = http;
