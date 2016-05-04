/* eslint space-before-function-paren: 0 */
/* eslint camelcase: 0 */

var assert = require('assert');
var request = require('supertest');
var http = require('./app');
var shared = require('./shared');

module.exports = function(getModels) {
  describe('Pay', function() {
    var cookies = null;
    var order = null;

    it('should set openid', function(done) {
      var url = '/session/set';
      request(http)
        .post(url)
        .expect(200)
        .end(function(err, res) {
          cookies = res.headers['set-cookie']
            .map(function(r) {
              return r.replace("; path=/; httponly", "");
            }).join("; ");
          assert(!err);
          done();
        });
    });

    it('should create an order', function(done) {
      var no = '191229292929292-sdfsf';
      var models = getModels();
      models.Store.create({
        name: 'sdofsfd'
      }).then(function(store) {
        return models.Order.create({
          store: store.id,
          user: shared.user.id,
          no: no,
          summary: '1001',
          delivery_fee: '3'
        });
      }).then(function(theOrder) {
        order = theOrder;
        shared.order = order;
        assert(order !== null);
        assert(order.id !== 0);
        assert(order.no === no);
        assert(order.store !== null);
        assert(order.user === shared.user.id);
        assert(order.summary === '1001');
        assert(order.delivery_fee === '3');
        done();
      });
    });

    it('should be initialized', function(done) {
      var url = '/pay/weixin/init?no=' + order.no + '&type=JSAPI&url=http://www.qq.com';
      var req = request(http)
        .post(url);
      req.cookies = cookies;
      req.expect(200)
        .end(function(err, res) {
          assert(!err);
          assert(res.text.indexOf('田一块订单微信支付') !== -1);
          done();
        });
    });

    it('should fail to be initialized', function(done) {
      var url = '/pay/weixin/init?no=' + order.no + '&type=JSAPI&url=http://www.qq.com';
      var req = request(http)
        .post(url);
      req.expect(302)
        .end(function(err, res) {
          assert(!err);
          assert(res.headers.location.indexOf('oauth/access') !== -1);
          done();
        });
    });

    it('should be failed due to InputInvalid', function(done) {
      var url = '/pay/weixin/init?no=' + order.no + '&type=JSAAA&url=http://www.qq.com';
      var req = request(http)
        .post(url);
      req.cookies = cookies;
      req.expect(200)
        .end(function(err, res) {
          assert(!err);
          assert(res.body.name === 'InputInvalid');
          done();
        });
    });

    it('should be accessed', function() {
      var pay = require('../lib/pay');
      pay._onFailed(true);
      pay._onFailed(false);
    });
  });
};
