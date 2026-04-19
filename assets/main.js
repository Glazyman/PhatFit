(function () {
  "use strict";

  function bindDonationButtons() {
    var cfg = window.AHAVAS_CONFIG || {};
    var oneTime = cfg.STRIPE_DONATE_ONE_TIME_URL || "";
    var monthly = cfg.STRIPE_DONATE_MONTHLY_URL || "";

    document.querySelectorAll("[data-stripe='one-time']").forEach(function (el) {
      if (oneTime) {
        el.setAttribute("href", oneTime);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          alert(
            "Stripe one-time donation link not yet configured.\n\n" +
            "Open assets/config.js and paste your Payment Link URL into\n" +
            "STRIPE_DONATE_ONE_TIME_URL. See STRIPE_SETUP.md for steps."
          );
        });
      }
    });

    document.querySelectorAll("[data-stripe='monthly']").forEach(function (el) {
      if (monthly) {
        el.setAttribute("href", monthly);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          alert(
            "Stripe monthly donation link not yet configured.\n\n" +
            "Open assets/config.js and paste your Payment Link URL into\n" +
            "STRIPE_DONATE_MONTHLY_URL. See STRIPE_SETUP.md for steps."
          );
        });
      }
    });
  }

  function bindMobileNav() {
    var btn = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-links");
    if (!btn || !menu) return;
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function markActiveNav() {
    var path = window.location.pathname.replace(/\/$/, "") || "/";
    var file = path.split("/").pop() || "index.html";
    if (file === "" || path === "/") file = "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (
        href === file ||
        (file === "index.html" && (href === "/" || href === "index.html"))
      ) {
        a.classList.add("is-active");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindDonationButtons();
      bindMobileNav();
      markActiveNav();
    });
  } else {
    bindDonationButtons();
    bindMobileNav();
    markActiveNav();
  }
})();
