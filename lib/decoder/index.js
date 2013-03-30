var signal = require('signal'),
    EAN_13 = require('codes').EAN_13,
    reader = require('reader'),
    binary = require('binary');

exports.decode = function(image) {
  if (!(image instanceof ImageData)) {
    throw new Error('argument is not an instance of ImageData');
  }

  var data = image.data,
      width = image.width,
      height = image.height;

  var rows = [];

  for (var i = 0; i < height; i += 2) {
    var row = data.subarray(4 * i * width, 4 * (i + 1) * width),
        grey = binary.greyscale(row);

    rows.push(grey);
  }

  var bits = signal.process(rows).map(function(n) {
    return n > 0;
  });
  
  var digits = reader.read(bits);

  if (digits != null) {
    var code = EAN_13.decode(digits);

    if (EAN_13.validate(code)) {
      return code;
    } else {
      console.log('invalid code found', code);
    }
  }

  return null;
};
