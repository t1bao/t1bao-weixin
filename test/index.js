'use strict';
/* eslint space-before-function-paren: 0 */

var http = require('./app');
// var request = require('supertest');
var assert = require('assert');

var Models = require('./models');
var uploader = require('./config/uploader');
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

function getModels() {
  return gModels;
}

var oauth = require('./oauth');
oauth(getModels, wx, uploader);
