exports.read = function(data) {
  if (!(data instanceof ImageData)) {
    throw new Error('argument is not an instance of ImageData');
  }
};
