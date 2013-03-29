var assert = require('assert'),
    signal = require('./index.js');

describe('signal', function() {

  describe('derivate', function() {

    var tests = [
      {
        in: [3, 5, 7, 8, 7, 5, 4],
        out: [2, 2, 1, -1, -2, -1]
      },

      {
        in: [2, 2, 1, -1, -2, -1],
        out: [0, -1, -2, -1, 1]
      },

      {
        in: [],
        out: []
      },

      {
        in: [1],
        out: []
      },

      {
        in: [1, 2],
        out: [1]
      }
    ];
    
    it('returns diffs between numbers', function() {
      tests.forEach(function(test) {
        assert.deepEqual(signal.derivate(test.in), test.out);
      });
    });
  
  });

  describe('clean', function() {

    var tests = [
      {
        in: [2, -2, 2, 2, -2, -2, 2, -2, -2],
        out: [2, 2, 2, 2, -2, -2, -2, -2, -2]
      },

      {
        in: [2, 2, 2, -2, 2, -2, -2, -2, -2],
        out: [2, 2, 2, 2, 2, -2, -2, -2, -2]
      },

      {
        in: [2, 2, 2],
        out: [2, 2, 2]
      },

      {
        in: [],
        out: []
      }
    ];

    it('filters 1px wide parts', function() {
      tests.forEach(function(test) {
        assert.deepEqual(signal.clean(test.in), test.out);
      });
    });
  
  });

});
