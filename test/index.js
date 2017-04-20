'use strict';
/* eslint space-before-function-paren: 0 */

var http = require('./app');
// var request = require('supertest');
var assert = require('assert');

var Models = require('./models');
var uploader = require('./config/uploader');
var serverWeixin = require('../lib');
var orderMethods = {};

var wx = {
  openid: 'sdfsfdf',
  nickname: 'dsfsdf',
  unionid: 'dsfsf',
  sex: 1,
  province: 'sdfsf',
  city: 'sdfsf',
  country: 'sdfs',
  headimgurl: 'http://www.t1bao.com/images/logo.png'
};

var conf = require('./conf');

var gModels = null;
var storage = null;
var settings = null;
var gConfig = null;

process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID=1;
process.env.T1BAO_WEIXIN_PROVIDER_ID=0;


describe('server-weixin', function () {
  before(function (done) {
    // var oauth = require('../lib/oauth/callbacks');

    function main(models) {
      gModels = models;
      storage = serverWeixin.settings.service(models,
        process.env.T1BAO_WEIXIN_PROVIDER_ID,
        process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID);
      settings = serverWeixin.getSettings(storage);
      conf(settings, 0, function (error) {
        assert(!error);
        gConfig = {
          settings: settings,
          app: http,
          models: models,
          uploader: uploader,
          callbacks: orderMethods
        };
        serverWeixin.init(gConfig);
        done();
      });
    }
    Models.init(main);
  });
  var oauth = require('./oauth');
  oauth(getModels, wx, uploader);
  require('./settings')(getStorage, getConfig);
  require('./pay')(getModels);
  require('./order')(getModels, orderMethods);
});
function getConfig() {
  return gConfig;
}

function getModels() {
  return gModels;
}

function getStorage() {
  return storage;
}
