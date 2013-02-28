var assert = require('assert'),
    ean = require('./ean_13');

describe('EAN-13', function() {

  describe('validate', function() {

    it('returns true for correct codes', function() {
      assert(ean.validate('0075678164125'));
      assert(ean.validate('4006381333931'));
      assert(ean.validate('9781405852302'));
      assert(ean.validate('9780582825284'));
    });

    it('returns false for incorrect codes', function() {
      assert(!ean.validate('1234567666'));
      assert(!ean.validate('1111111111111'));
      assert(!ean.validate('9804730958436'));
      assert(!ean.validate('5824957834895'));
    });

  });

});
