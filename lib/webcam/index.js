var URL = window.URL || window.webkitURL;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

module.exports = function(opts) {
  var video = document.createElement('video');
  video.autoplay = true;

  video.addEventListener('loadedmetadata', function() {
    opts.success(video);
  });

  getUserMedia.call(navigator, {video: true}, function(stream) {
    video.src = URL.createObjectURL(stream);
  }, opts.fail);
};
