# Stripe Setup — Ahavas Chaya Donations

This site uses **Stripe Payment Links** (Stripe-hosted pages) for both donation buttons. No backend or custom checkout UI is required.

---

## What you'll create in Stripe (one-time setup)

1. A **One-time donation** Payment Link (donor chooses any amount).
2. A **Monthly donation** Payment Link (recurring; donor chooses any monthly amount via adjustable quantity).
3. **Customer Portal** + **billing emails** turned on, so donors can cancel/manage their monthly donation from a link in Stripe's emailed receipts (no login system on this site needed).

When you're done, you'll paste two URLs into `assets/config.js` and the buttons will work.

---

## Step 1 — Stripe account basics

1. Sign in at <https://dashboard.stripe.com>.
2. Settings → **Business details**: confirm your nonprofit name, address, support email/phone.
3. Settings → **Branding**: upload the Ahavas Chaya logo, set the brand color (`#143A52`). This is what donors see on the Stripe-hosted checkout page.
4. Top-right toggle: stay in **Test mode** while you set this up. Switch to **Live mode** at the very end.

---

## Step 2 — Enable the Customer Portal (so donors can cancel)

1. Go to <https://dashboard.stripe.com/settings/billing/portal>.
2. Click **Activate test link** (or the Live equivalent later).
3. Under **Functionality**, enable:
   - "Customers can update payment methods"
   - "Customers can cancel subscriptions" → choose **Cancel at end of billing period** (or immediate — your choice).
   - (Optional) "Customers can update billing information."
4. Under **Business information**, set the support link/email.
5. Under **Default redirect link** set: `https://ahavaschaya.com/`
6. Click **Save**.

Docs: <https://docs.stripe.com/billing/subscriptions/customer-portal>

---

## Step 3 — Turn on emails that contain the "Manage subscription" link

This is what lets monthly donors cancel without any login on the website.

1. Go to <https://dashboard.stripe.com/settings/billing/automatic> (Settings → Billing → **Subscriptions and emails**).
2. Under **Email notifications and customer management**, enable:
   - "Email customers about expiring cards"
   - "Email customers when card payments fail"
   - "Send finalized invoices and credit notes to customers"
3. Set **Payment method updates** → **Stripe-hosted customer portal**.
4. Set **Subscription management** → **Stripe-hosted customer portal**.
5. Save.
6. Also go to <https://dashboard.stripe.com/settings/emails> and enable **Successful payments** so donors receive a receipt after every monthly charge — that receipt contains the manage/cancel link.

Docs: <https://stripe.com/docs/invoicing/send-email>

---

## Step 4 — Create the **One-time** donation Payment Link

1. Go to <https://dashboard.stripe.com/payment-links/create>.
2. Choose **Customers choose what to pay**.
3. Title: `Ahavas Chaya Donation`
4. Description: `Help fund therapy for orphaned children. Ahavas Chaya, Inc. is a registered 501(c)(3). Donations are tax-deductible. EIN 86-3024529.`
5. (Optional) Suggested amount: `$180`. Minimum: `$10`.
6. Currency: USD.
7. Under **After payment**, choose **Show confirmation page** (or redirect to `https://ahavaschaya.com/thank-you`).
8. Click **Create link** and **copy the URL** — looks like `https://buy.stripe.com/XXXXXXXX`.

Save that URL — you'll need it in Step 6.

Docs: <https://docs.stripe.com/payment-links/create?pricing-model=standard>

---

## Step 5 — Create the **Monthly** donation Payment Link

Note: Stripe's "customers choose what to pay" doesn't support recurring, so we use a $1/month recurring price + adjustable quantity. Donor sets the quantity → monthly amount = quantity × $1.

### 5a. Create the product + recurring price

1. Go to <https://dashboard.stripe.com/products/create>.
2. Name: `Monthly Donation to Ahavas Chaya`
3. Description: `Recurring monthly donation. Quantity = monthly amount in USD. Cancel anytime.`
4. Pricing → **Recurring**, **Monthly**, amount: `$1.00 USD`.
5. Save.

### 5b. Create the Payment Link with adjustable quantity

1. Go to <https://dashboard.stripe.com/payment-links/create>.
2. Choose **Products or subscriptions**.
3. Select the `Monthly Donation to Ahavas Chaya` product / $1/month price.
4. In the line item options, enable **Let customers adjust quantity**:
   - Minimum quantity: `5` (so the smallest monthly donation is $5/mo — adjust to taste)
   - Maximum quantity: `10000`
5. Under **After payment**, choose **Show confirmation page** (or redirect to `https://ahavaschaya.com/thank-you`).
6. (Optional) Under **Options → Customer information**, collect `Name` so receipts look better.
7. Click **Create link** and **copy the URL**.

---

## Step 6 — Wire the URLs into the website

Open `assets/config.js` and paste the two URLs:

```js
window.AHAVAS_CONFIG = {
  STRIPE_DONATE_ONE_TIME_URL: "https://buy.stripe.com/PASTE_YOUR_ONE_TIME_LINK_HERE",
  STRIPE_DONATE_MONTHLY_URL:  "https://buy.stripe.com/PASTE_YOUR_MONTHLY_LINK_HERE"
};
```

Save and reload the site. Both buttons now go to the correct Stripe-hosted page.

---

## Step 7 — Test end-to-end (Test mode)

Use Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.

1. Click **Donate** on the site → enter $10 → complete payment → confirm receipt email arrived.
2. Click **Donate Monthly** → enter quantity 18 (= $18/mo) → complete subscription.
3. Open the receipt email Stripe sent — confirm there's a **"Manage subscription"** link → clicking it opens the Stripe Customer Portal where you can cancel.
4. Verify the cancellation works in the portal.

If anything fails, double-check Steps 2 and 3 (portal + emails enabled).

---

## Step 8 — Go live

1. Toggle Stripe Dashboard from **Test mode** to **Live mode** (top right).
2. Repeat Steps 2–5 in **Live mode** (the configuration doesn't carry over from test).
3. Replace the URLs in `assets/config.js` with the **Live** Payment Link URLs.
4. Re-deploy the site.
5. Do one small real donation as a final smoke test (you can refund yourself in the Stripe Dashboard).

---

## How donors cancel their monthly donation

They open any Stripe email they've received (welcome receipt, monthly receipt, card-expiry warning, etc.) and click the **Manage subscription** link. That opens the Stripe-hosted Customer Portal where they can cancel with one click. No account on `ahavaschaya.com` required.

If a donor emails you asking how to cancel, you can simply reply with that instruction — or you can cancel it for them in <https://dashboard.stripe.com/subscriptions>.
