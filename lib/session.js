var assert = require('assert');
var session = require('node-weixin-session');

module.exports = {
  get: function () {
    session.registerSet(this._setSession);
    session.registerGet(this._getSession);
    return session;
  },
  _getSession: function (req, key, next) {
    assert(req && req.session && req.session.id);
    assert(key !== null);
    var id = req.session.id;
    if (req.session[id] && req.session[id][key]) {
      return next(req.session[id][key]);
    }
    return next(null);
  },
  _setSession: function (req, key, value, next) {
    assert(req && req.session && req.session.id);
    assert(key !== null);
    var id = req.session.id;
    if (!req.session[id]) {
      req.session[id] = {};
    }
    req.session[id][key] = value;
    next();
  }
};
