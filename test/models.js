var sailsMemoryAdapter = require('sails-memory');
var serverModels = require('t1bao-models');

var config = {
  adapters: {
    memory: sailsMemoryAdapter
  },

  connections: {
    default: {
      adapter: 'memory'
    }
  },
  defaults: {
    migrate: 'alter'
  }
};

module.exports = {
  init: function (next) {
    serverModels.init(config, {connection: 'default'}, next);
  }
};
