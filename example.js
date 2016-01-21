define(["vapor/application"], function(app) {

  var Example = function(canvas) {
    this.canvas = new app.Canvas2D(canvas, canvas.width, canvas.height, "green");
    this.phase = 0;
  };

  Example.prototype.frame = function(dt) {
    this.phase += dt;
    this.phase %= Math.PI * 2;
    this.draw();
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

  var run = function(canvas) {
    var example = new Example(canvas);
    var pump = new app.AnimationPump();
    pump.onFrame(function(dt) {
      example.frame(dt);
    }).scheduleFrame();
  };

  return {
    run: run
  };
});