/* eslint space-before-function-paren: 0 */

var assert = require('assert');
module.exports = {
  admin: function admin() {
    return 0;
  },
  grocery: function grocery(req) {
    assert(req.session);
    assert(req.session.merchant);
    assert(req.session.merchant.id);
    return req.session.merchant.id;
  }
};
