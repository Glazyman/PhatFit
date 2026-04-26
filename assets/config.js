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

  /* ── Chai & Win Raffle ─────────────────────────────────────── */
  // Wig drawing
  STRIPE_RAFFLE_WIG_ONETIME_URL:  "https://buy.stripe.com/7sY9ASgBGfz14kN63d7wA01",
  STRIPE_RAFFLE_WIG_MONTHLY_URL:  "https://buy.stripe.com/bJe3cuadi0E76sVajt7wA02",

  // Luxury Item drawing
  STRIPE_RAFFLE_ITEM_ONETIME_URL: "https://buy.stripe.com/bJe14mfxC2Mf4kN3V57wA03",
  STRIPE_RAFFLE_ITEM_MONTHLY_URL: "https://buy.stripe.com/6oU3cu99ecmP3gJ77h7wA04",

  // Legacy / fallback
  STRIPE_RAFFLE_ONETIME_URL: "https://buy.stripe.com/7sY9ASgBGfz14kN63d7wA01",
  STRIPE_RAFFLE_MONTHLY_URL: "https://buy.stripe.com/bJe3cuadi0E76sVajt7wA02"
};
