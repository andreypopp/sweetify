var path        = require('path');
var assert      = require('assert');
var browserify  = require('browserify');
var esprima     = require('esprima');
var sweetify    = require('../index');

describe('sweetify', function() {

  it('works', function(done) {

    browserify(path.join(__dirname, 'assert.sjs'))
      .transform(sweetify)
      .bundle(function(err, contents) {
        if (err) return done(err);
        assert.ok(contents);
        try {
          assert.ok(esprima.parse(contents));
        } catch (e) {
          return done(e);
        }
        done();
      });
  });
});
