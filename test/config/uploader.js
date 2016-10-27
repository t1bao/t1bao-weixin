var path = require('path');
module.exports = {
  // type: 'oss',
  // config: {
  //   accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.ALIYUN_OSS_ACCESS_KEY_SECRET,
  //   endpoint: process.env.ALIYUN_OSS_ENDPOINT,
  //   apiVersion: process.env.ALIYUN_OSS_APP_VERSION,
  //   Bucket: process.env.ALIYUN_OSS_BUCKET,
  //   base: process.env.ALIYUN_OSS_BASE
  // }
  type: 'disk',
  config: {
    dir: path.resolve(__dirname, '.hashed/'),                  //文件要保存的地址
    base: 'http://localhost'
  }
};
