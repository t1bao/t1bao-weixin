var validator = require('node-form-validator');
var confs = require('./validations/pay');
var path = require('path');
var urls = require('./config/urls');

module.exports = {
  _getOpenId: function (session, req) {
    return new Promise(function (resolve) {
      session.get(req, 'openid', function (openid) {
        resolve(openid);
      });
    });
  },
  _getRouterId: function (router, req) {
    return new Promise(function (resolve) {
      router.getId(req, function (id) {
        resolve(id);
      });
    });
  },
  _getSetting: function (settings, id, openid) {
    return new Promise(function (resolve) {
      settings.get(id, 'urls', function (urls) {
        resolve({
          id: id,
          openid: openid,
          urls: urls
        });
      });
    });
  },

  _onFailed: function (error) {
    console.error('Initialization failed');
    console.error(error);
  },
  init: function (config, session, router) {
    var settings = config.settings;
    var app = config.app;
    var models = config.models;

    var self = this;
    app.all(urls.pay.init, function (req, res) {
      var error = validator.validate(req.query, confs.weixin.init);
      if (!error || error.code) {
        console.error(error);
        return res.errorize(res.errors.InputInvalid, error);
      }
      var data = error.data;
      Promise.all([
        self._getRouterId(router, req),
        self._getOpenId(session, req)
      ]).then(function (values) {
        return self._getSetting(settings, values[0], values[1]);
      }).then(function (value) {
        if (!value || !value.openid || !value.openid.openid) {
          res.redirect(value.urls.oauth.access);
          return;
        }
        var info = {
          no: data.no,
          type: data.type,
          urls: value.urls,
          openid: value.openid
        };
        models.Order.findOne({
          no: data.no
        }).populate('store').populate('user').then(function (order) {
          req.session._weixinPay = info;
          var params = {
            url: data.url,
            info: info,
            order: {
              id: order.id,
              price: (parseFloat(order.summary) + parseFloat(order.delivery_fee)).toFixed(2),
              store: {
                id: order.store.id,
                name: order.store.name
              },
              no: order.no,
              time: new Date(order.createdAt).getTime()
            }
          };
          req.session._order = params.order;
          res.render(path.resolve(__dirname, 'views/pay'), params);
        }).fail(self._onFailed);
      });
    });
  }
};
