'use strict';
/* eslint space-before-function-paren: 0 */

var http = require('./app');
var Models = require('./models');
var request = require('supertest');
var uploader = require('./config/uploader');

var assert = require('assert');
var serverWeixin = require('../lib');
var orderMethods = {};

var service = require('./SettingsService');

var wx = {
  openid: 'sdfsfdf',
  nickname: 'dsfsdf',
  unionid: 'dsfsf',
  sex: 1,
  province: 'sdfsf',
  city: 'sdfsf',
  country: 'sdfs',
  headimgurl: 'http://wx.qlogo.cn/mmopen/Sjp7oYYCibI4LadRszpJvlLUlC1nhdoMGKMiacjn7vcTThnW4Y35jfMth66nStXATia40uB2Y2Ticdn92V2FtUgLtQ/0'
};

var conf = require('./conf');

var gModels = null;

describe('server-weixin', function() {
  it('should init weixin', function() {
    assert(true);
  });
  it('should init models and settings', function(done) {
    // var oauth = require('../lib/oauth/callbacks');

    function main(models) {
      gModels = models;
      var storage = service(models);
      var settings = serverWeixin.getSettings(storage);
      conf(settings, 0, function(error) {
        assert(!error);
        serverWeixin.init(settings, http, models, uploader, orderMethods);
        done();
      });
    }
    Models.init(main);
  });
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
    var cb = oauth.onOAuthSuccess(gModels, uploader);
    cb({
      session: {
        save: function(next) {
          next(false);
        },
        refer: 'sfdsdf'
      }
    }, {
      render: function(file, options) {
        console.log(file, options);
        done();
      }
    }, wx);
  });

  it('should be successful', function(done) {
    var oauth = require('../lib/oauth/callbacks');
    var cb = oauth.onOAuthSuccess(gModels, uploader);
    cb({
      session: {
        save: function(next) {
          next(false);
        }
      }
    }, {
      end: function() {
        done();
      }
    }, wx);
  });

  it('should be successful', function(done) {
    var oauth = require('../lib/oauth/callbacks');
    var cb = oauth.onOAuthSuccess(gModels, uploader);
    cb({
      session: {
        save: function(next) {
          next(true);
        }
      }
    }, {
      errorize: function() {
        done();
      }
    }, wx);
  });

  it('should test oauth error', function() {
    var onError = require('../lib/oauth/onError');
    var catched = false;
    try {
      onError(new Error());
    } catch (e) {
      catched = true;
    }
    assert(catched);
  });

  it('should test oauth weixin', function() {
    var weixin = require('../lib/oauth/weixin').makeSure(gModels, wx);
    var obj = weixin({openid: 'sdfosodf'});

    assert(obj.then instanceof Function);
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
