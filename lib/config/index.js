module.exports = function config(settings, app) {
  var admin = require('./admin');
  var grocery = require('./grocery');

  admin(settings, app);
  grocery(settings, app);
};
