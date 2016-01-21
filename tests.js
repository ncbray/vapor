define(["vapor/color"], function(color) {
  test("Gamma byte roundtrip", function() {
    for (var i = 0; i < 256; i++) {
      var v = color.byteToLinear(i);
      ok(0 <= v && v <= 1);
      equal(color.linearToByte(v), i);
    }
  });

  test("Linear roundtrip", function() {
    for (var i = 0; i <= 1.0; i += 0.001) {
      var v = color.linearToByte(i);
      ok(0 <= v && v <= 255);
      var mapped = color.byteToLinear(v);
      ok(Math.abs(mapped - i) < 0.005);
    }
  });

  var run = function() {
    QUnit.start();
  };

  return {
    run: run
  };
});