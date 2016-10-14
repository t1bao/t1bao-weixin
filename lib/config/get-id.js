
var assert = require('assert');
module.exports = {
  admin: function (req) {
    var id = 0;
    console.log(req.query);
    if (req.query && req.query.grocery) {
      id = parseInt(req.query.grocery, 10);
      if (isNaN(id)) {
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
