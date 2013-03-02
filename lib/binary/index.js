function greyscale(pixels) {
  var greyscale = new Uint8Array(pixels.length / 4);

  var i = 0,
      j = 0;

  while(i < pixels.length) {
    greyscale[j] = (
      (pixels[i    ] * 0.3) +
      (pixels[i + 1] * 0.59) + 
      (pixels[i + 2] * 0.11)
    );

    i += 4;
    j++;
  }

  return greyscale;
}

exports.greyscale = greyscale;

function histogram(grey) {
  var histogram = new Array(256);

  var i;

  for (i = histogram.length; i--;) {
    histogram[i] = 0;
  }

  for (i = grey.length; i--;) {
    histogram[grey[i]]++;
  }

  var len = grey.length;

  for (i = histogram.length; i--;) {
    histogram[i] /= len;
  }

  return histogram;
}

exports.histogram = histogram;

function threshold(hist) {
  var i;

  var ut = 0;
  for (i = hist.length; i--;) {
    ut += i * hist[i];
  }

  var threshold = 0,
      max = 0;

  var wk, uk, sigma;
  for (var k = 0; k < hist.length; k++) {
    wk = 0;
    for (i = 0; i <= k; i++) {
      wk += hist[i];
    }

    uk = 0;
    for (i = 0; i <= k; i++) {
      uk += i * hist[i];
    }

    sigma = 0;
    if (wk != 0 && wk != 1) {
      sigma = Math.pow(ut * wk - uk, 2) / (wk * (1 - wk));
    }

    if (sigma > max) {
      threshold = k;
      max = sigma;
    }
  }

  return threshold;
}

exports.threshold = threshold;

function convert(pixels) {
  var grey = greyscale(pixels),
      hist = histogram(grey),
      thr = threshold(hist);
  
  var i = 0,
      j = 0;

  while(i < pixels.length) {
    pixels[i] = pixels[i + 1] = pixels[i + 2] =
      grey[j] < thr ? 0 : 255;

    i += 4;
    j++;
  }
}

exports.convert = convert;
