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
