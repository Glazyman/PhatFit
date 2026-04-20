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
  STRIPE_DONATE_MONTHLY_URL: ""
};
