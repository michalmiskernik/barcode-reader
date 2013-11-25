
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("miscer-webcam/index.js", function(exports, require, module){
var URL = window.URL || window.webkitURL;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

exports.record = function(success, fail) {
  var video = document.createElement('video');

  video.addEventListener('canplay', function() {
    success(video);
  });

  getUserMedia.call(navigator, { video: true }, function(stream) {
    video.src = URL.createObjectURL(stream);
    video.play();
  }, fail);
};

exports.supported = !!getUserMedia && !!URL;

});
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-bind/index.js", function(exports, require, module){

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = [].slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

});
require.register("signal/index.js", function(exports, require, module){
exports.process = process;

function process(signals) {
  var signal = average(signals),
      smoothed = smooth(signal),
      derivated = derivate(derivate(smoothed)),
      cleaned = clean(derivated);

  return cleaned;
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

});
require.register("codes/index.js", function(exports, require, module){
exports.EAN_13 = require('./ean_13');

});
require.register("codes/ean_13.js", function(exports, require, module){
var EAN_13 = exports;

EAN_13.weights = [1, 3];

EAN_13.validate = function(code) {
  if (code.length != 13) return false;

  var digits = code.slice(0, -1),
      check = code.substr(-1, 1),
      sum = 0;

  for (var i = 0; i < digits.length; i++) {
    sum += digits[i] * EAN_13.weights[i % 2];
  }

  var correct = (10 - (sum % 10)) % 10;

  return check == correct;
};

EAN_13.decode = function(bits) {
  var i = 0,
      match,
      code = '',
      parity = '';

  while (i < 6) {
    match = EAN_13.encodings.left[bits[i]];

    if (match == null) {
      throw new Error('invalid sequence: ', bits[i]);
    }

    code += match[0];
    parity += match[1];

    i++;
  }

  while (i < 12) {
    match = EAN_13.encodings.right[bits[i]];

    if (match == null) {
      throw new Error('invalid sequence: ', bits[i]);
    }

    code += match;
    
    i++;
  }

  return EAN_13.encodings.parity[parity] + code;
};

EAN_13.encodings = {

  guard: '101',

  // Bits => [Digit, Parity]

  left: {
    '0001101': [0, 1], '0011001': [1, 1], '0010011': [2, 1],
    '0111101': [3, 1], '0100011': [4, 1], '0110001': [5, 1],
    '0101111': [6, 1], '0111011': [7, 1], '0110111': [8, 1],
    '0001011': [9, 1], '0100111': [0, 0], '0110011': [1, 0],
    '0011011': [2, 0], '0100001': [3, 0], '0011101': [4, 0],
    '0111001': [5, 0], '0000101': [6, 0], '0010001': [7, 0],
    '0001001': [8, 0], '0010111': [9, 0]
  },

  // Bits => Digit

  right: {
    '1110010': 0, '1100110': 1, '1101100': 2, '1000010': 3, '1011100': 4,
    '1001110': 5, '1010000': 6, '1000100': 7, '1001000': 8, '1110100': 9
  },

  // Parity => Digit

  parity: {
    '111111': 0, '110100': 1, '110010': 2, '110001': 3, '101100': 4,
    '100110': 5, '100011': 6, '101010': 7, '101001': 8, '100101': 9
  }

};

});
require.register("reader/index.js", function(exports, require, module){
var helpers = require('./helpers.js'),
    enc = require('./run_lengths.js');

function readRow(row) {
  var rls = helpers.runLengths(row);

  if (rls.length != 61) {
    return null;
  }

  var cursor = 1;

  // decode left group

  cursor += 3; // left guard

  var left = readGroup(rls, cursor, enc.left);

  // if (left != null) {
  //   console.log('found left group', left);
  // }

  cursor += 24; // previous group
  cursor += 5; // middle guard

  var right = readGroup(rls, cursor, enc.right);

  // if (right != null) {
  //   console.log('found right group', right);
  // }

  if (left == null || right == null) {
    return null;
  } else {
    return [].concat(left, right);
  }
}

function findGuard(rls) {
  var guard = enc.guard;

  var chunk, diff;

  for (var i = 0; i < rls.length - 2; i++) {
    chunk = rls.slice(i, i + 3);
    diff = helpers.difference(chunk, guard);

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

    if (code == null) {
      return null;
    }

    result.push(code);
  }

  return result;
}

function readChunk(chunk, encodings) {
  if (chunk.length != 4) {
    return null;
  }

  // console.log('reading chunk', chunk);

  var res = {
    diff: null,
    code: null
  };

  var code, diff;

  for (code in encodings) {
    diff = helpers.difference(chunk, encodings[code]);

    if (res.diff == null || diff < res.diff) {
      res.diff = diff;
      res.code = code;
    }
  }

  return res.code;
}

exports.read = readRow;
exports.findGuard = findGuard;
exports.readGroup = readGroup;
exports.readChunk = readChunk;

});
require.register("reader/helpers.js", function(exports, require, module){
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

});
require.register("reader/run_lengths.js", function(exports, require, module){
var enc = require('codes').EAN_13.encodings,
    rls = require('./helpers.js').runLengths;

exports.guard = rls(enc.guard);

exports.left = {};

for (var key in enc.left) {
  exports.left[key] = rls(key);
}

exports.right = {};

for (var key in enc.right) {
  exports.right[key] = rls(key);
}

});
require.register("binary/index.js", function(exports, require, module){
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

function replace(pixels) {
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

exports.replace = replace;

function transform(pixels) {
  var grey = greyscale(pixels),
      hist = histogram(grey),
      thr = threshold(hist);

  for (var i = 0; i < grey.length; i++) {
    grey[i] = grey[i] < thr ? 0 : 1;
  }

  return grey;
}

exports.transform = transform;

});
require.register("decoder/index.js", function(exports, require, module){
var signal = require('signal'),
    EAN_13 = require('codes').EAN_13,
    reader = require('reader'),
    binary = require('binary');

exports.decode = function(image) {
  if (!(image instanceof ImageData)) {
    throw new Error('argument is not an instance of ImageData');
  }

  var data = image.data,
      width = image.width,
      height = image.height;

  var rows = [];

  for (var i = 0; i < height; i += 2) {
    var row = data.subarray(4 * i * width, 4 * (i + 1) * width),
        grey = binary.greyscale(row);

    rows.push(grey);
  }

  var bits = signal.process(rows).map(function(n) {
    return n > 0;
  });
  
  var digits = reader.read(bits);

  if (digits != null) {
    var code = EAN_13.decode(digits);

    if (EAN_13.validate(code)) {
      return code;
    } else {
      // console.log('invalid code found', code);
    }
  }

  return null;
};

});
require.register("checker/index.js", function(exports, require, module){
var Emitter = require('emitter'),
    bind = require('bind'),
    decoder = require('decoder');

function Checker(video, rect) {
  this.video = video;
  this.rect = rect;

  this.canvas = document.createElement('canvas');
  this.canvas.width = video.videoWidth;
  this.canvas.height = video.videoHeight;

  this.ctx = this.canvas.getContext('2d');

  this.tick = bind(this, this.tick);
}

Emitter(Checker.prototype);

Checker.prototype.run = function() {
  this.tick();
};

Checker.prototype.tick = function() {
  this.draw();

  this.emit('tick');

  var data = this.getData(),
      code = decoder.decode(data);

  if (code) {
    this.emit('code', code);
  }

  setTimeout(this.tick, 200);
};

Checker.prototype.draw = function() {
  this.ctx.drawImage(this.video, 0, 0);
};

Checker.prototype.getData = function() {
  var r = this.rect;
  return this.ctx.getImageData(r.left, r.top, r.width, r.height);
};

module.exports = Checker;

});
require.register("ui/index.js", function(exports, require, module){
var webcam = require('webcam'),
    Checker = require('checker');

module.exports = UI;

function UI(reader, overlay, logger) {
  this.reader = reader;
  this.overlay = overlay;
  this.logger = logger;
}

UI.prototype.ask = function() {
  var this_ = this;

  function success(video) {
    this_.run(video);
  }

  webcam.record(success);
};

UI.prototype.run = function(video) {
  this.reader.setVideo(video);
  this.overlay.resize(this.reader.getWidth(), this.reader.getHeight());
  this.overlay.show(this.reader.getRect());

  this.reader.run(this.handleCode.bind(this));
};

UI.prototype.handleCode = function(code) {
  this.logger.log(code);
};

});
require.register("ui/overlay.js", function(exports, require, module){
module.exports = Overlay;

function Overlay(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
}

Overlay.prototype = {

  resize: function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  },

  show: function(rect) {
    this.ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
  }

};

});
require.register("ui/reader.js", function(exports, require, module){
var Checker = require('checker');

module.exports = Reader;

function Reader(container) {
  this.container = container;

  this.video = null;
  this.rect = null;
  this.checker = null;
}

Reader.prototype = {

  getVideo: function() {
    return this.video;
  },

  setVideo: function(video) {
    this.video = video;
    this.container.appendChild(video);
  },

  getWidth: function() {
    return this.video.videoWidth;
  },

  getHeight: function() {
    return this.video.videoHeight;
  },

  getRect: function() {
    if (this.rect) {
      return this.rect;
    }

    var rect = {},
        w = this.getWidth(),
        h = this.getHeight();

    rect.width = w * 0.6;
    rect.height = h * 0.2;
    rect.left = (w - rect.width) / 2;
    rect.top = (h - rect.height) / 2;

    return this.rect = rect;
  },

  run: function(onCode) {
    this.checker = new Checker(this.getVideo(), this.getRect());
    this.checker.on('code', onCode);
    this.checker.run();
  }

};

});
require.register("ui/logger.js", function(exports, require, module){
module.exports = Logger;

function Logger(list) {
  this.list = list;
  this.codes = [];
}

Logger.prototype = {

  log: function(code) {
    if (this.codes.indexOf(code) > -1) {
      return;
    }

    var item = this.createItem(code);

    this.codes.push(code);
    this.list.appendChild(item);
  },

  createItem: function(code) {
    var item = document.createElement('li');
    item.innerText = code;

    return item;
  }

};

});







require.alias("miscer-webcam/index.js", "ui/deps/webcam/index.js");
require.alias("miscer-webcam/index.js", "webcam/index.js");

require.alias("checker/index.js", "ui/deps/checker/index.js");
require.alias("checker/index.js", "checker/index.js");
require.alias("component-emitter/index.js", "checker/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-bind/index.js", "checker/deps/bind/index.js");

require.alias("decoder/index.js", "checker/deps/decoder/index.js");
require.alias("signal/index.js", "decoder/deps/signal/index.js");
require.alias("binary/index.js", "signal/deps/binary/index.js");

require.alias("codes/index.js", "decoder/deps/codes/index.js");
require.alias("codes/ean_13.js", "decoder/deps/codes/ean_13.js");

require.alias("reader/index.js", "decoder/deps/reader/index.js");
require.alias("reader/helpers.js", "decoder/deps/reader/helpers.js");
require.alias("reader/run_lengths.js", "decoder/deps/reader/run_lengths.js");
require.alias("codes/index.js", "reader/deps/codes/index.js");
require.alias("codes/ean_13.js", "reader/deps/codes/ean_13.js");

require.alias("binary/index.js", "decoder/deps/binary/index.js");
