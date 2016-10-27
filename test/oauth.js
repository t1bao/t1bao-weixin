/* eslint space-before-function-paren: 0 */

var assert = require('assert');
var request = require('supertest');
var http = require('./app');
var shared = require('./shared');
var fs = require('fs');

var _ = require('lodash');

var req = {
  headers: {},
  connection: {},
  ip: '127.0.0.1'
};

module.exports = function(gModels, wx, uploader) {
  describe('Oauth', function() {
    it('should be accessed', function(done) {
      var url = '/weixin/api/oauth/access';
      request(http)
        .get(url)
        .expect(302)
        .end(done);
    });

    it('should be successful', function(done) {
      var oauth = require('../lib/oauth/callbacks');
      var cb = oauth.onOAuthSuccess(gModels(), uploader);
      var url = 'http://localhost';
      cb(_.extend(req, {
        session: {
          save: function(next) {
            assert(this.weixin);
            assert(this.weixin.user);
            assert(this.weixin.user.registerIp);
            assert.equal(this.weixin.weixin.openid, wx.openid);
            assert.equal(this.weixin.weixin.unionid, wx.unionid);
            assert(this.customer);
            shared.user = this.customer;
            shared.weixin = this.weixin.weixin;
            next(false);
          },
          refer: url
        }
      }), {
        render: function(file, options) {
          assert(fs.existsSync(file + '.ejs'));
          assert(file.indexOf('views/oauth') !== -1);
          assert(options.url === url);
          done();
        }
      }, wx);
    });

    it('should be successful', function(done) {
      var oauth = require('../lib/oauth/callbacks');
      var cb = oauth.onOAuthSuccess(gModels(), uploader);
      cb(_.extend(req, {
        session: {
          save: function(next) {
            next(false);
          }
        }
      }), {
        end: function() {
          done();
        }
      }, wx);
    });

    it('should be successful', function(done) {
      var oauth = require('../lib/oauth/callbacks');
      var cb = oauth.onOAuthSuccess(gModels(), uploader);
      cb(_.extend(req, {
        session: {
          save: function(next) {
            next(true);
          }
        }
      }), {
        errorize: function() {
          done();
        }
      }, wx);
    });

    it('should test oauth error', function() {
      var onError = require('../lib/oauth/onError');
      var catched = false;
      try {
        onError(new Error());
      } catch (e) {
        catched = true;
      }
      assert(catched);
    });

    it('should test oauth weixin', function() {
      var weixin = require('../lib/oauth/weixin').makeSure(gModels(), wx);
      var obj = weixin({openid: 'sdfosodf'});

      assert(obj.then instanceof Function);
    });

    it('should test oauth user', function(done) {
      var value = 'sdfsfd';
      var user = require('../lib/oauth/user').onSaveAvatar(function() {

      }, function(data) {
        assert(data === value);
        done();
      });
      user(true, value);
    });

    it('should test oauth user', function(done) {
      var value = 'sdfsfd';
      var user = require('../lib/oauth/user')._onSaveWithExtra(function() {
      }, function(data) {
        assert(data === true);
        done();
      }, value);
      user(true);
    });

    it('should test oauth makeSure', function() {
      var user = require('../lib/oauth/user').makeSure(gModels(), wx, uploader);
      var obj = user(wx);
      assert(obj.then instanceof Function);
    });
  });
};
