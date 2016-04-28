'use strict';
/* eslint space-before-function-paren: 0 */

var http = require('./app')
var Models = require('./models');
var request = require('supertest');
var uploader = require('./config/uploader');

var assert = require('assert');
var serverWeixin = require('../lib');
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
var service = require('./SettingsService');

var wx = {
  openid: 'sdfsfdf'
};

describe('server-weixin', function() {
  it('should init weixin', function() {
    assert(true);
  });
});

describe('Oauth', function() {
  it('should be accessed', function(done) {
    var oauth = require('../lib/oauth/callbacks');
    done();
    function main(models) {
      done();
      var storage = service(models);
      var settings = serverWeixin.getSettings(storage);
      settings.set(0, conf);
      serverWeixin.init(settings, http, models, uploader, orderMethods);
      done();
      // var url = '/weixin/api/oauth/access';
      // request(http)
      //   .get(url)
      //   .expect(302)
      //   .end(done);
    }
    Models.init(main);
  });
  //
  // it('should be successful', function() {
  //   var oauth = require('../lib/oauth/callbacks');
  //   function main(models) {
  //     var storage = service(models);
  //     var settings = serverWeixin.getSettings(storage);
  //     serverWeixin.init(settings, http, models, uploader, orderMethods);
  //     console.log('inside 2');
  //     var cb = oauth.onOAuthSuccess(models, uploader);
  //     cb({}, {}, wx);
  //   }
  //   Models.init(main);
  // });
  //
  // it('should be successful', function(done) {
  //   var url = '/weixin/api/oauth/success?code=100';
  //   request(http)
  //     .get(url)
  //     .expect(200)
  //     .end(function(error, res) {
  //       console.log(error);
  //       console.log(res);
  //       // console.log(res.text);
  //       done();
  //     });
  // });
});
