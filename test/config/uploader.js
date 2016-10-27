var path = require('path');
module.exports = {
  type: 'disk',
  config: {
    // 文件要保存的地址
    dir: path.resolve(__dirname, '.hashed/'),
    base: 'http://localhost'
  }
};
