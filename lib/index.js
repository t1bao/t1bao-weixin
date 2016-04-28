'use strict';

/* eslint space-before-function-paren: 0 */
/* eslint-env es6 */

var weixinRouter = require('node-weixin-router');

var order = require('./order/callbacks');
var oauth = require('./oauth/callbacks');
var settingsFunc = require('./settings');
var session = require('./session');

var setConfig = require('./config/');
var pay = require('./pay');

module.exports = {
  getSettings: settingsFunc,
  init: function(settings, express, models, uploader, orderMethods) {
    console.log('inside');
    // weixinRouter.express(settings, session, express, '/weixin/api');
    // weixinRouter.onOrderCreate(order.onCreate(models, orderMethods));
    // weixinRouter.onOrderNotify(order.onNotify(models, orderMethods));
    // weixinRouter.onOauthAccess(oauth.onOAuthAccess(models, uploader));
    // weixinRouter.onOauthSuccess(oauth.onOAuthSuccess(models, uploader));
    // weixinRouter.getId = function(req, cb) {
    //   cb(0);
    // };
    // setConfig(settings, express);
    // console.log('inside 2');
    // pay.init(settings, session, express, weixinRouter, models);
  }
};
