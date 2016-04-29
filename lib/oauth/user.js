/* eslint space-before-function-paren: 0 */
var service = require('image-model-storage');
module.exports = {
  onSaveAvatar: function __onSaveAvatar(resolve, reject) {
    return function cb(error, logo) {
      if (error) {
        return reject(logo);
      }
      resolve(logo);
    };
  },
  saveAvatar: function __saveAvatar(models, wx, uploader) {
    var self = this;
    return new Promise(function(resolve, reject) {
      service.saveUrl(models, wx.headimgurl, uploader, self.onSaveAvatar(resolve, reject));
    });
  },
  _onSaveWithExtra: function(resolve, reject, user) {
    return function(error) {
      if (error) {
        return reject(error);
      }
      return resolve(user);
    };
  },
  _saveWithExtra: function __saveWithExtra(created, logo) {
    var self = this;
    return function(extra) {
      extra.logo = logo.id;
      created.extra = extra;
      return new Promise(function(resolve, reject) {
        created.save(self._onSaveWithExtra(resolve, reject, created));
      });
    };
  },
  createExtra: function __createExtra(models, wx, uploader, user, userExtra) {
    var self = this;
    return function createExtra(logo) {
      return models.UserExtra.create(userExtra).then(self._saveWithExtra(user, logo));
    };
  },
  saveExtra: function __saveExtra(models, wx, uploader) {
    var self = this;
    return function saveExtra(user) {
      var userExtra = {
        user: user.id,
        nickname: wx.nickname
      };
      return self.saveAvatar(models, wx, uploader).then(
        self.createExtra(models, wx, uploader, user, userExtra)
      );
    };
  },
  create: function __create(models, wx, uploader) {
    return models.User
      .create({
        username: wx.openid,
        password: new Date().getTime()
      }).then(this.saveExtra(models, wx, uploader));
  },
  find: function __find(models, wx, uploader) {
    return models.User.findOne({
      username: wx.openid
    }).populate('extra').then(this.makeSure(models, wx, uploader));
  },
  makeSure: function __makeSure(models, wx, uploader) {
    var self = this;
    return function(user) {
      if (user === undefined) {
        return self.create(models, wx, uploader);
      }
      return Promise.resolve(user);
    };
  }
};
