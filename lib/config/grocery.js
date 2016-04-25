var common = require('./common');
module.exports = function grocery(settings, app) {
  common.set(
    settings,
    app,
    // 数据处理完成后的回调函数
    // ID是保存数据唯一识别号，可以自己定义
    // value是所获取或者保存的数据
    require('./callback'),
    require('./get-id').grocery,
    // 获取数据识别ID的参数名
    'appId',
    '/grocery/weixin/config/:type'
  );
};
