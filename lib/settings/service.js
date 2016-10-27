var _ = require('lodash');
module.exports = function (models,
  // 微信支付服务商ID
  providerId,
  // 微信支付默认收费商户ID
  defaultStoreId) {
  var service = {
    set: function (key, config, cb) {
      models.Settings.findOrCreate({
        key: key
      },
        {
          key: key,
          value: config
        }, function (error, data) {
          if (_.isEqual(data.value, config)) {
            return cb(error, data);
          }
          models.Settings.update({
            key: key
          },
            {
              key: key,
              value: config
            }, function (error, data) {
              cb(error, data[0]);
            });
        });
    },
    _onGetStoreWeixin: function (id, cb) {
      return function (error, store) {
        if (error || !store) {
          return cb(providerId);
        }
        if (store.weixin) {
          if (store.weixin.enable) {
            return cb(id);
          }
          if (store.weixin.merchantId) {
            return cb(providerId);
          }
        }
        cb(defaultStoreId);
      };
    },
    _checkGet: function (id, cb) {
      models.Store.findOne({
        id: id
      }).populate('weixin').exec(service._onGetStoreWeixin(id, cb));
    },
    get: function (key, cb, direct) {
      service._checkGet(key, function (realId) {
        if (direct) {
          realId = key;
        }
        models.Settings.findOne({
          key: realId
        }, service._onGet(realId, cb));
      });
    },
    _onGet: function (key, cb) {
      return function (error, found) {
        if (error) {
          return cb(error);
        }
        if (!found && key) {
          return service.get(providerId, cb);
        }
        cb(error, found);
      };
    }
  };
  return service;
};
