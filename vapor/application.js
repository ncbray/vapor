define(["vapor/math"], function(math) {
  var makePump = function(runner) {
    return function() {
      runner.doFrame();
    }
  };

  var AnimationPump = function() {
    this.pump = makePump(this);
    this.maxDelta(0.25).autoPump(true);
    this.pendingFrame = 0;
  };

  AnimationPump.prototype.autoPump = function(ok) {
    this.autoPump_ = !!ok;
    return this;
  };

  AnimationPump.prototype.maxDelta = function(amt) {
    this.maxDelta_ = +amt;
    return this;
  };

  AnimationPump.prototype.onFrame = function(callback) {
    this.frameCallback = callback;
    return this;
  }

  AnimationPump.prototype.scheduleFrame = function() {
    if (this.pendingFrame) {
      cancelRequestAnimationFrame(this.pendingFrame);
    }
    this.pendingFrame = requestAnimationFrame(this.pump);
  };

  AnimationPump.prototype.doFrame = function() {
    this.pendingFrame = 0;
    if (this.autoPump_) {
      this.scheduleFrame();
    }

    // Calculate the elapsed time.
    var current = performance.now();
    if (this.last == undefined) {
      this.last = current;
    }
    var dt = (current - this.last) / 1000;
    this.last = current;

    dt = math.clamp(dt, 0, this.maxDelta_);

    this.frameCallback(dt);
  };

  var Canvas2D = function(canvas, width, height, bgcolor) {
    this.canvas = canvas;
    this.width = +width;
    this.height = +height;

    this.ctx = this.canvas.getContext('2d');

    canvas.style.width = this.width + 'px';
    canvas.style.height = this.height + 'px';
    canvas.style.backgroundColor = bgcolor;
  };

  Canvas2D.prototype.adjustHighDPI = function(ctx) {
    // TODO polyfill fallbacks
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.backingStorePixelRatio || 1;

    var ratio = devicePixelRatio / backingStoreRatio;
    var w = Math.ceil(this.width * ratio);
    var h = Math.ceil(this.height * ratio);

    if (this.canvas.width != w) {
      this.canvas.width = w;
    }
    if (this.canvas.height != h) {
      this.canvas.height = h;
    }
    ctx.resetTransform();
    ctx.scale(ratio, ratio);
  };

  Canvas2D.prototype.beginDrawing = function() {
    this.adjustHighDPI(this.ctx); // This window could have moved between monitors.
    this.ctx.clearRect(0, 0, this.width, this.height);
    return this.ctx;
  };

  return {
    AnimationPump: AnimationPump,
    Canvas2D: Canvas2D
  };
});