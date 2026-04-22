/* ────────────────────────────────────────────────────────────────
   Stripe Payment Link configuration

   Fill in every URL below after creating the links in your Stripe
   Dashboard. See STRIPE_SETUP.md for the full walkthrough.

   PRESET ONE-TIME TIERS
   ─────────────────────
   For each tier, create a Product with a fixed price in Stripe, then
   create a Payment Link for it. Paste the resulting URL here.

   MONTHLY
   ───────
   One recurring Payment Link ($1/mo recurring price, adjustable
   quantity). The donor picks the quantity = their monthly $ amount.

   CUSTOM ONE-TIME
   ───────────────
   One "Customers choose what to pay" Payment Link.

   Until a URL is filled in, clicking that button shows a helpful
   alert so nothing silently breaks.
   ──────────────────────────────────────────────────────────────── */
window.AHAVAS_CONFIG = {

  /* ── Preset one-time tiers ─────────────────────────────────── */
  STRIPE_TIER_18:  "",   // $18  one-time
  STRIPE_TIER_36:  "",   // $36  one-time
  STRIPE_TIER_54:  "",   // $54  one-time
  STRIPE_TIER_100: "",   // $100 one-time
  STRIPE_TIER_180: "",   // $180 one-time
  STRIPE_TIER_360: "",   // $360 one-time

  /* ── Custom one-time (customers choose amount) ─────────────── */
  STRIPE_DONATE_ONE_TIME_URL: "",

  /* ── Monthly recurring ─────────────────────────────────────── */
  STRIPE_DONATE_MONTHLY_URL: "",

  /* ── Chai & Win Raffle ─────────────────────────────────────── */
  // Two drawings: Wig and Luxury Item, each with one-time + monthly.
  // Create 4 separate Stripe Payment Links (or reuse the fallback URLs
  // below until you set up dedicated links).

  // Wig drawing
  STRIPE_RAFFLE_WIG_ONETIME_URL:  "",   // one-time wig raffle
  STRIPE_RAFFLE_WIG_MONTHLY_URL:  "",   // monthly wig raffle subscription

  // Luxury Item drawing
  STRIPE_RAFFLE_ITEM_ONETIME_URL: "",   // one-time item raffle
  STRIPE_RAFFLE_ITEM_MONTHLY_URL: "",   // monthly item raffle subscription

  // Legacy / fallback (used if giveaway-specific URLs above are empty)
  STRIPE_RAFFLE_ONETIME_URL: "",
  STRIPE_RAFFLE_MONTHLY_URL: ""
};
