define([], function() {
  var clamp = function(v, min, max) {
    if (v > min) {
      if (v < max) {
        return v;
      } else {
        return max;
      }
    } else {
      return min;
    }
  };

  var blend = function(x, y, amt) {
    return x * (1 - amt) + y * amt;
  };

  var smoothstep = function(e0, e1, amt) {
    amt = clamp((amt - e0) / (e1 - e0), 0, 1);
    return amt * amt * (3 - 2 * amt);
  };

  var exports = {};
  exports.clamp = clamp;
  exports.blend = blend;
  exports.smoothstep = smoothstep;
  return exports;
});