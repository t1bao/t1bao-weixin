var path = require('path');
module.exports = {
  type: 'disk',
  config: {
    dir: path.resolve(__dirname, '.hashed/'),                  //文件要保存的地址
    base: 'http://localhost'
  }
};
