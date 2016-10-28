/* eslint camelcase: 0 */

var callbacks = {
  _onOrderUpdated: function (res, resolve, reject) {
    return function (error) {
      if (error === res.errors.Success) {
        resolve(true);
      } else {
        reject(error);
      }
    };
  },
  _orderUpdate: function (orderMethods, res) {
    var self = this;
    return function (order) {
      if (!order) {
        throw new Error('order not found');
      }
      return new Promise(function (resolve, reject) {
        orderMethods.userUpdate(order.id, order.user.id, 'PAID', self._onOrderUpdated(res, resolve, reject));
      }).then(function () {
        return new Promise(function (resolve, reject) {
          orderMethods.update(order.id, order.store.id, 'PAID', self._onOrderUpdated(res, resolve, reject));
        });
      });
    };
  },
  _onFail: function (cb) {
    return function (error) {
      console.error(error);
      cb();
    };
  },
  _onGetStoreWeixin: function (data, next) {
    return function (store) {
      if (store) {
        data.body = '[' + store.name + ']订单支付';
        if (store.weixin && !store.weixin.enable) {
          data.sub_mch_id = store.weixin.merchantId;
        }
      }
      next(false, data);
    };
  },
  _getStoreWeixin: function (models, id, cb) {
    models.Store.findOne({
      id: String(id)
    }).populate('weixin').then(function (store) {
      cb(store);
    }).fail(callbacks._onFail(cb));
  },
  /**
   * order creation process wil be called when an order creation request is sent
   * @returns {Function}
   */
  onCreate: function (models) {
    return function (req, res, next) {
      var ip = req.headers['x-forwarded-for'] ||
        (req.connection ? req.connection.remoteAddress : null) || req.ip;
      ip = ip.split(',')[0];

      var info = req.session._weixinPay;
      var order = req.session._order;
      req.params = {
        url: info.urls.pay.callback
      };
      var data = {};
      data.openid = info.openid.openid;
      data.spbill_create_ip = ip;
      data.notify_url = info.urls.pay.callback;
      data.body = '田一块订单支付';
      // data.out_trade_no = '' + new Date().getTime();
      data.out_trade_no = String(order.no);
      // data.total_fee = (parseFloat(order.summary) * 100 + parseFloat(order.delivery_fee) * 100).toFixed(0);
      // 将所有的支付价格转化成单一的price值
      data.total_fee = parseInt(order.price * 100, 10);
      data.trade_type = info.type;

      // mostly useless
      // data.sub_mch_id = 'xxx'
      // data.device_info = 'xxx'
      // data.attach = 'xxx'
      // data.time_start = new Date().getTime();
      // data.time_expire = 'xxx'
      // data.goods_tag = 'xxx'
      // data.product_id = 'xxx'
      // data.attach = 'xxx'
      callbacks._getStoreWeixin(models, order.store.id, callbacks._onGetStoreWeixin(data, next));
    };
  },
  _orderFind: function (models, data) {
    return function (wo) {
      if (!wo) {
        throw new Error('weixin order creation failed');
      }
      return models.Order.findOne({
        no: data.out_trade_no
      }).populate('store').populate('user');
    };
  },
  _onError: function (error) {
    console.error(error);
    console.error(error.stack);
  },
  /**
   * Order process status callback
   *
   * @param appConfig
   * @returns {Function}
   */
  onNotify: function (models, orderMethods) {
    var self = this;
    return function () {
      var data = arguments[1];
      var res = arguments[2];
      var next = arguments[3];

      models.WeixinOrder
        .create({
          no: data.out_trade_no,
          value: data,
          createdTime: new Date()
        })
        .then(self._orderFind(models, data))
        .then(self._orderUpdate(orderMethods, res))
        .then(function () {
          if (next) {
            next();
          }
        }).catch(self._onError);
    };
  }
};

module.exports = callbacks;

