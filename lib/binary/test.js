var assert = require('assert'),
    binary = require('./index');

var _every = function(arr, fn) {
  Array.prototype.every.call(arr, fn);
};

describe('greyscale', function() {

  it('converts colors to greyscale', function() {
    var pixels = [
      0, 0, 0, 0,
      125, 125, 125, 0,
      255, 255, 255, 0
    ];

    var greyscale = binary.greyscale(pixels);

    assert(greyscale.length == 3, 'has three items');
    assert(greyscale[0] == 0, 'first is black');
    assert(greyscale[2] == 255, 'third is white');
  });

});

describe('histogram', function() {

  it('creates histogram', function() {
    var values = [0, 100, 200, 255],
        hist = binary.histogram(values);

    assert(hist[0] == 0.25, 'probability of 0 is .25');
    assert(hist[100] == 0.25, 'probability of 100 is .25');
    assert(hist[200] == 0.25, 'probability of 200 is .25');
    assert(hist[255] == 0.25, 'probability of 255 is .25');
  });

});
