exports.process = process;

function process(signals) {
  var signal = average(signals),
      derivated = derivate(derivate(signal)),
      grouped = group(derivated),
      connected = connect(grouped);

  return connected;
};

exports.average = average;

function average(signals) {
  var width = signals[0].length,
      average = [];

  for (var i = 0; i < width; i++) {
    var values = [],
        sum = 0;

    for (var j = 0; j < signals.length; j++) {
      var value = signals[j][i];

      values.push(value);
      sum += value;
    }

    sum -= Math.max.apply(null, values);
    sum -= Math.min.apply(null, values);

    average[i] = sum / (signals.length - 2);
  }

  return average;
}

exports.smooth = smooth;

function smooth(s) {
  var output = [];

  for (var i = 2; i < s.length - 2; i++) {
    var sum = s[i - 2] + 2 * s[i - 1] + 3 * s[i] + 2 * s[i + 1] + s[i + 2],
        average = sum / 9;

    output.push(average);
  }

  return output;
}

exports.clean = clean;

function clean(numbers) {
  var out = numbers.slice();

  for (var i = 1; i < out.length - 1; i++) {
    var prev = sign(out[i - 1]),
        curr = sign(out[i]),
        next = sign(out[i + 1]);

    if (prev == next && curr != prev) {
      out[i] *= -1;
    }
  }

  return out;
}

function sign(n) {
  return n < 0 ? -1 : 1;
}

exports.derivate = derivate;

function derivate(numbers) {
  var result = [];

  for (var i = 0; i < numbers.length - 1; i++) {
    result.push(numbers[i + 1] - numbers[i]);
  }

  return result;
}
