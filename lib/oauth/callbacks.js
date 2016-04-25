/* eslint no-inline-comments: 0 */

var bind = require('./bind');
var path = require('path');

module.exports = {
  onOAuthSuccess: function f1(models, uploader) {
    return function onOAuthSuccess(req, res, wx) {
      console.log('inside onOAuthSuccess');
      console.log(req, res, wx);
      bind(models, uploader, wx, function onBind(error, weixin) {
        if (error) {
          return new Error('failed to bind');
        }
        req.session.weixin = weixin;
        var user = weixin.user;
        req.session.customer = user;
        req.session.save(function save(error) {
          if (error) {
            console.error('inside error set session');
            return res.errorize(error, weixin);
          }
          if (req.session.refer) {
            // res.redirect(req.session.refer);
            res.render(path.resolve(__dirname, 'views/oauth'), {
              url: req.session.refer
            });
          }
        });
      });
    };
  },
  onOAuthAccess: function f2() {
    return function onOAuthAccess(
      // req, res
    ) {
      // should not use res.send to send any message
      console.log('onOAuthSuccess');
    };
  }
};
