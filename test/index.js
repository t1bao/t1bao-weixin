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



var assert = require('assert');
var serverWeixin = require('../lib');
var models = {
  Weixin: {
    findOne: function(data) {
      console.log('weixin find one');
      return Promise.resolve(data)
    },
    create: function() {
      return Promise.resolve(data)
    }

  },
  User: {
    findOne: function(data) {
      console.log('weixin find one');
      return {
        populate: function() {
          return Promise.resolve();
        }
      }
    },
    create: function() {
      return Promise.resolve(data)
    }
  },
  OAuthUser:  {
    findOne: function(data) {
      console.log('weixin find one');
      return {
        populate: function() {
          return new Promise(function(resolve, reject) {
            resolve(okd);
          });
        }
      }
    },
    create: function() {
      return Promise.resolve(data)
    }
  },
};
var uploader = {};
var orderMethods = {};
var conf = {
  app: {
    id: '1'
  },
  urls: {
    oauth: {
      success: 'http://loclahost'
    }
  },
  oauth: {
    state: 'STATE',
    scope: 0
  }
};
var storage = {
  get: function(id, next) {
    next(false, {
      value: conf
    });
  },
  set: function() {},
  all: function(id, next) {
    console.log('inside all');
    next(false, {
      value: conf
    });
  }
};

var wx = {
  openid: 'sdfsfdf'
}

var settings = serverWeixin.getSettings(storage);

serverWeixin.init(settings, http, models, uploader, orderMethods);

describe('server-weixin', function() {
  it('should init weixin', function() {
    assert(true);
  });

  describe('Oauth', function() {
    it('should be accessed', function(done) {
      var url = '/weixin/api/oauth/access';
      request(http)
        .get(url)
        .expect(302)
        .end(done);
    });

    it('should be successful', function(done) {

      var oauth = require('../lib/oauth/callbacks');
      var cb = oauth.onOAuthSuccess(models, uploader);
      cb({}, {}, wx);
    });

    // it('should be successful', function(done) {
    //   var url = '/weixin/api/oauth/success?code=100';
    //   request(http)
    //     .get(url)
    //     .expect(200)
    //     .end(function(error, res) {
    //       console.log(error);
    //       // console.log(res);
    //       // console.log(res.text);
    //       done();
    //     });
    // });
  });

});
