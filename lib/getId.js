
module.exports = {
  init: function (config) {
    var self = this;
    return function (req, cb) {
      if (!(req.session && req.session._order)) {
        return cb(0);
      }
      var order = req.session._order;
      var models = config.models;
      models.Order.findOne({
        no: order.no
      }).populate('store').populate('user').exec(self._onExec(cb));
    };
  },
  _onExec: function (cb) {
    return function (error, found) {
      if (error) {
        return cb(0);
      }
      if (!found) {
        return cb(0);
      }
      cb(found.store.id);
    };
  }
};
