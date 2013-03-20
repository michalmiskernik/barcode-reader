var utils = exports;

utils.runLengths = function(list) {
  var res = [],
      i = 0, item, count;

  while (i < list.length) {
    item = list[i];
    count = 1;

    while (list[++i] == item) count++;

    res.push(count);
  }

  return res;
};

utils.scaleToOne = function(list) {
  var i, sum = 0;

  for (i = 0; i < list.length; i++) {
    sum += +list[i];
  }

  var res = [];
  for (i = 0; i < list.length; i++) {
    res[i] = list[i] / sum;
  }

  return res;
};

utils.difference = function(first, second) {
  first = utils.scaleToOne(first);
  second = utils.scaleToOne(second);

  var len = Math.min(first.length, second.length),
      diff = 0;

  for (var i = 0; i < len; i++) {
    diff += Math.abs(first[i] - second[i]);
  }

  return diff;
};
