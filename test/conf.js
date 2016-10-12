var async = require('async');

var conf = {
  app: {
    id: '1'
  },
  urls: {
    oauth: {
      success: 'http://loclahost'
    }
  },
  oauth: {
    state: 'STATE',
    scope: 0
  }
};

module.exports = function (settings, id, next) {
  var keys = Object.keys(conf);
  async.eachSeries(keys, function (key, cb) {
    settings.set(id, key, conf[key], function () {
      cb(null);
    });
  }, function (err) {
    settings.all(id, function () {
      if (err) {
        console.error(err);
        next(true);
      } else {
        next(false);
      }
    });
  });
};
