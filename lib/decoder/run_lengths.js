var enc = require('encodings').EAN13,
    utils = require('./utils.js');

var rls = utils.runLengths,
    head = utils.head;

function convert(str) {
  return rls(str).map(head);
}

exports.guard = convert(enc.guard);

exports.left = {};

for (var key in enc.left) {
  exports.left[key] = convert(key);
}

exports.right = {};

for (var key in enc.right) {
  exports.right[key] = convert(key);
}
