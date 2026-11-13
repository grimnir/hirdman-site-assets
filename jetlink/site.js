(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Office cities [lat, lon], from the footer of the 2025 site.
  var OFFICES = [
    [25.76, -80.19], [33.75, -84.39], [39.74, -104.99], [34.05, -118.24], [42.36, -71.06],
    [39.95, -75.17], [40.71, -74.01], [37.54, -77.44], [40.30, -74.05],
    [49.28, -123.12], [43.65, -79.38],
    [51.51, -0.13], [50.83, 12.92], [38.72, -9.14]
  ];
  // Arcs from the European offices to the US East Coast and Canada.
  var ARCS = [[11, 6], [13, 0], [12, 10], [11, 9]];

  function globe(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var size = 0, dpr = 1;
    var DEG = Math.PI / 180;
    var TILT = 38 * DEG; // centre the view on latitude 38N: every office is between 25N and 52N
    var dots = [];
    var N = 1400;
    for (var i = 0; i < N; i++) { // Fibonacci sphere: an even dot field
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      dots.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    function fromLatLon(lat, lon) {
      var la = lat * DEG, lo = lon * DEG;
      return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
    }
    var offices = OFFICES.map(function (c) { return fromLatLon(c[0], c[1]); });
    function rotate(p, spin) {
      var cs = Math.cos(spin), sn = Math.sin(spin);
      var x = p[0] * cs - p[2] * sn, z = p[0] * sn + p[2] * cs, y = p[1];
      var ct = Math.cos(TILT), st = Math.sin(TILT);
      return [x, y * ct - z * st, y * st + z * ct];
    }
    function slerp(a, b, t) {
      var d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
      var s = Math.sin(d) || 1, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s;
      var lift = 1 + Math.sin(Math.PI * t) * 0.18;
      return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift];
    }
    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.max(1, Math.round(rect.width));
      canvas.width = size * dpr; canvas.height = size * dpr;
    }
    function draw(t) {
      var R = size * 0.42, cx = size / 2, cy = size / 2;
      // The view centre is the longitude `spin`: swing over the Atlantic, from the US west coast to Central Europe.
      var spin = (-55 + Math.sin(t / 9000) * 25) * DEG;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      var halo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.25);
      halo.addColorStop(0, "rgba(0,127,255,0.10)");
      halo.addColorStop(1, "rgba(0,127,255,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);
      for (var i = 0; i < dots.length; i++) {
        var p = rotate(dots[i], spin);
        if (p[2] < -0.05) continue;
        ctx.fillStyle = "rgba(120,170,255," + (0.14 + p[2] * 0.6).toFixed(3) + ")";
        ctx.fillRect(cx + p[0] * R, cy - p[1] * R, 1.6, 1.6);
      }
      ARCS.forEach(function (arc, k) {
        var a = offices[arc[0]], b = offices[arc[1]];
        ctx.beginPath();
        var started = false;
        for (var s = 0; s <= 40; s++) {
          var q = rotate(slerp(a, b, s / 40), spin);
          if (q[2] < 0) { started = false; continue; }
          var x = cx + q[0] * R, y = cy - q[1] * R;
          if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(0,127,255,0.55)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (!reduce) { // one pulse travels each arc
          var u = ((t / 2600) + k * 0.27) % 1, m = rotate(slerp(a, b, u), spin);
          if (m[2] > 0) {
            ctx.fillStyle = "rgba(160,205,255,0.95)";
            ctx.beginPath(); ctx.arc(cx + m[0] * R, cy - m[1] * R, 2.2, 0, 7); ctx.fill();
          }
        }
      });
      offices.forEach(function (o) {
        var p = rotate(o, spin);
        if (p[2] < 0) return;
        var x = cx + p[0] * R, y = cy - p[1] * R;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 14);
        g.addColorStop(0, "rgba(0,127,255,0.55)");
        g.addColorStop(1, "rgba(0,127,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill();
      });
    }
    var visible = true, raf = 0;
    function loop(t) { draw(t); raf = visible && !reduce ? requestAnimationFrame(loop) : 0; }
    resize();
    draw(0);
    window.addEventListener("resize", function () { resize(); draw(performance.now()); });
    if (reduce) return;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      }).observe(canvas);
    } else raf = requestAnimationFrame(loop);
  }

  ready(function () {
    // Footer year follows the clock (the 2025 site still said 2025 in November 2026).
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
    document.querySelectorAll(".jl canvas.globe").forEach(globe);

    var top = document.querySelector(".jl .top");
    if (!top) return;
    var onScroll = function () { top.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // The burger sits before the menu in the DOM, so Tab from it walks into the open menu.
    var burger = top.querySelector(".burger");
    if (!burger) return;
    var setOpen = function (open, restoreFocus) {
      top.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (!open && restoreFocus) burger.focus();
    };
    burger.addEventListener("click", function () { setOpen(!top.classList.contains("open"), false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && top.classList.contains("open")) setOpen(false, true);
    });
    top.addEventListener("click", function (e) {
      if (e.target.closest("a") && top.classList.contains("open")) setOpen(false, false);
    });
    document.addEventListener("click", function (e) {
      if (top.classList.contains("open") && !top.contains(e.target)) setOpen(false, false);
    });
    top.addEventListener("focusout", function (e) {
      if (top.classList.contains("open") && e.relatedTarget && !top.contains(e.relatedTarget)) setOpen(false, false);
    });
  });
})();
