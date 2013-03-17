function EAN_13(code) {
  this.code = code;
}

EAN_13.weights = [1, 3];

EAN_13.prototype.validate = function() {
  if (this.code.length != 13) return false;

  var digits = this.code
        .slice(0, -1)
        .split('');

  var check = this.code.substr(-1, 1),
      sum = 0;

  for (var i = 0; i < digits.length; i++) {
    sum += digits[i] * EAN_13.weights[i % 2];
  }

  var correct = (10 - (sum % 10)) % 10;

  return check == correct;
};

EAN_13.decode = function(bits) {
  var i = 0,
      match,
      code = '',
      parity = '';

  while (i < 6) {
    match = EAN_13.encodings.left[bits[i]];

    if (match == null) {
      throw new Error('invalid sequence: ', bits[i]);
    }

    code += match[0];
    parity += match[1];

    i++;
  }

  while (i < 12) {
    match = EAN_13.encodings.right[bits[i]];

    if (match == null) {
      throw new Error('invalid sequence: ', bits[i]);
    }

    code += match;
    
    i++;
  }

  code = EAN_13.encodings.parity[parity] + code;

  return new EAN_13(code);
};

EAN_13.encodings = {

  guard: '101',

  // Bits => [Digit, Parity]

  left: {
    '0001101': [0, 1], '0011001': [1, 1], '0010011': [2, 1],
    '0111101': [3, 1], '0100011': [4, 1], '0110001': [5, 1],
    '0101111': [6, 1], '0111011': [7, 1], '0110111': [8, 1],
    '0001011': [9, 1], '0100111': [0, 0], '0110011': [1, 0],
    '0011011': [2, 0], '0100001': [3, 0], '0011101': [4, 0],
    '0111001': [5, 0], '0000101': [6, 0], '0010001': [7, 0],
    '0001001': [8, 0], '0010111': [9, 0]
  },

  // Bits => Digit

  right: {
    '1110010': 0, '1100110': 1, '1101100': 2, '1000010': 3, '1011100': 4,
    '1001110': 5, '1010000': 6, '1000100': 7, '1001000': 8, '1110100': 9
  },

  // Parity => Digit

  parity: {
    '111111': 0, '110100': 1, '110010': 2, '110001': 3, '101100': 4,
    '100110': 5, '100011': 6, '101010': 7, '101001': 8, '100101': 9
  }

};

module.exports = EAN_13;
