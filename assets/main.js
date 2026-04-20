(function () {
  "use strict";

  var ALERT_MSG = {
    tier: function (amt) {
      return (
        "Stripe link for $" + amt + " not yet configured.\n\n" +
        "Open assets/config.js, add the Payment Link URL for STRIPE_TIER_" + amt + ".\n" +
        "See STRIPE_SETUP.md for step-by-step instructions."
      );
    },
    oneTime: (
      "Stripe one-time donation link not yet configured.\n\n" +
      "Open assets/config.js and paste your Payment Link URL into\n" +
      "STRIPE_DONATE_ONE_TIME_URL. See STRIPE_SETUP.md for steps."
    ),
    monthly: (
      "Stripe monthly donation link not yet configured.\n\n" +
      "Open assets/config.js and paste your Payment Link URL into\n" +
      "STRIPE_DONATE_MONTHLY_URL. See STRIPE_SETUP.md for steps."
    )
  };

  function openOrAlert(url, alertMsg) {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert(alertMsg);
    }
  }

  function wireEl(el, url, alertMsg) {
    if (url) {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        alert(alertMsg);
      });
    }
  }

  function bindAll() {
    var cfg = window.AHAVAS_CONFIG || {};

    /* ── Named stripe attributes ─────────────────────────────── */
    document.querySelectorAll("[data-stripe='one-time']").forEach(function (el) {
      wireEl(el, cfg.STRIPE_DONATE_ONE_TIME_URL, ALERT_MSG.oneTime);
    });
    document.querySelectorAll("[data-stripe='monthly']").forEach(function (el) {
      wireEl(el, cfg.STRIPE_DONATE_MONTHLY_URL, ALERT_MSG.monthly);
    });

    /* ── Tier buttons ────────────────────────────────────────── */
    var tierMap = {
      "18":  cfg.STRIPE_TIER_18,
      "36":  cfg.STRIPE_TIER_36,
      "54":  cfg.STRIPE_TIER_54,
      "100": cfg.STRIPE_TIER_100,
      "180": cfg.STRIPE_TIER_180,
      "360": cfg.STRIPE_TIER_360
    };
    Object.keys(tierMap).forEach(function (amt) {
      document.querySelectorAll("[data-tier='" + amt + "']").forEach(function (el) {
        wireEl(el, tierMap[amt], ALERT_MSG.tier(amt));
      });
    });

    /* ── Custom amount form (donate page + home page) ───────── */
    ["custom-amount-form", "home-custom-amount-form"].forEach(function (formId) {
      var form = document.getElementById(formId);
      if (!form) return;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var inputId = formId === "home-custom-amount-form" ? "home-custom-amount-input" : "custom-amount-input";
        var freqName = formId === "home-custom-amount-form" ? "home-custom-freq" : "custom-freq";
        var input = document.getElementById(inputId);
        var val = parseFloat(input ? input.value : "");
        if (!val || val < 1) {
          if (input) input.focus();
          return;
        }
        var freqEl = form.querySelector("input[name='" + freqName + "']:checked");
        var freq = freqEl ? freqEl.value : "one-time";
        if (freq === "monthly") {
          openOrAlert(cfg.STRIPE_DONATE_MONTHLY_URL, ALERT_MSG.monthly);
        } else {
          openOrAlert(cfg.STRIPE_DONATE_ONE_TIME_URL, ALERT_MSG.oneTime);
        }
      });
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

  function bindTabs() {
    var tabs = document.querySelectorAll(".tier-tab");
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = true;
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        var active = document.getElementById(tab.getAttribute("aria-controls"));
        if (active) active.hidden = false;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindAll();
      bindMobileNav();
      markActiveNav();
      bindTabs();
    });
  } else {
    bindAll();
    bindMobileNav();
    markActiveNav();
    bindTabs();
  }
})();
