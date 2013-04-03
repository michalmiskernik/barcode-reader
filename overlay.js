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
