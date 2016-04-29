module.exports = {
  create: function create(weixin, wx) {
    return weixin.create(wx);
  },
  findOne: function findOne(weixin, option) {
    return weixin.findOne(option);
  },
  makeSure: function makeSure(models, wx) {
    var self = this;
    return function onMakeSure(found) {
      if (found) {
        return Promise.resolve(found);
      }
      return self.create(models.Weixin, wx);
    };
  },
  find: function find(models, wx) {
    var self = this;
    return this.findOne(models.Weixin, {
      openid: wx.openid
    }).then(self.makeSure(models, wx));
  }
};
