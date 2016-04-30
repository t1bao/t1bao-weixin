/* eslint space-before-function-paren: 0 */

var validator = require('node-form-validator');
var confs = require('./validations/pay');
var path = require('path');

module.exports = {
  init: function(settings, session, app, router, models) {
    app.all('/pay/weixin/init', function(req, res) {
      var no = req.params.no;
      var type = req.params.type;
      var url = req.params.url;
      var data = {};
      var error = {};
      if (!validator.v(req, confs, data, error)) {
        return res.errorize(res.errors.InputInvalid, error);
      }
      new Promise(function(resolve) {
        session.get(req, 'openid', function(openid) {
          resolve(openid);
        });
      }).then(function(openid) {
        return new Promise(function(resolve) {
          router.getId(req, function(id) {
            resolve(openid, id);
          });
        });
      }).then(function(openid, id) {
        return new Promise(function(resolve) {
          settings.get(id, 'urls', function(urls) {
            resolve(openid, urls);
          });
        });
      }).then(function(openid, urls) {
        if (!openid || !openid.openid) {
          res.redirect(urls.oauth.access);
          return;
        }
        var info = {
          no: no,
          type: type,
          urls: urls,
          openid: openid
        };
        models.Order.findOne({
          no: no
        }).populate('store').populate('user').then(function(order) {
          req.session._weixinPay = info;
          var params = {
            url: url,
            info: info,
            order: {
              id: order.id,
              price: (parseFloat(order.summary) + parseFloat(order.delivery_fee)).toFixed(2),
              store: {
                name: order.store.name
              },
              no: order.no,
              time: new Date(order.createdAt).getTime()
            }
          };
          req.session._order = params.order;
          res.render(path.resolve(__dirname, '/views/pay'), params);
        }).fail(function(error) {
          console.error(error);
        });
      });
    });
  }
};
