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

  webcam({ success: success });
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
