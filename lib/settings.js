/* eslint space-before-function-paren: 0 */
var settings = require('node-weixin-settings');
var errors = require('errorable').get(require('errorable-settings'));

module.exports = function(storage) {
  // var storage = SettingsService;
  // var settingsConf = {};

  console.log(storage);

  function get(id, key, next) {
    if (!next instanceof Function) {
      throw new Error('Function Required');
    }
    storage.get(id, function(error, data) {
      if (error || !data || !data.value) {
        console.error('Setting get failed, due to no setting found!');
        throw errors.SettingsNotFound;
      }
      next(data.value[key]);
    });
  }

  function set(id, key, value, next) {
    if (!next instanceof Function) {
      throw new Error();
    }

    storage.get(id, function(error, data) {
      console.log(error, data);
      if (error || !data) {
        console.error('Setting get failed, due to no setting found!');
        throw errors.SettingsNotFound;
      }
      data.value[key] = value;
      storage.set(id, data.value, function(error) {
        if (error) {
          return next(null);
        }
        next(value);
      });
    });
  }

  function all(id, next) {
    if (!next instanceof Function) {
      throw new Error();
    }
    // console.log("inside all 1");
    storage.get(id, function(error, data) {
      console.log('inside all 2');
      if (error || !data || !data.value) {
        console.log('inside all 3');
        console.error('Setting get failed, due to no setting found!');
        throw errors.SettingsNotFound;
      }
      console.log(data.value);
      next(data.value);
    });
  }

  settings.registerSet(set);
  settings.registerGet(get);
  settings.registerAll(all);
  return settings;
};
