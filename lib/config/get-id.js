
var assert = require('assert');
module.exports = {
  admin: function (req) {
    var id = 0;
    if (req.query && req.query.grocery) {
      try {
        id = parseInt(req.query.grocery, 10);
      } catch (e) {
        id = 0;
      }
    }
    return id;
  },
  grocery: function (req) {
    assert(req.session);
    assert(req.session.grocery);
    assert(req.session.grocery.id);
    return req.session.grocery.id;
  }
};
