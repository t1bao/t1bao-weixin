/* eslint space-before-function-paren: 0 */
module.exports = {
  /**
   * order creation process wil be called when an order creation request is sent
   * @returns {Function}
   */
  onCreate: function create() {
    return function onCreate(req, res, next) {
      var ip = req.headers['x-forwarded-for'] ||
        (req.connection ? req.connection.remoteAddress : null) || req.ip;
      ip = ip.split(',')[0];

      var info = req.session._weixinPay;
      var order = req.session._order;
      req.params = {
        url: info.urls.pay.callback
      };
      // Order.findOne({
      //   no: info.no
      // }).exec(function(error, order) {
      //   if (error) {
      //     return cb(true);
      //   }
      var data = {};
      data.openid = info.openid.openid;
      /* eslint camelcase: 0 */
      data.spbill_create_ip = ip;
      data.notify_url = info.urls.pay.callback;
      data.body = '田一块订单支付';
      // data.out_trade_no = '' + new Date().getTime();
      data.out_trade_no = String(order.no);
      /* eslint camelcase: 0 */
      // data.total_fee = (parseFloat(order.summary) * 100 + parseFloat(order.delivery_fee) * 100).toFixed(0);
      data.total_fee = parseInt(order.price * 100, 10);
      /* eslint camelcase: 0 */
      data.trade_type = info.type;

      // mostly useless
      // data.sub_mch_id = 'xxx'
      // data.device_info = 'xxx'
      // data.attach = 'xxx'
      data.time_start = new Date().getTime();
      // data.time_expire = 'xxx'
      // data.goods_tag = 'xxx'
      // data.product_id = 'xxx'
      // data.attach = 'xxx'
      console.log(data);
      next(false, data);
      // });
    };
  },
  /**
   * Order process status callback
   *
   * @param appConfig
   * @returns {Function}
   */
  onNotify: function notify(models, orderMethods) {
    return function onNotify(error, data, res) {
      models.WeixinOrder.create({
        no: data.out_trade_no,
        value: data
      }).then(function(wo) {
        if (!wo) {
          throw new Error('weixin order creation failed');
        }
        return models.Order.findOne({
          no: data.out_trade_no
        }).populate('store').populate('user');
      }).then(function(order) {
        if (!order) {
          throw new Error('order not found');
        }
        return new Promise(function(resolve, reject) {
          orderMethods.userUpdate(order.id, order.user.id, 'PAID', function(error) {
            if (error === res.Success) {
              resolve(true);
            } else {
              reject(error);
            }
          });
        }).then(function() {
          return new Promise(function(resolve, reject) {
            orderMethods.update(order.id, order.store.id, 'PAID', function(error) {
              if (error === res.Success) {
                resolve(true);
              } else {
                reject(error);
              }
            });
          });
        });
      }).catch(function(error) {
        console.log(error);
        console.error(error);
        console.error(error.stack);
      });
    };
  }
};
