var assert = require('assert'),
    EAN13 = require('./ean_13');

describe('EAN-13', function() {

  describe('validate', function() {

    it('returns true for correct codes', function() {
      assert(new EAN13('0075678164125').validate());
      assert(new EAN13('4006381333931').validate());
      assert(new EAN13('9781405852302').validate());
      assert(new EAN13('9780582825284').validate());
    });

    it('returns false for incorrect codes', function() {
      assert(!new EAN13('1234567666').validate());
      assert(!new EAN13('1111111111111').validate());
      assert(!new EAN13('9804730958436').validate());
      assert(!new EAN13('5824957834895').validate());
    });

  });

});
