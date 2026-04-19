# Ahavas Chaya — Website

A clean, modern static rebuild of [ahavaschaya.com](https://ahavaschaya.com) with two Stripe-hosted donation flows:

- **Donate** — one-time donation, donor chooses any amount.
- **Donate Monthly** — recurring monthly donation; donor cancels anytime via the link in their Stripe receipt emails.

No build step. No backend. Just HTML + CSS + a tiny bit of JS, deployable anywhere static (Netlify drop, Vercel, GitHub Pages, Cloudflare Pages, S3, etc.).

---

## Project structure

```
.
├── index.html               # Home (hero, How it Works, Donate preview, FAQ)
├── about.html
├── eligibility.html
├── how-funding-works.html
├── apply.html
├── contact.html
├── donate.html              # Donate page with both Stripe buttons
├── nonprofit.html           # 501(c)(3) details + EIN
├── privacy.html
├── terms.html
├── thank-you.html           # Optional Stripe success_url destination
├── assets/
│   ├── styles.css           # Design system + all page styles
│   ├── main.js              # Mobile nav, FAQ, Stripe button wiring
│   └── config.js            # ← Paste your two Stripe Payment Link URLs here
├── STRIPE_SETUP.md          # Full Stripe setup walkthrough (do this once)
└── README.md
```

---

## Quick start

### 1. Set up Stripe (one-time)

Open [`STRIPE_SETUP.md`](STRIPE_SETUP.md) and follow Steps 1–6. You'll come away with:

- A **one-time** Payment Link URL (e.g. `https://buy.stripe.com/...`)
- A **monthly** Payment Link URL (e.g. `https://buy.stripe.com/...`)
- Customer Portal + billing emails enabled, so monthly donors can cancel from their Stripe receipt emails

### 2. Paste the URLs into the website

Open [`assets/config.js`](assets/config.js) and fill in both URLs:

```js
window.AHAVAS_CONFIG = {
  STRIPE_DONATE_ONE_TIME_URL: "https://buy.stripe.com/your_one_time_link",
  STRIPE_DONATE_MONTHLY_URL:  "https://buy.stripe.com/your_monthly_link"
};
```

That's it — every "Donate" and "Donate Monthly" button on the site now opens the right Stripe checkout in a new tab.

### 3. Preview locally

Just open `index.html` in your browser. Or, for nicer relative paths:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

### 4. Deploy

Pick any static host. Easiest options:

- **Netlify drop**: drag the entire project folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.
- **Vercel**: `vercel` CLI in this folder, or connect a Git repo.
- **GitHub Pages**: push to a repo and enable Pages on the `main` branch root.
- **Cloudflare Pages**: connect a Git repo, no build command needed.

Then point your domain (`ahavaschaya.com`) to the host.

---

## Design notes

- **Type**: Fraunces (serif headlines) + Inter (body), via Google Fonts
- **Color palette**: warm navy `#143A52`, gold accent `#D4A547`, soft teal, cream background `#FBF7F0`
- **Components**: sticky translucent header, rounded cards, gradient hero, accordion FAQ, navy CTA banners, soft trust strip, dark footer
- **Accessibility**: skip link, visible focus rings, aria-expanded on the mobile nav, semantic landmarks, respects `prefers-reduced-motion`
- **Responsive**: mobile-first, 920px nav breakpoint

---

## How donors cancel a monthly donation

They open any Stripe email they've received (welcome, monthly receipt, etc.) and click **Manage subscription**. That opens Stripe's hosted Customer Portal where they can cancel with one click. No login required on this site.

If a donor emails the office directly, you can cancel for them in [dashboard.stripe.com/subscriptions](https://dashboard.stripe.com/subscriptions).

---

## Updating content

All copy lives in the `.html` files — open the page you want to edit, change the text, save. There's no build step.

The footer, navigation, and `<head>` block are duplicated across each page (intentional for simplicity). When you make a change to one of those, mirror it in the other pages.
