/* eslint space-before-function-paren: 0 */

var weixin = require('./weixin');
var user = require('./user');

// function findUser(wx, models, uploader) {
//   return models.User.findOne({
//     username: wx.openid
//   }).populate('extra').then(function(data) {
//     if (data === undefined) {
//       return models.User
//         .create({
//           username: wx.openid,
//           password: new Date().getTime()
//         }).then(function(created) {
//           var userExtra = {
//             user: created.id,
//             nickname: wx.nickname
//           };
//           return new Promise(function(resolve, reject) {
//             service.saveUrl(models, wx.headimgurl, uploader, function(error, logo) {
//               if (error) {
//                 return reject(logo);
//               }
//               resolve(logo);
//             });
//           }).then(function(logo) {
//             return models.UserExtra.create(userExtra).then(function(extra) {
//               extra.logo = logo.id;
//               created.extra = extra;
//               return new Promise(function(resolve, reject) {
//                 created.save(function(error) {
//                   if (error) {
//                     return reject(error);
//                   }
//                   return resolve(created);
//                 });
//               });
//             });
//           });
//         });
//     }
//     return Promise.resolve(data);
//   });
// }

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
