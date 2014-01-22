var path        = require('path');
var assert      = require('assert');
var browserify  = require('browserify');
var esprima     = require('esprima');
var sweeten     = require('../index');

describe('sweeten', function() {

  it('works', function(done) {

    browserify(path.join(__dirname, 'assert.sjs'))
      .transform(sweeten)
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
