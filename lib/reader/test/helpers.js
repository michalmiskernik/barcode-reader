var assert = require('assert'),
    utils = require('../helpers.js');

function tos(obj) {
  return JSON.stringify(obj);
}

describe('utils', function() {

  describe('difference', function() {

    it('calculates correct difference', function() {
      var similar = utils.difference([6, 5, 7], [1, 1, 1]),
          different = utils.difference([7, 3, 4], [1, 1, 1]);

      assert(similar < 0.2);
      assert(different > 0.2);
    });

    it('works on strings', function() {
      assert(
        utils.difference('123', '234') ==
        utils.difference([1, 2, 3], [2, 3, 4])
      );
    });

  });

  describe('scaleToOne', function() {

    it('scales to one', function() {
      var scaled = utils.scaleToOne([1, 2, 3, 4]);

      assert(tos(scaled) == tos([0.1, 0.2, 0.3, 0.4]));
    });

  });

  describe('runLengths', function() {

    var tests = [
      {
        in: [1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
        out: [3, 2, 1, 1, 2, 3, 1, 1, 1, 1]
      },

      {
        in: [1, 1, 1, 1, 1],
        out: [5]
      },

      {
        in: [1, 0],
        out: [1, 1]
      },

      {
        in: [0],
        out: [1]
      },

      {
        in: [],
        out: []
      }
    ];

    it('calculates run lengths', function() {
      tests.forEach(function(test) {
        var result = utils.runLengths(test.in);

        assert(tos(test.out) == tos(result), tos(test.in));
      });
    });

  });

});
