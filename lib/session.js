var _ = require('lodash');
var session = require('node-weixin-session');

var stock = {
  oauth: {
    state: 'STATE',
    scope: 0,
    host: null,
    redirect: null
  },
  app: {
    id: null,
    secret: null,
    token: null
  },
  merchant: null,
  certificate: null,
  urls: {
    auth: {
      ack: null
    },
    oauth: {
      access: null,
      success: null,
      redirect: null
    },
    jssdk: {
      config: null
    },
    pay: {
      callback: null,
      redirect: null
    }
  }
};

var sessionConf = {
  default: _.clone(stock)
};

function getSessionConf(req, key, next) {
  if (!req || !req.session) {
    return next(null);
  }
  var id = req.session.id;
  if (!id) {
    return next(null);
  }
  if (req.session[id] && req.session[id][key]) {
    return next(req.session[id][key]);
  }
  return next(sessionConf.default[key]);
}

function setSessionConf(req, key, value, next) {
  if (!req || !req.session) {
    console.error('No Session Found on setting conf!');
    return next();
  }
  var id = req.session.id;
  if (!req.session[id]) {
    req.session[id] = {};
  }
  req.session[id][key] = value;
  next();
}

session.registerSet(setSessionConf);
session.registerGet(getSessionConf);

module.exports = session;
