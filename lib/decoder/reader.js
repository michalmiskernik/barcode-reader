var utils = require('./utils.js'),
    enc = {
      codes: require('codes').EAN_13.encodings,
      rls: require('./run_lengths.js')
    };

exports.read = function(row) {
  var rls = utils.runLengths(row).map(utils.head);

  // find guard

  var cursor = findGuard(rls);

  if (cursor == null) {
    return null;
  }

  // decode left group

  cursor += 3; // left guard

  var left = readGroup(rls, cursor, enc.rls.left).map(function(code) {
    return enc.codes.left[code][0];
  });

  cursor += 24; // previous group
  cursor += 5; // middle guard

  var right = readGroup(rls, cursor, enc.rls.right).map(function(code) {
    return enc.codes.right[code];
  });

  return left.concat(right);
};

function findGuard(rls) {
  var guard = enc.rls.guard;

  var chunk, diff;

  for (var i = 0; i < rls.length - 2; i++) {
    chunk = rls.slice(i, i + 3);
    diff = utils.difference(chunk, guard);

    if (diff < 0.2) {
      return i;
    }
  }

  return null;
}

function readGroup(rls, offset, encodings) {
  var result = [],
      chunk, code;

  for (var i = 0, j; i < 6; i++) {
    j = offset + i * 4;
    chunk = rls.slice(j, j + 4);
    code = readChunk(chunk, encodings);
    result.push(code);
  }

  return result;
}

function readChunk(chunk, encodings) {
  var res = {
    diff: null,
    code: null
  };

  var code, diff;

  for (code in encodings) {
    diff = utils.difference(chunk, encodings[code]);

    if (res.diff == null || diff < res.diff) {
      res.diff = diff;
      res.code = code;
    }
  }

  return res.code;
}
