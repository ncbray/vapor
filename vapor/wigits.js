define(["vapor/application"], function(app) {
  var getTime = function() { return Date.now(); };
  if (typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") {
    getTime = function() { return performance.now(); };
  }

  var PerfTracker = function(label, canvas, w, h) {
    this.canvas = new app.Canvas2D(canvas, w, h, "black");

    this.samples = [];
    this.padding = 2;
    this.maxSamples = w - 2 * this.padding;

    this.label = label;
    this.current = 0;
    this.accum = 0;

    this.draw();
  };

  PerfTracker.prototype.begin = function() {
    this.start = getTime();
  };

  PerfTracker.prototype.end = function() {
    var dt = getTime()-this.start;
    if (dt < 0) {
      dt = 0;
    }
    this.addSample(dt);
  };

  PerfTracker.prototype.beginSlice = function() {
    this.start = getTime();
  };

  PerfTracker.prototype.endSlice = function() {
    var dt = getTime()-this.start;
    if (dt < 0) {
      dt = 0;
    }
    this.accum += dt;
  };

  PerfTracker.prototype.commit = function() {
    this.addSample(this.accum);
    this.accum = 0;
  };

  PerfTracker.prototype.addSample = function(dt) {
    while (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
    this.samples.push(dt);
    var sum = 0;
    for (var i = 0; i < this.samples.length; i++) {
      sum += this.samples[i];
    }
    this.current = sum / this.samples.length;
    this.draw();
  };

  PerfTracker.prototype.draw = function() {
    var ctx = this.canvas.beginDrawing();
    var w = this.canvas.width;
    var h = this.canvas.height;
      this.drawOnto(ctx, 0, 0, w, h);
  };

  PerfTracker.prototype.drawOnto = function(ctx, x, y, w, h) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "gray";
    ctx.strokeRect(x+1, y+1, w-2, h-2);

    ctx.fillStyle = "green";

    var shift = this.padding + this.maxSamples - this.samples.length + 1;

    ctx.beginPath();
    ctx.moveTo(x + shift, y + h - this.padding);

    var scale = h - 2 * this.padding;

    for (var i = 0; i < this.samples.length; i++) {
      var amt = this.samples[i] / (2 * this.current);
      ctx.lineTo(x + i + shift, y + h - this.padding - amt * scale);
    }
    ctx.lineTo(x + w - this.padding, y + h - this.padding);
    ctx.closePath;
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "12px monospace";
    ctx.fillText(this.current.toPrecision(3) + " ms", x + this.padding, y + 10 + this.padding);

    ctx.fillText(this.label, x + w - this.padding - ctx.measureText(this.label).width - 2, y + 10 + this.padding);
  };

  return {
      PerfTracker: PerfTracker
  };
});