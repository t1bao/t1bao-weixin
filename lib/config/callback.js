module.exports = function (req, res, id, value) {
  res.errorize(res.errors.Success, value);
};
