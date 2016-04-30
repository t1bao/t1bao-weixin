/* eslint space-before-function-paren: 0 */

var weixin = require('./weixin');
var user = require('./user');

module.exports = function(models, uploader, wx, cb) {
  var options = {
    openid: wx.openid
  };
  function f1(oauthUser) {
    if (oauthUser) {
      return Promise.resolve(oauthUser);
    }
    return Promise.all([
      // findWeixin(wx, models),
      weixin.find(models, wx),
      user.find(models, wx, uploader)
      // findUser(wx, models, uploader)
    ]).then(function(values) {
      var weixin = values[0];
      var user = values[1];

      // Use the results
      return models.OAuthUser.create({
        user: user.id,
        type: 'weixin',
        openid: weixin.openid
      }).then(function(oauthUser1) {
        oauthUser1.weixin = weixin;
        oauthUser1.user = user;
        return oauthUser1;
      });
    });
  }

  models.OAuthUser.findOne(options)
    .populate('user').then(f1).then(function(oauthUser) {
      cb(oauthUser);
    })
    .fail(require('./onError'));
};
