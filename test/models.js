var sailsMemoryAdapter = require('sails-memory');
var serverModels = require('server-models-waterline');

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
  init: function __init(next) {
    serverModels.init(config, {connection: 'default'}, next);
  }
};
