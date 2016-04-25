/* eslint space-before-function-paren: 0 */

var configRouter = require('node-weixin-express-config');

module.exports = {
  getHandler: function(id, settings, callback, getId) {
    return configRouter.router(id, settings, callback, getId);
  },
  setHandler: function(router, handler, url) {
    router.get(url, handler.__handlers.get);
    router.post(url, handler.__handlers.post);
  },
  set: function(settings, app, callback, getId, id, url) {
    var handler = this.getHandler(id, settings, callback, getId);
    this.setHandler(app, handler, url);
  }
};
