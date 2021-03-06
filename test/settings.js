
var assert = require('assert');
var request = require('supertest');
var http = require('./app');
module.exports = function (getStorage, gConfig) {
  describe('Settings', function () {
    var settings = require('../lib/settings');
    it('should invalid value', function (done) {
      var func = settings._onSet(1, function (value) {
        assert(value === null);
        done();
      });
      func(true);
    });

    it('should valid value', function (done) {
      var func = settings._onSet(1, function (value) {
        assert(value === 1);
        done();
      });
      func(false);
    });

    it('should set settings', function (done) {
      var func = settings._set(getStorage());
      var v = 2;
      func(1, 'app', v, function (value) {
        assert(value === v);
        done();
      });
    });

    it('should get settings', function (done) {
      var func = settings._get(getStorage());
      var v = 2;
      func(1, 'app', function (value) {
        assert(value === v);
        done();
      }, true);
    });

    it('should not get', function (done) {
      var func = settings._onGet(function (data) {
        assert.deepEqual(data, {});
        done();
      });
      func(true, null);
    });

    it('should not get', function (done) {
      var func = settings._onGet(function (data) {
        assert.deepEqual(data, {});
        done();
      });
      func(false, null);
    });

    it('should not get all', function (done) {
      var func = settings._onAll(function (data) {
        assert.deepEqual(data, {});
        done();
      });
      func(true, null);
    });

    it('should not get all 1', function (done) {
      var func = settings._onAll(function (data) {
        assert.deepEqual(data, {});
        done();
      });
      func(true, null);
    });

    it('should not get all 2', function (done) {
      var func = settings._onAll(function (data) {
        assert.deepEqual(data, {});
        done();
      });
      func(false, null);
    });

    it('should not get all 3', function (done) {
      var func = settings._onAll(function (data) {
        assert(!data);
        done();
      });
      func(false, {});
    });

    it('should _checkFunction', function () {
      var checked = false;
      try {
        settings._checkFunction();
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkError', function () {
      var checked = false;
      try {
        settings._checkError(true);
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkSettings', function () {
      var checked = false;
      try {
        settings._checkSettings(true);
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkSettings', function () {
      var checked = false;
      try {
        settings._checkSettings(true, {});
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkSettings', function () {
      var checked = false;
      try {
        settings._checkSettings(true, {
          value: undefined
        });
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _onGet', function (done) {
      var service = require('../lib/settings/service')(gConfig().models);
      var cb = service._onGet(0, function (error) {
        assert(error === 'error');
        done();
      });
      cb('error');
    });
    it('should _onGet', function (done) {
      var service = require('../lib/settings/service')(gConfig().models);
      var cb = service._onGet(0, function (error, found) {
        assert(!error);
        assert(found);
        done();
      });
      cb(null, {
        id: 1
      });
    });

    it('should _onGet', function (done) {
      var service = require('../lib/settings/service')(gConfig().models);
      var cb = service._onGet(1, function (error, found) {
        assert(!error);
        assert(!found);
        done();
      });
      cb(null, null);
    });

    it('should _onGetStoreWeixin', function (done) {
      var service = require('../lib/settings/service')(gConfig().models,
        process.env.T1BAO_WEIXIN_PROVIDER_ID,
        process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID);
      var cb = service._onGetStoreWeixin(1, function (id) {
        var vid = process.env.T1BAO_WEIXIN_PROVIDER_ID || 0;
        assert(id === vid);
        done();
      });
      cb(null, null);
    });

    it('should _onGetStoreWeixin', function (done) {
      var service = require('../lib/settings/service')(gConfig().models,
        process.env.T1BAO_WEIXIN_PROVIDER_ID,
        process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID);
      var cb = service._onGetStoreWeixin(1, function (id) {
        assert(id === process.env.T1BAO_WEIXIN_PROVIDER_ID);
        done();
      });
      cb(true, null);
    });

    it('should _onGetStoreWeixin', function (done) {
      var service = require('../lib/settings/service')(gConfig().models,
        process.env.T1BAO_WEIXIN_PROVIDER_ID,
        process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID);
      var cb = service._onGetStoreWeixin(1, function (id) {
        assert(id === process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID);
        done();
      });
      cb(false, {});
    });

    it('should _onGetStoreWeixin', function (done) {
      var service = require('../lib/settings/service')(gConfig().models,
        process.env.T1BAO_WEIXIN_PROVIDER_ID,
        process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID);
      var cb = service._onGetStoreWeixin(201, function (id) {
        assert(id === 201);
        done();
      });
      cb(false, {
        weixin: {
          enable: true
        }
      });
    });

    it('should _onGetStoreWeixin', function (done) {
      var service = require('../lib/settings/service')(gConfig().models,
        process.env.T1BAO_WEIXIN_PROVIDER_ID,
        process.env.T1BAO_WEIXIN_DEFAULT_MERCHANT_ID);
      var cb = service._onGetStoreWeixin(201, function (id) {
        assert(id === process.env.T1BAO_WEIXIN_PROVIDER_ID);
        done();
      });
      cb(false, {
        weixin: {
          merchantId: '1999333'
        }
      });
    });

    var cookies = null;

    it('should login merchant', function (done) {
      var url = '/merchant/login';
      request(http)
        .post(url)
        .expect(200)
        .end(function (err, res) {
          cookies = res.headers['set-cookie']
            .map(function (r) {
              return r.replace('; path=/; httponly', '');
            }).join('; ');
          assert(!err);
          done();
        });
    });

    function settingFunc(key, prefix, query, config) {
      it('should set settings at ' + prefix, function (done) {
        var url = prefix + key;
        if (query) {
          url = url + '?' + query;
        }
        var req = request(http)
          .post(url);
        req.cookies = cookies;
        req.send(config[key])
          .expect(200)
          .end(function (err) {
            assert(!err);
            done();
          });
      });
    }
    var config = require('./config/settings');

    for (var k in config) {
      if (typeof k === 'string') {
        settingFunc(k, '/grocery/weixin/config/', null, config);
        settingFunc(k, '/admin/weixin/config/', null, config);
        settingFunc(k, '/admin/weixin/config/', 'grocery=1', config);
        settingFunc(k, '/admin/weixin/config/', 'grocery=a', config);
      }
    }
    it('get onExec 0', function (done) {
      var getId = require('./../lib/getId');
      var cb = getId._onExec(function (id) {
        assert(id === 0);
        done();
      });
      cb(true, null);
    });
    it('get onExec 1', function (done) {
      var getId = require('./../lib/getId');
      var cb = getId._onExec(function (id) {
        assert(id === 0);
        done();
      });
      cb(false, null);
    });
    it('get onExec 2', function (done) {
      var getId = require('./../lib/getId');
      var cb = getId._onExec(function (id) {
        assert(id === 0);
        done();
      });
      cb(false, null);
    });
    it('get onExec 3', function (done) {
      var getId = require('./../lib/getId');
      var cb = getId._onExec(function (id) {
        assert(id === 1);
        done();
      });
      cb(false, {
        store: {
          id: 1
        }
      });
    });

    it('get onExec 1', function (done) {
      var getId = require('./../lib/getId');
      var cb = getId.init(gConfig());
      cb({
        session: {
          _order: {
            no: 'no'
          }
        }
      }, function () {
      });
      done();
    });
  });
};
