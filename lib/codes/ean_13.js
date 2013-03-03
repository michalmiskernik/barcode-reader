function EAN13(code) {
  this.code = code;
}

EAN13.weights = [1, 3];

EAN13.prototype.validate = function() {
  if (this.code.length != 13) return false;

  var digits = this.code
        .slice(0, -1)
        .split('');

  var check = this.code.substr(-1, 1),
      sum = 0;

  for (var i = 0; i < digits.length; i++) {
    sum += digits[i] * EAN13.weights[i % 2];
  }

  var correct = (10 - (sum % 10)) % 10;

  return check == correct;
};

EAN13.enc = {

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

}

EAN13.re = {
  code: /^101((?:0[01]{5}1){6})01010((?:1[01]{5}0){6})101$/,
  digit: /[01]{7}/g
};

EAN13.decode = function(bits) {
  var result = EAN13.re.code.exec(bits);

  if (result == null) return false;

  var left = result[1].match(EAN13.re.digit),
      right = result[2].match(EAN13.re.digit);

  var i, pair, digit,
      digits = [],
      parity = [];

  for (i = 0; i < left.length; i++) {
    pair = EAN13.enc.left[left[i]];
    digits.push(pair[0]);
    parity.push(pair[1]);
  }

  for (i = 0; i < right.length; i++) {
    digit = EAN13.enc.right[right[i]];
    digits.push(digit);
  }

  parity = parity.join('');
  digit = EAN13.enc.parity[parity];
  digits.unshift(digit);

  return new EAN13(digits.join(''));
};

module.exports = EAN13;
