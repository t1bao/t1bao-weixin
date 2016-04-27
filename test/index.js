'use strict';

var http = require('./app');
var Models = require('./models');
var request = require('supertest');
var uploader = require('./config/uploader');


var assert = require('assert');
var serverWeixin = require('../lib');
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

Models.init(function(models) {
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

      it('should be successful', function(done) {
        var url = '/weixin/api/oauth/success?code=100';
        request(http)
          .get(url)
          .expect(200)
          .end(function(error, res) {
            console.log(error);
            // console.log(res);
            // console.log(res.text);
            done();
          });
      });
    });
  });
});
