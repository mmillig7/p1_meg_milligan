(function () {
  var wrap = document.getElementById('circles-wrap');
  if (!wrap) return;

  var sizes = [90, 115, 140, 165, 190, 215, 240];
  var numCircles = 42;
  var circles = [];
  var cursorX = -1e5;
  var cursorY = -1e5;
  var cursorRadius = 220;
  var cursorStrength = 0.4;
  var floatStrength = 0.05;
  var damp = 0.98;

  function createCircles() {
    var maxSize = Math.max.apply(null, sizes);
    var w = window.innerWidth + maxSize * 1.2;
    var h = window.innerHeight + maxSize * 1.2;
    for (var i = 0; i < numCircles; i++) {
      var size = sizes[Math.floor(Math.random() * sizes.length)];
      var x = -maxSize * 0.5 + Math.random() * w - size / 2;
      var y = -maxSize * 0.5 + Math.random() * h - size / 2;
      var el = document.createElement('div');
      el.className = 'heart' + (Math.random() < 0.4 ? ' heart-magenta' : '');
      el.textContent = '\u2665';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.fontSize = size + 'px';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      var circle = {
        el: el,
        x: x,
        y: y,
        size: size,
        vx: 0,
        vy: 0,
        floatPhase: Math.random() * Math.PI * 2
      };
      circles.push(circle);
      wrap.appendChild(el);
    }
  }

  function distToCursor(c) {
    var cx = c.x + c.size / 2;
    var cy = c.y + c.size / 2;
    return Math.sqrt((cursorX - cx) * (cursorX - cx) + (cursorY - cy) * (cursorY - cy));
  }

  function dist(a, b) {
    var ax = a.x + a.size / 2;
    var ay = a.y + a.size / 2;
    var bx = b.x + b.size / 2;
    var by = b.y + b.size / 2;
    return Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
  }

  function hitTest(c, x, y) {
    var cx = c.x + c.size / 2;
    var cy = c.y + c.size / 2;
    var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
    return d <= c.size / 2 + 20;
  }

  function getClientPos(e) {
    if (e.touches && e.touches.length) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function tick() {
    var t = Date.now() * 0.001;
    for (var i = 0; i < circles.length; i++) {
      var c = circles[i];
      var cx = c.x + c.size / 2;
      var cy = c.y + c.size / 2;

      // Gentle floating drift (slight random-looking motion)
      c.floatPhase += 0.02;
      c.vx += Math.sin(t + c.floatPhase) * floatStrength;
      c.vy += Math.cos(t * 0.7 + c.floatPhase * 1.3) * floatStrength;

      // Cursor repulsion: when cursor is near, push circle away
      var d = distToCursor(c);
      if (d < cursorRadius && d > 2) {
        var dx = cx - cursorX;
        var dy = cy - cursorY;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = (1 - d / cursorRadius) * cursorStrength;
        c.vx += (dx / len) * force;
        c.vy += (dy / len) * force;
      }

      c.x += c.vx;
      c.y += c.vy;
      c.vx *= damp;
      c.vy *= damp;

      c.el.style.left = c.x + 'px';
      c.el.style.top = c.y + 'px';
    }
    requestAnimationFrame(tick);
  }

  function interact(centerCircle, clientX, clientY) {
    var push = 2;
    var dx = clientX - (centerCircle.x + centerCircle.size / 2);
    var dy = clientY - (centerCircle.y + centerCircle.size / 2);
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    centerCircle.vx += (dx / len) * push;
    centerCircle.vy += (dy / len) * push;

    for (var j = 0; j < circles.length; j++) {
      var c = circles[j];
      if (c === centerCircle) continue;
      var d = dist(centerCircle, c);
      if (d < centerCircle.size / 2 + c.size / 2 + 80) {
        var cx = centerCircle.x + centerCircle.size / 2;
        var cy = centerCircle.y + centerCircle.size / 2;
        var cx2 = c.x + c.size / 2;
        var cy2 = c.y + c.size / 2;
        var ndx = cx2 - cx;
        var ndy = cy2 - cy;
        var nlen = Math.sqrt(ndx * ndx + ndy * ndy) || 1;
        var strength = 1 * (1 - d / (centerCircle.size / 2 + c.size / 2 + 80));
        c.vx += (ndx / nlen) * strength;
        c.vy += (ndy / nlen) * strength;
      }
    }
  }

  function onPointerDown(e) {
    var pos = getClientPos(e);
    for (var i = 0; i < circles.length; i++) {
      if (hitTest(circles[i], pos.x, pos.y)) {
        e.preventDefault();
        interact(circles[i], pos.x, pos.y);
        return;
      }
    }
  }

  function onPointerMove(e) {
    var pos = getClientPos(e);
    cursorX = pos.x;
    cursorY = pos.y;
  }

  function onPointerLeave() {
    cursorX = -1e5;
    cursorY = -1e5;
  }

  createCircles();
  requestAnimationFrame(tick);

  wrap.addEventListener('mousedown', onPointerDown);
  wrap.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('mouseleave', onPointerLeave);
})();
