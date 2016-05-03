module.exports = {
  weixin: {
    init: {
      no: {
        type: 'string',
        required: true,
        minLength: 5
      },
      type: {
        type: 'enum',
        required: true,
        enums: [
          // 公共号
          'JSAPI',
          // 扫码支付
          'NATIVE',
          // 原生APP
          'APP',
          // 刷止支付
          'MICROPAY'
        ]
      },
      url: {
        type: 'url',
        required: true
      }
    }
  }
};
