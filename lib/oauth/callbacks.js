
var bind = require('./bind');
var path = require('path');

module.exports = {
  onOAuthSuccess: function f1(models, uploader) {
    return function onOAuthSuccess(req, res, wx) {
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
      wx.ip = ip;
      bind(models, uploader, wx, function onBind(weixin) {
        req.session.weixin = weixin;
        var user = weixin.user;
        req.session.customer = user;
        req.session.save(function save(error) {
          if (error) {
            console.error('inside error set session');
            return res.errorize(error, weixin);
          }
          if (req.session.refer) {
            res.render(path.resolve(__dirname, '../views/oauth'), {
              url: req.session.refer
            });
          } else {
            res.end();
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
    };
  }
};
