var common = require('./common');
module.exports = function (settings, app) {
  var data = {
    settings: settings,
    app: app,
    // 数据处理完成后的回调函数
    // ID是保存数据唯一识别号，可以自己定义
    // value是所获取或者保存的数据
    callback: require('./callback'),
    getId: require('./get-id').grocery,
    // 获取数据识别ID的参数名
    id: 'appId',
    url: '/grocery/weixin/config/:type'
  };
  common.set(data);
};
