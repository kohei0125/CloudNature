(function () {
  "use strict";

  /* 固定ヘッダー: スクロール後に境界線と影を表示（スクロールエッジ） */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* 流入計測: URLのUTMパラメータと参照元をフォームのhiddenへ引き継ぐ */
  try {
    var params = new URLSearchParams(window.location.search);
    var utmMap = {
      utm_source: "utm_source",
      utm_medium: "utm_medium",
      utm_campaign: "utm_campaign"
    };
    Object.keys(utmMap).forEach(function (key) {
      var field = document.getElementById(utmMap[key]);
      if (field && params.get(key)) field.value = params.get(key);
    });
    var referrerField = document.getElementById("page_referrer");
    if (referrerField) referrerField.value = document.referrer || "";
  } catch (e) {
    /* URLSearchParams非対応環境では計測をスキップ */
  }

  /* スクロール出現（reduced-motion時・IntersectionObserver非対応時は静的表示のまま） */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var groupSelectors = [
    ".problem .card-grid > *",
    ".features__grid > *",
    ".comparison__grid > *",
    ".agenda__grid > *",
    ".talks > *",
    ".speaker__panel",
    ".application__grid > *",
    ".closing__inner > *"
  ];

  var targets = [];

  groupSelectors.forEach(function (selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add("reveal");
      els[i].style.transitionDelay = i * 70 + "ms";
      targets.push(els[i]);
    }
  });

  document.querySelectorAll("main .section-title").forEach(function (el) {
    el.classList.add("reveal");
    targets.push(el);
  });

  var marker = document.querySelector(".marker");
  if (marker) marker.classList.add("marker-init");

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );

  targets.forEach(function (t) {
    io.observe(t);
  });
})();
