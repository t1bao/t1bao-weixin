/* eslint camelcase: 0 */

var service = require('image-model-storage');

module.exports = {
  onSaveAvatar: function (resolve, reject) {
    return function (error, logo) {
      if (error) {
        return reject(logo);
      }
      resolve(logo);
    };
  },
  saveAvatar: function (models, wx, uploader) {
    var self = this;
    return new Promise(function (resolve, reject) {
      service.saveUrl(models, wx.headimgurl, uploader, self.onSaveAvatar(resolve, reject));
    });
  },
  _onSaveWithExtra: function (resolve, reject, user) {
    return function (error) {
      if (error) {
        return reject(error);
      }
      return resolve(user);
    };
  },
  _saveWithExtra: function (created, logo) {
    var self = this;
    return function (extra) {
      extra.logo = logo.id;
      created.extra = extra;
      return new Promise(function (resolve, reject) {
        created.save(self._onSaveWithExtra(resolve, reject, created));
      });
    };
  },
  createExtra: function (config) {
    var models = config.models;
    var user = config.user;
    var userExtra = config.userExtra;
    var self = this;
    return function (logo) {
      return models.UserExtra.create(userExtra).then(self._saveWithExtra(user, logo));
    };
  },
  saveExtra: function (models, wx, uploader) {
    var self = this;
    return function (user) {
      var userExtra = {
        user: user.id,
        nickname: wx.nickname
      };
      return self.saveAvatar(models, wx, uploader).then(
        self.createExtra({
          models: models,
          user: user,
          userExtra: userExtra
        })
      );
    };
  },
  create: function (models, wx, uploader) {
    return models.User
      .create({
        username: wx.openid,
        password: new Date().getTime(),
        register_ip: wx.ip
      }).then(this.saveExtra(models, wx, uploader));
  },
  find: function (models, wx, uploader) {
    return models.User.findOne({
      username: wx.openid
    }).populate('extra').then(this.makeSure(models, wx, uploader));
  },
  makeSure: function (models, wx, uploader) {
    var self = this;
    return function (user) {
      if (user === undefined) {
        return self.create(models, wx, uploader);
      }
      return Promise.resolve(user);
    };
  }
};
