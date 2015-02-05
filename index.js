"use strict";

var fs        = require('fs');
var mapAsync  = require('map-async');
var sourceMap = require('convert-source-map');
var through   = require('through');
var sweet     = require('sweet.js');
var resolve   = require('browser-resolve');

var eliminateIncludeMacros = sweet.loadNodeModule(
      process.cwd(),
      require.resolve('./import-macros.sjs'));

function extractMacroIncludes(src) {
  var tokens = sweet.expand(src);
  var mods = [];

  var tok, mod;

  for (var i = 0, len = tokens.length; i < len; i++) {

    tok = tokens[i];
    if (!(tok && tok.token.type === 4 && tok.token.value === 'import'))
      continue;

    tok = tokens[i + 1];
    if (!(tok && tok.token.type === 3 && tok.token.value === 'macros'))
      continue;

    tok = tokens[i + 2];
    if (!(tok && tok.token.type === 3 && tok.token.value === 'from'))
      continue;

    tok = mod = tokens[i + 3];
    if (!(tok && tok.token.type === 8))
      continue;

    mods.push(mod.token.value);
  }
  return mods;
}

function resolveMany(ids, opts, cb) {
  return mapAsync(ids, function(id, cb) {
    resolve(id, opts, cb);
  }, cb);
}

function loadModules(filenames, cb) {
  return mapAsync(filenames, function(filename, cb) {
    fs.readFile(filename, 'utf8', function(err, contents) {
      var mod;

      if (err)
        return cb(err);

      try {
        mod = sweet.loadModule(contents);
      } catch(e) {
        return cb(e);
      }

      cb(null, mod);
    });
  }, cb);
}

function resolveAndLoadModules(ids, opts, cb) {
  resolveMany(ids, opts, function(err, filenames) {
    if (err)
      return cb(err);
    loadModules(filenames, cb);
  });
}

module.exports = function(filename, opts) {
  opts = opts || {};
  opts.extensions = opts.extensions || /.+\.sjs$/;
  if (!opts.extensions.exec(filename))
    return through();

  var buffer = '';

  return through(
    function(chunk) { buffer += chunk; },
    function() {
      var stream = this;
      var includes;

      try {
        includes = extractMacroIncludes(buffer);
      } catch(e) {
        return stream.emit('error', e);
      }

      // load macros for all files
      if (opts.modules && opts.modules.length) {
        opts.modules.forEach(function(moduleName){
          if (includes.indexOf(moduleName) === -1) {
            includes.push(moduleName);
          }
        });
      }

      resolveAndLoadModules(includes, {filename: filename}, function(err, modules) {
        if (err) {
          return stream.emit('error', err);
        }

        var r;

        modules.unshift(eliminateIncludeMacros);

        var sweetOpts = {};
        for(var k in opts) {
          sweetOpts[k] = opts[k];
        }
        sweetOpts.modules = modules;
        sweetOpts.sourceMap = true;
        sweetOpts.filename = filename;

        try {
          r = sweet.compile(buffer, sweetOpts);
        } catch(e) {
          return stream.emit('error', e);
        }

        var map = sourceMap.fromJSON(r.sourceMap);
        map.sourcemap.sourcesContent = [buffer];

        stream.queue(r.code + '\n' + map.toComment());
        stream.queue(null);
      });
    });
}
