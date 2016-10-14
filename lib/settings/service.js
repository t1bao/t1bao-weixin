var _ = require('lodash');
module.exports = function (models) {
  return {
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
    get: function (key, cb) {
      models.Settings.findOne({
        key: key
      }, this._onGet(key, cb));
    },
    _onGet: function (key, cb) {
      var self = this;
      return function (error, found) {
        console.log(error, found);
        if (error) {
          return cb(error);
        }
        if (!found && key) {
          return self.get(0, cb);
        }
        cb(error, found);
      };
    }
  };
};
