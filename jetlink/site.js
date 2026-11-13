(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // Footer year follows the clock (the 2025 site still said 2025 in November 2026).
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

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
