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

  describe('decode', function() {

    it('returns valid code', function() {
      var codes = {
        9788080970260: '101011101100010010001001000110100010010001101010' +
          '10111010010001001110010110110010100001110010101',

        8594007134438: '101011000100101110100011010011101001110111011010' +
          '10110011010000101011100101110010000101001000101'
      };

      for (var code in codes) {
        assert(EAN13.decode(codes[code]).code == code);
      }
    });

  });

});
