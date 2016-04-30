/* eslint space-before-function-paren: 0 */

var assert = require('assert');
// var request = require('supertest');
// var http = require('./app');
module.exports = function(getStorage) {
  describe('Settings', function() {
    var settings = require('../lib/settings');
    it('should invalid value', function(done) {
      var func = settings._onSet(1, function(value) {
        assert(value === null);
        done();
      });
      func(true);
    });

    it('should valid value', function(done) {
      var func = settings._onSet(1, function(value) {
        assert(value === 1);
        done();
      });
      func(false);
    });

    it('should set settings', function(done) {
      var func = settings._set(getStorage());
      var v = 2;
      func(1, 'app', v, function(value) {
        assert(value === v);
        done();
      });
    });

    it('should get settings', function(done) {
      var func = settings._get(getStorage());
      var v = 2;
      func(1, 'app', function(value) {
        assert(value === v);
        done();
      });
    });

    it('should _checkFunction', function() {
      var checked = false;
      try {
        settings._checkFunction();
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkError', function() {
      var checked = false;
      try {
        settings._checkError(true);
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkSettings', function() {
      var checked = false;
      try {
        settings._checkSettings(true);
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkSettings', function() {
      var checked = false;
      try {
        settings._checkSettings(true, {});
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });

    it('should _checkSettings', function() {
      var checked = false;
      try {
        settings._checkSettings(true, {
          value: undefined
        });
      } catch (e) {
        checked = true;
      }
      assert(checked);
    });
  });
};
