/* eslint camelcase: 0 */

var assert = require('assert');
var shared = require('./shared');

var order = require('../lib/order/callbacks');

var req = {
  headers: {},
  connection: {},
  ip: '192.168.0.1',
  session: {
    _weixinPay: {
      urls: {
        pay: {
          callback: 'sdfdsff'
        }
      },
      openid: {
        openid: 'sfdsdf'
      },
      type: 'JSAPI'
    },
    _order: {
      no: 'no',
      price: '1233.03'
    }
  }
};

module.exports = function (getModels, orderMethods) {
  orderMethods.userUpdate = function (orderId, UserId, type, next) {
    next(shared.errors.Success);
  };

  orderMethods.update = function (orderId, StoreId, type, next) {
    next(shared.errors.Success);
  };

  describe('Order', function () {
    it('should have onCreate onNotify', function () {
      assert(order.onCreate instanceof Function);
      assert(order.onNotify instanceof Function);
    });

    it('should have onCreate', function (done) {
      var onCreate = order.onCreate(getModels(), orderMethods);
      onCreate(req, {}, function (error, data) {
        assert(!error);
        assert(new Date(data.time_start).getTime() !== null);
        delete data.time_start;
        assert.deepEqual(data, {
          openid: 'sfdsdf',
          spbill_create_ip: '192.168.0.1',
          notify_url: 'sdfdsff',
          body: '田一块订单支付',
          out_trade_no: 'no',
          total_fee: '123303',
          trade_type: 'JSAPI'
        });
        done();
      });
    });

    it('should have onNotify', function (done) {
      var data = {
        openid: 'sfdsdf',
        spbill_create_ip: '192.168.0.1',
        notify_url: 'sdfdsff',
        body: '田一块订单支付',
        out_trade_no: shared.order.no,
        total_fee: '124626',
        trade_type: 'JSAPI'
      };
      var models = getModels();
      var onNotify = order.onNotify(models, orderMethods);
      onNotify(false, data, {
        errors: shared.errors
      }, function () {
        done();
      });
    });
    it('should handle final Error', function () {
      var error = new Error();
      order._onError(error);
    });

    it('should handle find Error', function () {
      var find = order._orderFind();
      var errored = false;
      try {
        find();
      } catch (e) {
        errored = true;
      }
      assert(errored);
    });

    it('should handle find Error', function () {
      var find = order._orderUpdate();
      var errored = false;
      try {
        find();
      } catch (e) {
        errored = true;
      }
      assert(errored);
    });

    it('should handle order updated resolve', function (done) {
      var find = order._onOrderUpdated({
        errors: shared.errors
      }, {}, function (error) {
        assert(error);
        done();
      });
      find(true);
    });
  });
};
