/* eslint space-before-function-paren: 0 */
module.exports = {
  admin: function admin() {
    return 0;
  },
  grocery: function grocery(req) {
    if (req.session.merchant) {
      return req.session.merchant.id;
    }
    return undefined;
  }
};
