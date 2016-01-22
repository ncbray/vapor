define(["vapor/application", "vapor/wigits"], function(app, wigits) {

  var Example = function(maincanvas, perfcanvas) {
    this.canvas = new app.Canvas2D(maincanvas, maincanvas.width, maincanvas.height, "green");
    this.phase = 0;
    this.drawTracker = new wigits.PerfTracker(
      "draw",
      perfcanvas,
      perfcanvas.width,
      perfcanvas.height
    );
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