/* eslint space-before-function-paren: 0 */
var settings = {
  _checkFunction: function checkFunction(next) {
    if (!(next instanceof Function)) {
      throw new Error('Function Required');
    }
  },
  _checkSettings: function checkSettings(error, data) {
    if (error || !data || !data.value) {
      throw Error('Settings Not Found!');
    }
  },
  _checkError: function checkError(error) {
    if (error) {
      console.error('Something unknown happen!');
      throw Error('Unknown Error!');
    }
  },
  _get: function get(storage) {
    return function(id, key, next) {
      settings._checkFunction(next);
      id = String(id);
      storage.get(id, function(error, data) {
        settings._checkSettings(error, data);
        next(data.value[key]);
      });
    };
  },
  _onSet: function _onSet(value, next) {
    return function onSet(error) {
      if (error) {
        return next(null);
      }
      next(value);
    };
  },
  _set: function set(storage) {
    return function(id, key, value, next) {
      settings._checkFunction(next);
      id = String(id);
      storage.get(id, function(error, data) {
        settings._checkError(error);
        data = data || {};
        data.value = data.value || {};
        data.value[key] = value;
        storage.set(id, data.value, settings._onSet(value, next));
      });
    };
  },
  _all: function all(storage) {
    return function(id, next) {
      settings._checkFunction(next);
      id = String(id);
      storage.get(id, function(error, data) {
        settings._checkSettings(error, data);
        next(data.value);
      });
    };
  },
  get: function(storage) {
    var settingsModule = require('node-weixin-settings');
    settingsModule.registerSet(settings._set(storage));
    settingsModule.registerGet(settings._get(storage));
    settingsModule.registerAll(settings._all(storage));
    return settingsModule;
  }
};
module.exports = settings;
