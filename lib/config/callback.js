module.exports = function callback(req, res, id, value) {
  res.errorize(res.errors.Success, value);
};
