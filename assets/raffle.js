(function () {
  "use strict";

  /* ── Config ──────────────────────────────────────────────── */
  var ADMIN_PASSWORD = "ahavas2026"; // change this!
  var STORAGE_KEY    = "chaiwin_entries";

  // ↓ STEP 1: Replace with your email to receive entry notifications
  // FormSubmit is free — first submission will send you a confirmation email to activate
  var FORMSUBMIT_EMAIL = "info@ahavaschaya.com";

  /* ── Countdown ───────────────────────────────────────────── */
  function getDrawDate() {
    var now = new Date();
    var year  = now.getFullYear();
    var month = now.getMonth();
    // Last day of current month
    var d = new Date(year, month + 1, 0, 23, 59, 59);
    return d;
  }

  function updateCountdown() {
    var target = getDrawDate();
    var now    = new Date();
    var diff   = target - now;

    if (diff <= 0) diff = 0;

    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000)  / 60000);
    var secs  = Math.floor((diff % 60000)    / 1000);

    function pad(n) { return String(n).padStart(2, "0"); }
    var dEl = document.getElementById("cd-days");
    var hEl = document.getElementById("cd-hours");
    var mEl = document.getElementById("cd-mins");
    var sEl = document.getElementById("cd-secs");
    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }

  /* ── Raffle Tabs ─────────────────────────────────────────── */
  function bindRaffleTabs() {
    var btnOnetime = document.getElementById("raffle-tab-onetime");
    var btnMonthly = document.getElementById("raffle-tab-monthly");
    var panelOt    = document.getElementById("raffle-panel-onetime");
    var panelMo    = document.getElementById("raffle-panel-monthly");
    if (!btnOnetime || !btnMonthly) return;

    function activateTab(activeBtn, inactiveBtn, showPanel, hidePanel) {
      activeBtn.classList.add("is-active");
      activeBtn.setAttribute("aria-selected", "true");
      inactiveBtn.classList.remove("is-active");
      inactiveBtn.setAttribute("aria-selected", "false");
      showPanel.hidden = false;
      hidePanel.hidden = true;
      // Uncheck hidden radios, auto-select popular in shown panel
      hidePanel.querySelectorAll("input[type='radio']").forEach(function(r) { r.checked = false; });
      var popular = showPanel.querySelector(".raffle-tier-card.is-popular input[type='radio']");
      var first   = showPanel.querySelector("input[type='radio']");
      if (popular) popular.checked = true;
      else if (first) first.checked = true;
      updateSummary();
    }

    btnOnetime.addEventListener("click", function() {
      activateTab(btnOnetime, btnMonthly, panelOt, panelMo);
    });
    btnMonthly.addEventListener("click", function() {
      activateTab(btnMonthly, btnOnetime, panelMo, panelOt);
    });
  }

  /* ── Summary Line ────────────────────────────────────────── */
  function updateSummary() {
    var checked = document.querySelector("input[name='raffle-tier']:checked");
    var el = document.getElementById("raffle-summary");
    var submitLabel = document.getElementById("raffle-submit-label");
    if (!el || !checked) return;
    var entries = checked.dataset.entries;
    var price   = checked.dataset.price;
    var monthly = checked.dataset.monthly === "true";
    var label   = monthly
      ? entries + " " + (entries === "1" ? "entry" : "entries") + "/month · $" + price + "/mo"
      : entries + " " + (entries === "1" ? "entry" : "entries") + " · $" + price + " one-time";
    el.textContent = label;
    if (submitLabel) {
      submitLabel.textContent = monthly ? "Subscribe & Enter" : "Donate & Enter";
    }
  }

  function bindTierChange() {
    document.addEventListener("change", function(e) {
      if (e.target && e.target.name === "raffle-tier") {
        updateSummary();
      }
    });
  }

  /* ── Form Validation & Submit ────────────────────────────── */
  function bindForm() {
    var form = document.getElementById("raffle-form");
    if (!form) return;

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var errorEl  = document.getElementById("raffle-error");
      var submitBtn = document.getElementById("raffle-submit");
      var submitLabel = document.getElementById("raffle-submit-label");
      errorEl.textContent = "";

      var first   = document.getElementById("rf-first");
      var last    = document.getElementById("rf-last");
      var email   = document.getElementById("rf-email");
      var phone   = document.getElementById("rf-phone");
      var terms   = document.getElementById("rf-terms");
      var checked = document.querySelector("input[name='raffle-tier']:checked");

      // Validate
      [first, last, email].forEach(function(f) { f.classList.remove("is-error"); });
      if (!first.value.trim())  { first.classList.add("is-error"); first.focus(); errorEl.textContent = "Please enter your first name."; return; }
      if (!last.value.trim())   { last.classList.add("is-error");  last.focus();  errorEl.textContent = "Please enter your last name."; return; }
      if (!email.value.trim() || !email.value.includes("@")) { email.classList.add("is-error"); email.focus(); errorEl.textContent = "Please enter a valid email address."; return; }
      if (!terms.checked)  { errorEl.textContent = "Please agree to the Terms & Conditions to continue."; return; }
      if (!checked)        { errorEl.textContent = "Please select an entry option above."; return; }

      var isMonthly = checked.dataset.monthly === "true";
      var now       = new Date();
      var monthStr  = now.toLocaleString("default", { month: "long", year: "numeric" });

      var entry = {
        first:   first.value.trim(),
        last:    last.value.trim(),
        email:   email.value.trim(),
        phone:   phone.value.trim() || "—",
        entries: checked.dataset.entries,
        type:    isMonthly ? "Monthly" : "One-time",
        price:   "$" + checked.dataset.price + (isMonthly ? "/mo" : ""),
        month:   monthStr,
        ts:      now.toISOString()
      };

      // Save locally (admin download backup)
      saveEntry(entry);

      // Disable button while submitting
      submitBtn.disabled = true;
      submitLabel.textContent = "Saving your entry…";

      // Send entry data to FormSubmit (free email endpoint — no backend needed)
      // The first time you submit, FormSubmit will send an activation email to FORMSUBMIT_EMAIL
      fetch("https://formsubmit.co/ajax/" + FORMSUBMIT_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject:       "🎟 New Chai & Win Entry — " + monthStr,
          Name:           entry.first + " " + entry.last,
          Email:          entry.email,
          Phone:          entry.phone,
          Entries:        entry.entries,
          Type:           entry.type,
          Amount:         entry.price,
          Month:          entry.month,
          Submitted:      entry.ts,
          _template:      "table"
        })
      })
      .then(function(res) { return res.json(); })
      .catch(function() { return { success: false }; })
      .finally(function() {
        // Always go to Stripe regardless of email success
        goToStripe(isMonthly, submitBtn, submitLabel);
      });
    });
  }

  function goToStripe(isMonthly, btn, label) {
    var cfg = window.AHAVAS_CONFIG || {};
    var url = isMonthly ? cfg.STRIPE_RAFFLE_MONTHLY_URL || cfg.STRIPE_DONATE_MONTHLY_URL
                        : cfg.STRIPE_RAFFLE_ONETIME_URL || cfg.STRIPE_DONATE_ONE_TIME_URL;

    if (url) {
      label.textContent = "Redirecting to checkout…";
      setTimeout(function() { window.location.href = url; }, 400);
    } else {
      btn.disabled = false;
      label.textContent = "Proceed to Checkout";
      var errorEl = document.getElementById("raffle-error");
      errorEl.textContent =
        "Stripe is not yet configured. Open assets/config.js and add " +
        "STRIPE_RAFFLE_MONTHLY_URL or STRIPE_RAFFLE_ONETIME_URL. " +
        "Your entry has been saved.";
    }
  }

  /* ── Entry Storage ───────────────────────────────────────── */
  function saveEntry(entry) {
    var all = getEntries();
    all.push(entry);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch(e) {}
  }

  function getEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  /* ── Admin Panel ─────────────────────────────────────────── */
  function showAdminPanel() {
    var section = document.getElementById("raffle-admin");
    if (section) {
      section.style.display = "block";
      section.removeAttribute("aria-hidden");
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  window.checkAdminPw = function() {
    var pw = document.getElementById("admin-pw");
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

    // Current month name
    var now = new Date();
    var monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
    if (title) title.textContent = "Entries — " + monthName;

    // Stats
    var totalEntries = entries.reduce(function(s, e) { return s + parseInt(e.entries || 0); }, 0);
    var monthlyCount = entries.filter(function(e) { return e.type === "Monthly"; }).length;
    var revenue      = entries.reduce(function(s, e) { return s + parseInt(e.price || 0); }, 0);
    if (stats) {
      stats.innerHTML =
        stat(entries.length, "Total Donors") +
        stat(totalEntries, "Total Entries") +
        stat(monthlyCount, "Monthly Subscribers") +
        stat("$" + revenue, "Revenue");
    }

    // Table rows
    if (entries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--ink-400);">No entries yet this month.</td></tr>';
      return;
    }
    tbody.innerHTML = entries.map(function(e, i) {
      var date = e.ts ? new Date(e.ts).toLocaleString() : "—";
      return "<tr>" +
        "<td>" + (i + 1) + "</td>" +
        "<td><strong>" + esc(e.first) + " " + esc(e.last) + "</strong></td>" +
        "<td>" + esc(e.email) + "</td>" +
        "<td>" + esc(e.phone || "—") + "</td>" +
        "<td><span class='raffle-entry-badge'>" + esc(e.entries) + "</span></td>" +
        "<td>" + (e.type === "Monthly"
          ? "<span class='raffle-monthly-badge'>Monthly</span>"
          : "<span style='font-size:0.8rem; color:var(--ink-500);'>One-time</span>") + "</td>" +
        "<td>$" + esc(e.price) + "</td>" +
        "<td style='color:var(--ink-400); font-size:0.8rem;'>" + date + "</td>" +
        "</tr>";
    }).join("");
  }

  function stat(val, label) {
    return "<div class='raffle-admin-stat'><strong>" + val + "</strong><span>" + label + "</span></div>";
  }

  function esc(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── CSV Download ────────────────────────────────────────── */
  window.downloadCSV = function() {
    var entries = getEntries();
    var now = new Date();
    var monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
    var header = ["#", "First Name", "Last Name", "Email", "Phone", "Entries", "Type", "Amount", "Submitted"];
    var rows = entries.map(function(e, i) {
      return [
        i + 1,
        e.first, e.last, e.email, e.phone || "",
        e.entries, e.type, "$" + e.price,
        e.ts ? new Date(e.ts).toLocaleString() : ""
      ].map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(",");
    });
    var csv = [header.map(function(h) { return '"' + h + '"'; }).join(",")]
      .concat(rows).join("\n");
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
  function init() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    bindRaffleTabs();
    bindTierChange();
    bindForm();
    updateSummary();

    // Show admin panel if ?admin=1 in URL
    if (window.location.search.includes("admin=1")) {
      showAdminPanel();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
