(function () {
  "use strict";

  /* ── Config ──────────────────────────────────────────────── */
  var ADMIN_PASSWORD   = "ahavas2026"; // change before launch
  var STORAGE_KEY      = "chaiwin_entries";
  var FORMSUBMIT_EMAIL = "info@ahavaschaya.com";

  /* ── State ───────────────────────────────────────────────── */
  var selectedTier = null; // { tier, price, entries, label, monthly }

  /* ── Countdown ───────────────────────────────────────────── */
  function getDrawDate() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + 1, 0, 23, 59, 59);
  }

  function updateCountdown() {
    var diff  = Math.max(0, getDrawDate() - new Date());
    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000)  / 60000);
    var secs  = Math.floor((diff % 60000)    / 1000);
    function pad(n) { return String(n).padStart(2, "0"); }
    var g = function(id) { return document.getElementById(id); };
    if (g("cd-days"))  g("cd-days").textContent  = pad(days);
    if (g("cd-hours")) g("cd-hours").textContent = pad(hours);
    if (g("cd-mins"))  g("cd-mins").textContent  = pad(mins);
    if (g("cd-secs"))  g("cd-secs").textContent  = pad(secs);
  }

  /* ── Hero prize buttons → scroll to enter ───────────────── */
  function bindHeroButtons() {
    var allHeroBtns = document.querySelectorAll("[data-goto-wig], [data-goto-item]");
    allHeroBtns.forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        scrollToEnter();
      });
    });
  }

  function scrollToEnter() {
    var s = document.getElementById("enter");
    if (s) setTimeout(function() { s.scrollIntoView({ behavior: "smooth" }); }, 50);
  }

  /* ── Single / Monthly toggle ─────────────────────────────── */
  function bindFreqTabs() {
    var tabSingle  = document.getElementById("re-tab-single");
    var tabMonthly = document.getElementById("re-tab-monthly");
    var panelSingle  = document.getElementById("re-panel-single");
    var panelMonthly = document.getElementById("re-panel-monthly");
    if (!tabSingle) return;

    function showSingle() {
      tabSingle.classList.add("is-active");     tabSingle.setAttribute("aria-selected", "true");
      tabMonthly.classList.remove("is-active"); tabMonthly.setAttribute("aria-selected", "false");
      panelSingle.style.display  = "grid";
      panelMonthly.style.display = "none";
      selectedTier = null;
      hideForm();
    }
    function showMonthly() {
      tabMonthly.classList.add("is-active");   tabMonthly.setAttribute("aria-selected", "true");
      tabSingle.classList.remove("is-active"); tabSingle.setAttribute("aria-selected", "false");
      panelMonthly.style.display = "grid";
      panelSingle.style.display  = "none";
      selectedTier = null;
      hideForm();
    }
    tabSingle.addEventListener("click", showSingle);
    tabMonthly.addEventListener("click", showMonthly);
  }

  /* ── Donate buttons on tier cards ───────────────────────── */
  function bindTierCards() {
    document.querySelectorAll(".re-tier-card").forEach(function(card) {
      var btn = card.querySelector(".re-tier-btn");
      if (!btn) return;
      btn.addEventListener("click", function() {
        selectedTier = {
          tier:    card.dataset.tier,
          price:   card.dataset.price,
          entries: card.dataset.entries,
          label:   card.dataset.label,
          monthly: card.dataset.monthly === "true"
        };
        updateSummary();
        showForm();
      });
    });
  }

  function hideForm() {
    var wrap = document.getElementById("raffle-form-wrap");
    if (wrap) wrap.style.display = "none";
  }
  function showForm() {
    var wrap = document.getElementById("raffle-form-wrap");
    if (wrap) { wrap.style.display = "block"; wrap.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
  }

  /* ── Summary line ────────────────────────────────────────── */
  function updateSummary() {
    var el       = document.getElementById("raffle-summary");
    var btnLabel = document.getElementById("raffle-submit-label");
    if (!selectedTier || !el) return;
    el.textContent = selectedTier.label;
    if (btnLabel) {
      btnLabel.textContent = selectedTier.monthly ? "Subscribe & Enter" : "Donate & Enter";
    }
  }

  /* ── Form validation & submit ────────────────────────────── */
  function bindForm() {
    var form = document.getElementById("raffle-form");
    if (!form) return;

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var errorEl  = document.getElementById("raffle-error");
      var submitBtn = document.getElementById("raffle-submit");
      var submitLbl = document.getElementById("raffle-submit-label");
      errorEl.textContent = "";

      var first   = document.getElementById("rf-first");
      var last    = document.getElementById("rf-last");
      var email   = document.getElementById("rf-email");
      var phone   = document.getElementById("rf-phone");
      var terms   = document.getElementById("rf-terms");

      [first, last, email].forEach(function(f) { f.classList.remove("is-error"); });
      if (!first.value.trim()) { first.classList.add("is-error"); first.focus(); errorEl.textContent = "Please enter your first name."; return; }
      if (!last.value.trim())  { last.classList.add("is-error");  last.focus();  errorEl.textContent = "Please enter your last name."; return; }
      if (!email.value.trim() || !email.value.includes("@")) { email.classList.add("is-error"); email.focus(); errorEl.textContent = "Please enter a valid email address."; return; }
      if (!terms.checked)    { errorEl.textContent = "Please agree to the Terms & Conditions to continue."; return; }
      if (!selectedTier)     { errorEl.textContent = "Please select a donation option above."; return; }

      var isMonthly = selectedTier.monthly;
      var now       = new Date();
      var monthStr  = now.toLocaleString("default", { month: "long", year: "numeric" });

      var entry = {
        first:    first.value.trim(),
        last:     last.value.trim(),
        email:    email.value.trim(),
        phone:    phone.value.trim() || "—",
        giveaway: "Chai & Win Drawing",
        entries:  selectedTier.entries,
        type:     isMonthly ? "Monthly" : "One-time",
        price:    "$" + selectedTier.price + (isMonthly ? "/mo" : ""),
        month:    monthStr,
        ts:       now.toISOString()
      };

      saveEntry(entry);
      submitBtn.disabled   = true;
      submitLbl.textContent = "Saving your entry…";

      fetch("https://formsubmit.co/ajax/" + FORMSUBMIT_EMAIL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject:  "🎟 New Chai & Win Entry — " + entry.entries + " " + (entry.entries === "1" ? "entry" : "entries") + " — " + monthStr,
          Name:      entry.first + " " + entry.last,
          Email:     entry.email,
          Phone:     entry.phone,
          Giveaway:  entry.giveaway,
          Entries:   entry.entries,
          Type:      entry.type,
          Amount:    entry.price,
          Month:     entry.month,
          Submitted: entry.ts,
          _template: "table"
        })
      })
      .then(function(res) { return res.json(); })
      .catch(function()   { return { success: false }; })
      .finally(function() {
        goToStripe(isMonthly, submitBtn, submitLbl);
      });
    });
  }

  function goToStripe(isMonthly, btn, label) {
    var cfg     = window.AHAVAS_CONFIG || {};
    var tierVal = selectedTier ? selectedTier.tier : null; // e.g. "wig-single-5"

    var tiers = cfg.STRIPE_RAFFLE_TIERS || {};
    var url   = (tierVal && tiers[tierVal]) ||
                (isMonthly
                  ? (cfg.STRIPE_RAFFLE_MONTHLY_URL || cfg.STRIPE_DONATE_MONTHLY_URL)
                  : (cfg.STRIPE_RAFFLE_ONETIME_URL  || cfg.STRIPE_DONATE_ONE_TIME_URL));

    if (url) {
      label.textContent = "Redirecting to checkout…";
      setTimeout(function() { window.location.href = url; }, 400);
    } else {
      btn.disabled = false;
      label.textContent = "Proceed to Checkout";
      document.getElementById("raffle-error").textContent =
        "Stripe is not configured yet. Open assets/config.js and add the raffle Stripe URLs. Your entry has been saved.";
    }
  }

  /* ── Entry storage ───────────────────────────────────────── */
  function saveEntry(entry) {
    var all = getEntries();
    all.push(entry);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch(e) {}
  }

  function getEntries() {
    try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; }
    catch(e) { return []; }
  }

  /* ── Admin panel ─────────────────────────────────────────── */
  function showAdminPanel() {
    var s = document.getElementById("raffle-admin");
    if (s) { s.style.display = "block"; s.removeAttribute("aria-hidden"); s.scrollIntoView({ behavior: "smooth" }); }
  }

  window.checkAdminPw = function() {
    var pw  = document.getElementById("admin-pw");
    var err = document.getElementById("admin-pw-error");
    if (!pw) return;
    if (pw.value === ADMIN_PASSWORD) {
      document.getElementById("admin-login").style.display = "none";
      document.getElementById("admin-panel").style.display = "block";
      renderAdminTable();
    } else {
      err.textContent = "Incorrect password.";
      pw.value = "";
      pw.focus();
    }
  };

  window.clearEntries = function() {
    if (!confirm("Clear ALL stored entries? This cannot be undone.")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    renderAdminTable();
  };

  function renderAdminTable() {
    var entries = getEntries();
    var tbody   = document.getElementById("admin-tbody");
    var stats   = document.getElementById("admin-stats");
    var title   = document.getElementById("admin-month-title");
    if (!tbody) return;

    var now       = new Date();
    var monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
    if (title) title.textContent = "Entries — " + monthName;

    var totalEntries = entries.reduce(function(s, e) { return s + parseInt(e.entries || 0); }, 0);
    var monthlyCount = entries.filter(function(e) { return e.type === "Monthly"; }).length;
    var wigCount     = entries.filter(function(e) { return (e.giveaway || "").includes("Wig"); }).length;
    if (stats) {
      stats.innerHTML =
        stat(entries.length, "Total Donors") +
        stat(totalEntries,   "Total Entries") +
        stat(monthlyCount,   "Monthly") +
        stat(wigCount,       "Wig Drawing");
    }

    if (entries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:32px; color:var(--ink-400);">No entries yet this month.</td></tr>';
      return;
    }
    tbody.innerHTML = entries.map(function(e, i) {
      var date = e.ts ? new Date(e.ts).toLocaleString() : "—";
      return "<tr>" +
        "<td>" + (i + 1) + "</td>" +
        "<td><strong>" + esc(e.first) + " " + esc(e.last) + "</strong></td>" +
        "<td>" + esc(e.email) + "</td>" +
        "<td>" + esc(e.phone || "—") + "</td>" +
        "<td>" + esc(e.giveaway || "—") + "</td>" +
        "<td><span class='raffle-entry-badge'>" + esc(e.entries) + "</span></td>" +
        "<td>" + (e.type === "Monthly"
          ? "<span class='raffle-monthly-badge'>Monthly</span>"
          : "<span style='font-size:0.8rem;color:var(--ink-500);'>One-time</span>") + "</td>" +
        "<td>" + esc(e.price) + "</td>" +
        "<td style='color:var(--ink-400);font-size:0.8rem;'>" + date + "</td>" +
        "</tr>";
    }).join("");
  }

  function stat(val, label) {
    return "<div class='raffle-admin-stat'><strong>" + val + "</strong><span>" + label + "</span></div>";
  }

  function esc(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ── CSV download ────────────────────────────────────────── */
  window.downloadCSV = function() {
    var entries   = getEntries();
    var now       = new Date();
    var monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
    var header    = ["#", "First Name", "Last Name", "Email", "Phone", "Giveaway", "Entries", "Type", "Amount", "Submitted"];
    var rows = entries.map(function(e, i) {
      return [
        i + 1, e.first, e.last, e.email, e.phone || "",
        e.giveaway || "", e.entries, e.type, e.price,
        e.ts ? new Date(e.ts).toLocaleString() : ""
      ].map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(",");
    });
    var csv  = [header.map(function(h) { return '"' + h + '"'; }).join(",")].concat(rows).join("\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement("a");
    a.href = url;
    a.download = "ChaiWin-Entries-" + monthName.replace(/\s/g, "-") + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ── Init ────────────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
  }

  function init() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    bindHeroButtons();
    bindFreqTabs();
    bindTierCards();
    bindForm();
    hideForm();
    initReveal();
    if (window.location.search.includes("admin=1")) showAdminPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
