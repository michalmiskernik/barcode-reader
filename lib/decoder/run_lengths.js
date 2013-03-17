var enc = require('codes').EAN_13.encodings,
    rls = require('./utils.js').runLengths;

exports.guard = rls(enc.guard);

exports.left = {};

for (var key in enc.left) {
  exports.left[key] = rls(key);
}

exports.right = {};

for (var key in enc.right) {
  exports.right[key] = rls(key);
}
