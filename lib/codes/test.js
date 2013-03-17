var assert = require('assert'),
    EAN_13 = require('./ean_13');

describe('EAN-13', function() {

  describe('validate', function() {

    it('returns true for correct codes', function() {
      assert(new EAN_13('0075678164125').validate());
      assert(new EAN_13('4006381333931').validate());
      assert(new EAN_13('9781405852302').validate());
      assert(new EAN_13('9780582825284').validate());
    });

    it('returns false for incorrect codes', function() {
      assert(!new EAN_13('1234567666').validate());
      assert(!new EAN_13('1111111111111').validate());
      assert(!new EAN_13('9804730958436').validate());
      assert(!new EAN_13('5824957834895').validate());
    });

  });


  describe('decode', function() {

    var codes = {
      9788080970260: [
        '0111011', '0001001', '0001001', '0001101', '0001001', '0001101',
        '1110100', '1000100', '1110010', '1101100', '1010000', '1110010'
      ],

      8594007134438: [
        '0110001', '0010111', '0100011', '0100111', '0100111', '0111011',
        '1100110', '1000010', '1011100', '1011100', '1000010', '1001000'
      ]
    };

    it('correctly decodes', function() {
      for (var code in codes) {
        assert.equal(EAN_13.decode(codes[code]).code, code);
      }
    });

  });

});
