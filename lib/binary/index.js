exports.convert = function(data) {
  if (data.length == null) {
    throw new Error('object is not an array');
  }

  for (var i = data.length; i; i -= 4) {
    data[i - 4] = data[i - 3] = data[i - 2] = 
      (
        (data[i - 4] * 0.3) +
        (data[i - 3] * 0.59) + 
        (data[i - 2] * 0.11)
      ) < 100 ? 0 : 255
  }
};
