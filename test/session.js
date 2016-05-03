/* eslint space-before-function-paren: 0 */

var assert = require('assert');
describe('Session', function() {
  var session = require('../lib/session');
  var func = function() {};
  it('should test session', function(done) {
    session._getSession({
      session: {
        id: 3
      }
    }, 3, function(value) {
      assert(!value);
      done();
    });
  });
  it('should test session', function() {
    var visited = false;
    try {
      session._getSession(null, 3, func);
    } catch (e) {
      visited = true;
    }
    assert(visited);
  });

  it('should test session', function() {
    var visited = false;
    try {
      session._getSession({}, 3, func);
    } catch (e) {
      visited = true;
    }
    assert(visited);
  });

  it('should test session', function() {
    var visited = false;
    try {
      session._getSession({session: {}}, 3, func);
    } catch (e) {
      visited = true;
    }
    assert(visited);
  });

  it('should test session', function() {
    var visited = false;
    try {
      session._getSession({session: {id: 3}}, 3, func);
    } catch (e) {
      visited = true;
    }
    assert(!visited);
  });

  it('should test session', function() {
    var visited = false;
    try {
      session._getSession({session: {id: 3}}, null, func);
    } catch (e) {
      visited = true;
    }
    assert(visited);
  });
});
