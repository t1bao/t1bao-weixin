'use strict';

/* eslint space-before-function-paren: 0 */
/* eslint-env es6 */

var weixinRouter = require('node-weixin-router');

var order = require('./order/callbacks');
var oauth = require('./oauth/callbacks');
var settingsFunc = require('./settings');
var session = require('./session').get();

var setConfig = require('./config/');
var pay = require('./pay');
var urls = require('./config/urls');
var getId = require('./getId');
module.exports = {
  urls: urls,
  settings: {
    service: require('./settings/service')
  },
  getSettings: settingsFunc.get,
  init: function(config) {
    var settings = config.settings;
    var app = config.app;
    var models = config.models;
    var uploader = config.uploader;
    var orderMethods = config.callbacks;
    weixinRouter.express(settings, session, app, urls.prefix);
    weixinRouter.onOrderCreate(order.onCreate(models, orderMethods, settings, true));
    weixinRouter.onOrderNotify(order.onNotify(models, orderMethods));
    weixinRouter.onOauthAccess(oauth.onOAuthAccess(models, uploader));
    weixinRouter.onOauthSuccess(oauth.onOAuthSuccess(models, uploader));
    weixinRouter.getId = getId.init(config);
    setConfig(settings, app);
    pay.init(config, session, weixinRouter);
  }
};
