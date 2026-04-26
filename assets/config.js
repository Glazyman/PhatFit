/* ────────────────────────────────────────────────────────────────
   Stripe Payment Link configuration — LIVE MODE
   All payment links were created via the Stripe MCP plugin.
   To switch to test mode: replace these URLs with test-mode links
   created using your Stripe test API keys.
   ──────────────────────────────────────────────────────────────── */
window.AHAVAS_CONFIG = {

  /* ── Preset one-time tiers ─────────────────────────────────── */
  STRIPE_TIER_18:  "https://buy.stripe.com/8x228qfxCgD55oR8bl7wA05",   // $18  one-time
  STRIPE_TIER_36:  "https://buy.stripe.com/fZu6oGety3Qj8B3fDN7wA06",   // $36  one-time
  STRIPE_TIER_54:  "https://buy.stripe.com/eVqbJ03OU9aD7wZ63d7wA07",   // $54  one-time
  STRIPE_TIER_100: "https://buy.stripe.com/5kQ7sKgBG5YrdVn2R17wA08",   // $100 one-time
  STRIPE_TIER_180: "https://buy.stripe.com/dRm5kC85a2Mf3gJ77h7wA09",   // $180 one-time
  STRIPE_TIER_360: "https://buy.stripe.com/9B614m85a1IbcRj2R17wA0a",   // $360 one-time

  /* ── Custom one-time (customers choose amount) ─────────────── */
  STRIPE_DONATE_ONE_TIME_URL: "https://buy.stripe.com/aFa5kCclq86zeZr2R17wA0b",

  /* ── Monthly recurring ─────────────────────────────────────── */
  STRIPE_DONATE_MONTHLY_URL: "https://buy.stripe.com/14AcN4adi3QjaJb8bl7wA0c",

  /* ── Chai & Win Raffle — per-tier links ────────────────────── */
  // Each key matches the radio input's value in raffle.html exactly.
  STRIPE_RAFFLE_TIERS: {
    // Wig Drawing — one-time
    "wig-single-1":   "https://buy.stripe.com/5kQ6oG2KQbiLdVn3V57wA0d",  // 1 entry  $20
    "wig-single-5":   "https://buy.stripe.com/6oU5kC4SYdqT04xajt7wA0e",  // 5 entries $80
    "wig-single-12":  "https://buy.stripe.com/14AaEW3OU4Un3gJ1MX7wA0f",  // 12 entries $200
    // Wig Drawing — monthly
    "wig-monthly-1":  "https://buy.stripe.com/6oU00iety72vdVnbnx7wA0g",  // 1 entry/mo  $15
    "wig-monthly-5":  "https://buy.stripe.com/fZuaEWdpugD5bNf3V57wA0h",  // 5 entries/mo $60
    "wig-monthly-12": "https://buy.stripe.com/3cI5kC99e1Ib9F763d7wA0i",  // 12 entries/mo $150
    // Luxury Item Drawing — one-time
    "item-single-1":   "https://buy.stripe.com/aFadR85X23Qj7wZ1MX7wA0j", // 1 entry  $20
    "item-single-5":   "https://buy.stripe.com/8x2cN4clq4UneZrezJ7wA0k", // 5 entries $80
    "item-single-12":  "https://buy.stripe.com/6oUaEWgBG4Un5oRdvF7wA0l", // 12 entries $200
    // Luxury Item Drawing — monthly
    "item-monthly-1":  "https://buy.stripe.com/3cIfZg1GMdqT18B4Z97wA0m", // 1 entry/mo  $15
    "item-monthly-5":  "https://buy.stripe.com/6oUdR8dpucmP04x2R17wA0n", // 5 entries/mo $60
    "item-monthly-12": "https://buy.stripe.com/cNi14m99e0E75oRgHR7wA0o"  // 12 entries/mo $150
  },

  // Legacy / fallback (kept for the donation page)
  STRIPE_RAFFLE_ONETIME_URL: "https://buy.stripe.com/5kQ6oG2KQbiLdVn3V57wA0d",
  STRIPE_RAFFLE_MONTHLY_URL: "https://buy.stripe.com/6oU00iety72vdVnbnx7wA0g"
};
