module.exports = function onError(e) {
  console.error(e.stack);
  throw e;
};
