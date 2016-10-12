module.exports = {
  create: function (weixin, wx) {
    return weixin.create(wx);
  },
  findOne: function (weixin, option) {
    return weixin.findOne(option);
  },
  makeSure: function (models, wx) {
    var self = this;
    return function (found) {
      if (found) {
        return Promise.resolve(found);
      }
      return self.create(models.Weixin, wx);
    };
  },
  find: function (models, wx) {
    var self = this;
    return this.findOne(models.Weixin, {
      openid: wx.openid
    }).then(self.makeSure(models, wx));
  }
};
