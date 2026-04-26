(function () {
  "use strict";

  /* ── Config ──────────────────────────────────────────────── */
  var ADMIN_PASSWORD   = "ahavas2026"; // change before launch
  var STORAGE_KEY      = "chaiwin_entries";
  var FORMSUBMIT_EMAIL = "info@ahavaschaya.com";

  /* ── State ───────────────────────────────────────────────── */
  var currentGiveaway = "wig"; // "wig" | "item"

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

  /* ── Giveaway tabs (Wig / Luxury Item) ───────────────────── */
  function bindGiveawayTabs() {
    var tabWig    = document.getElementById("gtab-wig");
    var tabItem   = document.getElementById("gtab-item");
    var panelWig  = document.getElementById("gpanel-wig");
    var panelItem = document.getElementById("gpanel-item");
    if (!tabWig || !panelWig) return;

    function switchGiveaway(giveaway) {
      currentGiveaway = giveaway;
      var isWig = giveaway === "wig";
      tabWig.classList.toggle("is-active", isWig);
      tabWig.setAttribute("aria-selected", String(isWig));
      tabItem.classList.toggle("is-active", !isWig);
      tabItem.setAttribute("aria-selected", String(!isWig));
      panelWig.hidden  = !isWig;
      panelItem.hidden = isWig;
      // Clear radios in the hidden panel
      var hidden = isWig ? panelItem : panelWig;
      hidden.querySelectorAll("input[type='radio']").forEach(function(r) { r.checked = false; });
      // Auto-select in the visible panel's active freq tab
      var shown      = isWig ? panelWig : panelItem;
      var activeFreq = shown.querySelector("[role='tabpanel']:not([hidden])");
      if (activeFreq) autoSelectInPanel(activeFreq);
      updateSummary();
    }

    tabWig.addEventListener("click",  function() { switchGiveaway("wig"); });
    tabItem.addEventListener("click", function() { switchGiveaway("item"); });

    // Hero prize card "Enter X Drawing" buttons
    document.querySelectorAll("[data-goto-wig]").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        switchGiveaway("wig");
        scrollToEnter();
      });
    });
    document.querySelectorAll("[data-goto-item]").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        switchGiveaway("item");
        scrollToEnter();
      });
    });
  }

  function scrollToEnter() {
    var s = document.getElementById("enter");
    if (s) setTimeout(function() { s.scrollIntoView({ behavior: "smooth" }); }, 50);
  }

  /* ── Freq tabs (Single / Monthly per giveaway) ───────────── */
  function bindFreqTabs() {
    document.querySelectorAll(".giveaway-freq-tab").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var giveaway = btn.dataset.giveaway;
        var freq     = btn.dataset.freq;
        var panel    = document.getElementById("gpanel-" + giveaway);
        if (!panel) return;

        // Update tab active states
        panel.querySelectorAll(".giveaway-freq-tab").forEach(function(t) {
          var active = t === btn;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });

        // Show/hide freq sub-panels
        var targetId = giveaway + "-panel-" + freq;
        panel.querySelectorAll("[id^='" + giveaway + "-panel-']").forEach(function(p) {
          p.hidden = (p.id !== targetId);
        });

        // Auto-select popular tier in newly shown panel
        var shown = document.getElementById(targetId);
        if (shown) autoSelectInPanel(shown);
        updateSummary();
      });
    });
  }

  function autoSelectInPanel(panel) {
    if (panel.querySelector("input[type='radio']:checked")) return; // already selected
    var popular = panel.querySelector(".raffle-tier-card.is-popular input[type='radio']");
    var first   = panel.querySelector("input[type='radio']");
    if (popular) popular.checked = true;
    else if (first) first.checked = true;
  }

  /* ── Summary line ────────────────────────────────────────── */
  function updateSummary() {
    var panel    = document.getElementById("gpanel-" + currentGiveaway);
    var el       = document.getElementById("raffle-summary");
    var btnLabel = document.getElementById("raffle-submit-label");
    if (!panel || !el) return;
    var checked = panel.querySelector("input[name='raffle-tier']:checked");
    if (!checked) return;
    var entries  = checked.dataset.entries;
    var price    = checked.dataset.price;
    var monthly  = checked.dataset.monthly === "true";
    var gLabel   = currentGiveaway === "wig" ? "Wig Drawing" : "Luxury Item Drawing";
    el.textContent = gLabel + " · " + entries + " " +
      (entries === "1" ? "entry" : "entries") +
      (monthly ? "/month · $" + price + "/mo" : " · $" + price + " one-time");
    if (btnLabel) {
      btnLabel.textContent = monthly ? "Subscribe & Enter" : "Donate & Enter";
    }
  }

  function bindTierChange() {
    document.addEventListener("change", function(e) {
      if (e.target && e.target.name === "raffle-tier") updateSummary();
    });
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
      var panel   = document.getElementById("gpanel-" + currentGiveaway);
      var checked = panel ? panel.querySelector("input[name='raffle-tier']:checked") : null;

      [first, last, email].forEach(function(f) { f.classList.remove("is-error"); });
      if (!first.value.trim()) { first.classList.add("is-error"); first.focus(); errorEl.textContent = "Please enter your first name."; return; }
      if (!last.value.trim())  { last.classList.add("is-error");  last.focus();  errorEl.textContent = "Please enter your last name."; return; }
      if (!email.value.trim() || !email.value.includes("@")) { email.classList.add("is-error"); email.focus(); errorEl.textContent = "Please enter a valid email address."; return; }
      if (!terms.checked) { errorEl.textContent = "Please agree to the Terms & Conditions to continue."; return; }
      if (!checked)       { errorEl.textContent = "Please select an entry option above."; return; }

      var isMonthly     = checked.dataset.monthly === "true";
      var now           = new Date();
      var monthStr      = now.toLocaleString("default", { month: "long", year: "numeric" });
      var giveawayLabel = currentGiveaway === "wig" ? "Wig Drawing" : "Luxury Item Drawing";

      var entry = {
        first:    first.value.trim(),
        last:     last.value.trim(),
        email:    email.value.trim(),
        phone:    phone.value.trim() || "—",
        giveaway: giveawayLabel,
        entries:  checked.dataset.entries,
        type:     isMonthly ? "Monthly" : "One-time",
        price:    "$" + checked.dataset.price + (isMonthly ? "/mo" : ""),
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
          _subject:  "🎟 New Chai & Win Entry — " + giveawayLabel + " — " + monthStr,
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
    var cfg    = window.AHAVAS_CONFIG || {};
    var panel  = document.getElementById("gpanel-" + currentGiveaway);
    var checked = panel ? panel.querySelector("input[name='raffle-tier']:checked") : null;
    var tierVal = checked ? checked.value : null; // e.g. "wig-single-5"

    // Look up the exact per-tier payment link first, then fall back to legacy keys
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
  function init() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    bindGiveawayTabs();
    bindFreqTabs();
    bindTierChange();
    bindForm();
    updateSummary();
    if (window.location.search.includes("admin=1")) showAdminPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
