var binary = require('binary'),
    EAN_13 = require('codes').EAN_13,
    reader = require('reader');

exports.decode = function(image) {
  if (!(image instanceof ImageData)) {
    throw new Error('argument is not an instance of ImageData');
  }

  var data = image.data;

  var i = 0, row, bits, digits, code;

  while (i < image.height) {
    row = data.subarray(i * image.width * 4, ++i * image.width * 4);
    bits = binary.transform(row);
    digits = reader.read(bits);

    if (digits != null) {
      code = EAN_13.decode(digits);

      if (EAN_13.validate(code)) {
        return [code];
      } else {
        console.log('invalid code found', code);
      }
    }
  }

  return null;
};
