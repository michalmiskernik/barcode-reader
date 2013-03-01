exports.read = function(image) {
  if (!(image instanceof ImageData)) {
    throw new Error('argument is not an instance of ImageData');
  }
};
