/* eslint space-before-function-paren: 0 */

// var Promise = require('bluebird');


function createUser() {

}

function findWeixin(wx, models) {
  return models.Weixin.findOne({
    openid: wx.openid
  }).then(function(data) {
    if (data === undefined) {
      return models.Weixin.create(wx).then(function(created) {
        return created;
      });
    }
    return Promise.resolve(data);
  });
}

function findUser(wx, models, uploader) {
  return models.User.findOne({
    username: wx.openid
  }).populate('extra').then(function(data) {
    if (data === undefined) {
      return models.User
        .create({
          username: wx.openid,
          password: '123456'
        }).then(function(created) {
          var userExtra = {
            user: created.id,
            nickname: wx.nickname
          };
          return new Promise(function(resolve, reject) {
            models.ImageService.saveUrl(wx.headimgurl, uploader, function(error, logo) {
              if (error.code) {
                return reject(error);
              }
              resolve(logo);
            });
          }).then(function(logo) {
            return models.UserExtra.create(userExtra).then(function(extra) {
              extra.logo = logo.id;
              created.extra = extra;
              return new Promise(function(resolve, reject) {
                created.save(function(error) {
                  if (error) {
                    return reject(error);
                  }
                  return resolve(created);
                });
              });
            });
          });
        });
    }
    return Promise.resolve(data);
  });
}

module.exports = function(models, uploader, wx, cb) {
  var options = {
    openid: wx.openid
  };

  function f1(oauthUser) {
    if (oauthUser) {
      return Promise.resolve(oauthUser);
    }
    return Promise.all([
      findWeixin(wx, models),
      findUser(wx, models, uploader)
    ]).then(function(values) {
      var weixin  = values[0];
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
      cb(false, oauthUser);
    })
    .fail(function(e) {
      console.error(e.stack);
      throw e;
    });
};
