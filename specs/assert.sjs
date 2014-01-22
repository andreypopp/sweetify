import macros from './id.sjs';

var x = 12;
var y = id x;

function z() {
  throw id new Error('x');
}

z();
