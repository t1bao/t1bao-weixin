
var assert = require('assert');
module.exports = {
  admin: function (req) {
    var id = (req.body && req.body.grocery) || 0;
    return id;
  },
  grocery: function (req) {
    assert(req.session);
    assert(req.session.grocery);
    assert(req.session.grocery.id);
    return req.session.grocery.id;
  }
};
