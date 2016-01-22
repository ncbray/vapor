define(["vapor/application", "vapor/color", "vapor/math", "vapor/wigits"], function(app, color, math, wigits) {

  var shadeImage = function(shader, img) {
    var out = new Uint32Array(img.data.buffer);
    var state = {};
    var w = img.width;
    var h = img.height;
    var state = {};
    for (var j = 0; j < h; j++) {
      state.py = j;
      state.y = j / h;
      for (var i = 0; i < w; i++) {
        state.px = i;
        state.x = i / w;
        state.r = 0;
        state.g = 0;
        state.b = 0;
        state.a = 1;
        shader(state);
        out[i + j * w] = color.linearColorToInt(state.r, state.g, state.b, state.a);
      }
    }
  };

  var Example = function(maincanvas, perfcanvas) {
    this.canvas = new app.Canvas2D(maincanvas, maincanvas.width, maincanvas.height, "green");
    this.phase = 0;
    this.drawTracker = new wigits.PerfTracker(
      "draw",
      perfcanvas,
      perfcanvas.width,
      perfcanvas.height
    );
    this.createTestImage();
  };

  Example.prototype.createTestImage = function() {
    this.img = this.canvas.ctx.createImageData(128, 128);
    shadeImage(function(state) {
      var cx = state.x * 2 - 1;
      var cy = state.y * 2 - 1;
      var rsq = cx * cx + cy * cy;
      state.a = math.smoothstep(1.0, 0.95, rsq);
      if (state.a <= 0) {
        return;
      }
      if ((state.px + state.py) % 2) {
          state.r = 1;
      }
      state.g = state.x;
      state.b = state.y;
    }, this.img);
  };

  Example.prototype.frame = function(dt) {
    this.phase += dt;
    this.phase %= Math.PI * 2;

    this.drawTracker.begin();
    this.draw();
    this.drawTracker.end();
    this.drawTracker.draw();
  };

  Example.prototype.draw = function() {

    var ctx = this.canvas.beginDrawing();

    // Draw a fake 3D tube.
    var x = Math.cos(this.phase);
    var y = Math.sin(this.phase);
    ctx.lineWidth = 2;
    for (var i = 0; i < 30; i++) {
	var scale = (1 + i) / 20;
	ctx.strokeRect(320 + (x - 1) * scale * 100, 240 + (y - 1) * scale * 100, 200 * scale, 200 * scale);
    }
    ctx.putImageData(this.img, 0, 0);
  };

  var run = function(maincanvas, perfcanvas) {
    var example = new Example(maincanvas, perfcanvas);
    var pump = new app.AnimationPump();
    pump.onFrame(function(dt) {
      example.frame(dt);
    }).scheduleFrame();
  };

  return {
    run: run
  };
});