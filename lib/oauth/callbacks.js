
var bind = require('./bind');
var path = require('path');

module.exports = {
  onOAuthSuccess: function (models, uploader) {
    return function (req, res, wx) {
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
      wx.ip = ip;
      bind(models, uploader, wx, function (weixin) {
        req.session.weixin = weixin;
        var user = weixin.user;
        req.session.customer = user;
        req.session.save(function (error) {
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
  onOAuthAccess: function () {
    return function (
      // req, res
    ) {
      // should not use res.send to send any message
    };
  }
};
