# Lumen Dental Studio — Clinic Website

A fast, modern dental clinic website with a 3D tooth model, transparent price list,
location + live "Open now" hours, Google Map, and an appointment form that sends
the request straight to the clinic's WhatsApp (or email). **No database, no login,
no monthly costs.**

## Run it on your computer

```bash
node server.js        # then open http://localhost:3000
```
(Node 18 or newer. There is nothing to install.)

## Put it online (free)

Upload the **`public`** folder to any static host — Netlify (drag & drop), Vercel,
GitHub Pages, Cloudflare Pages, or any normal web hosting. `server.js` is optional
(only for self-hosting on a VPS).

## Customise for a clinic — 5 minutes

1. **`public/site.json`** — the one file that controls: clinic name, dentist name,
   phone, WhatsApp number, email, address, landmark, parking, map search text,
   opening hours, the full price list and social links.
   * WhatsApp number = digits only with country code, e.g. `919876543210`.
   * Map: set `mapQuery` to "Clinic name + full address" for an exact pin.
   * Add/remove price rows freely; the booking form's treatment list updates itself.
2. **`public/index.html`** — things that must be edited in the file itself:
   * Brand wordmark `lumen.` (search for `<span>lumen</span>`, 3 places) and page title.
   * The `canonical`, `og:` tags and the `<script type="application/ld+json">`
     block near the top (your real domain, address, phone, hours) — helps Google.
   * Section text: dentist biography, patient stories (in `js/script.js`), FAQs.
3. **Photos** — replace the files in `public/images/` (keep the names):
   `hero-smile.webp`, `studio-interior.webp`, `dentist.webp`.
4. **`public/sitemap.xml` / `robots.txt`** — change the domain.

> All names, numbers, prices, credentials and reviews shipped here are SAMPLE
> placeholders. Replace them with the clinic's real, verified details before going live.

## How booking works

The visitor fills the form → taps **Request on WhatsApp** → WhatsApp opens with the
message pre-written to the clinic's number (or **Send by email**). The clinic simply
receives it as a normal chat/email. Works on every host and phone.

## Project structure

```
public/            ← the website (this is what you upload)
  index.html
  site.json        ← edit clinic details here
  css/style.css
  js/script.js
  images/  assets/ (3D model)
server.js          ← optional tiny local/VPS server with security headers
```
