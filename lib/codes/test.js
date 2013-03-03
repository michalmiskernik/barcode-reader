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

  describe('decode', function() {

    it('returns valid code', function() {
      var codes = {
        9788080970260: '101011101100010010001001000110100010010001101010' +
          '10111010010001001110010110110010100001110010101',

        8594007134438: '101011000100101110100011010011101001110111011010' +
          '10110011010000101011100101110010000101001000101'
      };

      for (var code in codes) {
        assert(ean.decode(codes[code]) == code);
      }
    });

  });

});
