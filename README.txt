
Khushi Full Ecommerce Starter
============================

What's included:
- Static frontend (vanilla JS) showing products from data/products.json
- Cart (client-side) and checkout via Stripe Checkout (serverless function)
- Netlify Functions: functions/create-checkout-session.js
- Netlify CMS admin at /admin (decap-cms) to edit data/products.json and data/settings.json
- _redirects and netlify.toml for SPA routing

Important - Stripe setup:
1) Create a Stripe account and get your SECRET KEY (starts with sk_...). Also get your PUBLISHABLE KEY (pk_...).
2) In Netlify Site settings -> Build & deploy -> Environment -> Add variables:
   - STRIPE_SECRET_KEY = <your secret key>
   - URL = https://<your-site>.netlify.app   (your deployed site URL)
3) The serverless function will use STRIPE_SECRET_KEY to create checkout sessions.
4) Checkout will redirect to success/cancel pages using URL env variable.

Netlify Identity / Netlify CMS (to edit products on the site):
1) Push this repo to GitHub and connect the site to Netlify (New site from Git).
2) In Netlify Dashboard -> Site -> Identity -> Enable Identity.
3) Identity -> Services -> Enable Git Gateway.
4) Identity -> Invite users -> invite your email address.
5) Open https://<your-site>.netlify.app/admin and login -> you can edit products and settings.

Deploy by drag & drop (quick):
- Extract the zip. In Netlify site -> Deploys -> Drag & drop the extracted files (not the zip).
- Or push to GitHub and connect repo for automatic deploys.

Notes:
- Replace placeholder uploads with real images via /admin media uploads.
- For production payments, ensure Stripe settings, currencies and amounts are correct.
