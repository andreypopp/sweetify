# sweeten

Browserify transform for using Sweet.js macros.

## Installation and usage

Install via npm:

    % npm install sweeten

and then use with browserify:

    % browserify -t sweeten ./mycode.sjs

Sweeten transform kicks in only for files with `.sjs` extension.

## Importing macros

You can use a restricted form of ES6 module import statement to import macros in
current module's scope:

    import macros from './my-macros.sjs'
    import macros from 'some-pkg'

    // use everything exported from ./my-macros.sjs or some-pkg node module
