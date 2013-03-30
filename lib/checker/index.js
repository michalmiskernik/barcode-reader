var Emitter = require('emitter'),
    bind = require('bind'),
    decoder = require('decoder');

function Checker(video) {
  this.video = video;

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

  setTimeout(this.tick, 500);
};

Checker.prototype.draw = function() {
  this.ctx.drawImage(this.video, 0, 0);
};

Checker.prototype.getData = function() {
  var width = this.canvas.width,
      height = this.canvas.height;

  return this.ctx.getImageData(0, 0, width, height);
};

module.exports = Checker;
