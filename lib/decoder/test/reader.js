var assert = require('assert'),
    rls = require('../run_lengths.js'),
    reader = require('../reader.js');

function tos(obj) {
  return JSON.stringify(obj);
}

describe('reader', function() {

  describe('findGuard', function() {

    it('returns index', function() {
      assert.equal(reader.findGuard([10, 2, 2, 3, 5, 2]), 1);
      assert.equal(reader.findGuard([4, 20, 3, 4, 3, 9, 3]), 2);
    });

    it('returns null when guard is not found', function() {
      assert.equal(reader.findGuard([10, 20, 30]), null);
      assert.equal(reader.findGuard([]), null);
    });

  });

  describe('readGroup', function() {

    var successful = [
      {
        in: [0, 0, 0,  3, 2, 1, 1,  2, 2, 2, 1,  2, 1, 2, 2,  1, 4, 1, 1,  1, 1, 3, 2,  1, 2, 3, 1],
        out: ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110']
      }
    ];

    it('returns codes', function() {
      successful.forEach(function(test) {
        assert.deepEqual(reader.readGroup(test.in, 3, rls.right), test.out);
      });
    });

    var failed = [
      [0, 0, 0,  1, 2, 3, 4,  2, 3, 4,  1, 2, 3, 4]
    ];

    it('returns null for invalid sequences', function() {
      failed.forEach(function(test) {
        assert.equal(reader.readGroup(test, 3, rls.left), null);
      });
    });

  });

  describe('readChunk', function() {

    it('returns code of chunk', function() {
      assert.equal(reader.readChunk([3, 1, 1, 2], rls.left), '0001011');
      assert.equal(reader.readChunk([2, 2, 2, 1], rls.left), '0011001');
    });

    it('returns null when chunk is not long enough', function() {
      assert.equal(reader.readChunk([1, 2, 3], rls.left), null);
      assert.equal(reader.readChunk([], rls.left), null);
    });

  });

});
