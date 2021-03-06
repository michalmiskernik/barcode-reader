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
