/* eslint space-before-function-paren: 0 */

var weixin = require('./weixin');
var user = require('./user');

function f1(models, wx, uploader) {
  return function (oauthUser) {
    if (oauthUser) {
      return Promise.resolve(oauthUser);
    }
    return Promise.all([
      weixin.find(models, wx),
      user.find(models, wx, uploader)
    ]).then(function (values) {
      var weixin = values[0];
      var user = values[1];

      // Use the results
      return models.OAuthUser.create({
        user: user.id,
        type: 'weixin',
        openid: weixin.openid
      }).then(function (oauthUser1) {
        oauthUser1.weixin = weixin;
        oauthUser1.user = user;
        return oauthUser1;
      });
    });
  };
}
module.exports = function (models, uploader, wx, cb) {
  var options = {
    openid: wx.openid
  };

  models.OAuthUser.findOne(options)
    .populate('user').then(f1(models, wx, uploader)).then(function (oauthUser) {
      cb(oauthUser);
    })
    .fail(require('./onError'));
};
