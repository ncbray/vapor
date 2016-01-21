define(["vapor/math"], function(math) {
  // sRGB
  var linearToGamma = function(v) {
    if (v > 0.0031308) {
      return 1.055 * Math.pow(v, 0.41666666666667) - 0.055;
    } else {
      return 12.92 * v;
    }
  };

  // sRGB
  var gammaToLinear = function(v) {
    if (v > 0.04045) {
      return Math.pow((v + 0.055) / 1.055, 2.4);
    } else {
      return v / 12.92;
    }
  };

  // Build a lookup table.
  var l2g = new Uint8Array(4096);
  for (var i = 0; i < 4096; i++) {
    l2g[i] = math.clamp(Math.round(linearToGamma(i / 4095) * 255), 0, 255);
  }

  var linearToByte = function(v) {
    var index = Math.round(v * 4095);
    if (index > 4095) {
      return 255;
    } else if (index < 0) {
      return 0;
    } else {
      return l2g[index];
    }
  };

  // Build a lookup table.
  var g2l = new Float32Array(256);
  for (var i = 0; i < 256; i++) {
    g2l[i] = gammaToLinear(i / 255);
  }

  var byteToLinear = function(v) {
    if (v > 255) {
      return 1;
    } else if (v < 0) {
      return 0;
    } else {
      return g2l[v];
    }
  };

  var byteColorToInt = function(r, g, b) {
    return r | g << 8 | b << 16 | 255 << 24;
  };

  var exports = {};
  exports.linearToGamma = linearToGamma;
  exports.gammaToLinear = gammaToLinear;
  exports.linearToByte = linearToByte;
  exports.byteToLinear = byteToLinear;
  exports.byteColorToInt = byteColorToInt;
  return exports;
});