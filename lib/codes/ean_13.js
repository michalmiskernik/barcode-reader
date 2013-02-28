var weight = [1, 3];

exports.validate = function(digits) {
  if (digits.length != 13) return false;

  var code = digits.slice(0, -1).split('').map(Number),
      check = Number(digits.substr(-1, 1));

  var sum = 0;
  for (var i = 0; i < code.length; i++) {
    sum += code[i] * weight[i % 2];
  }

  var correct = (10 - (sum % 10)) % 10;

  return check === correct;
};
