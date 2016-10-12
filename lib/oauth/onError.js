module.exports = function (e) {
  console.error(e.stack);
  throw e;
};
