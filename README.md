# sweetify

Browserify transform for using Sweet.js macros.

## Installation and usage

Install via npm:

    % npm install sweetify

and then use with browserify:

    % browserify -t sweetify ./mycode.sjs

Sweeten transform kicks in only for files with `.sjs` extension.

## Importing macros

You can use a restricted form of ES6 module import statement to import macros in
current module's scope:

    import macros from './my-macros.sjs'
    import macros from 'some-pkg'

    // use everything exported from ./my-macros.sjs or some-pkg node module

## Example

As an example, you can see how you can re-use macros already present on npm:

    % npm install sparkler

Then create a source file called `sparkler-example.sjs`:

    import macros from 'sparkler/macros';

    function myPatterns {
      case 42 => 'The meaning of life'
      case a @ String => 'Hello ' + a
      case [...front, back] => back.concat(front)
      case { foo: 'bar', x, 'y' } => x
      case Email{ user, domain: 'foo.com' } => user
      case (a, b, ...rest) => rest
      case [...{ x, y }] => _.zip(x, y)
      case x @ Number if x > 10 => x
    }

This example uses excellent [sparkler](https://npmjs.org/package/sparkler)
macros library which implements pattern matching for JavaScript. Just run

    % browserify -t sweetify ./sparkler-example.sjs

to produce a JavaScript which you can run in a browser or any other runtime (all
pattern matching constructs are compiler into plain JS constructs).
