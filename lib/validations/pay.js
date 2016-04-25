module.exports = {
  weixin: {
    init: {
      type: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 10
      },
      no: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 100
      },
      url: {
        type: 'url',
        required: true
      }
    }
  }
};
