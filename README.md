# Studio 77 Dog Grooming — Website

Marketing site for **Studio 77 Dog Grooming**, Earls Colne (77 Monks Rd, Colchester CO6 2RY).

Built as a fast, hand-crafted single-page site — warm editorial design, smooth
scrolling, and real interactions (bookings, reviews, gallery). No AI-template look.

## Stack

- **Vite** (vanilla JS, no framework) — fast, lightweight, full control
- **Lenis** — smooth scrolling, synced to **GSAP** ScrollTrigger
- **Splitting.js** — animated hero headline
- **Swiper** — moving reviews carousel
- Fonts: Fraunces (display serif) + DM Sans (body)

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Features

- **Booking** — form generates a real calendar event: Add to Google Calendar,
  download `.ics` (Apple/Outlook), and a pre-filled SMS to the studio to
  confirm. No backend needed. (`src/lib/booking.js`)
- **Reviews** — moving Swiper carousel of testimonials + an on-site "leave a
  review" form (stored in the browser for the demo) + a link to review on
  Google. (`src/lib/reviews.js`)
- **Gallery** — curated masonry now, and **Instagram-ready**: drop in an access
  token and it auto-pulls the latest posts. (`src/lib/gallery.js`)
- **Services** — categorised tabs (Full Grooms / Bath & Freshen / Puppies /
  Add-ons) driven from data.
- Prominent phone number & links, sticky mobile Call/Book bar, live Google map,
  full mobile + desktop responsive.

## Everything editable in one place

All business content — name, phone, address, hours, prices, services, reviews,
gallery images — lives in **`src/data/site.js`**. Change it there; the whole
site updates.

## Before go-live (owner to confirm)

1. **Prices** — services marked "guide price" in `site.js` are estimates around
   the known £25–£35 full-groom intro offer. Confirm the real prices.
2. **Reviews** — the seeded testimonials are representative samples. Replace with
   the real Google reviews (the business is at a genuine 5.0 / 29 reviews).
3. **Google review link** — set the real Place ID in
   `business.socials.googleReviewLink`.
4. **Gallery auto-sync (Instagram)** — Instagram/Meta requires an access token
   to read an account's photos (a platform rule, not a site limitation). To turn
   on live auto-updating:
   - Connect the studio's Instagram (Business/Creator) account to a Facebook Page.
   - Create a long-lived Instagram Graph API token (or use a helper like Behold /
     EmbedSocial).
   - Add it as `VITE_IG_TOKEN` in a `.env` file (never commit it). The gallery
     then updates automatically whenever a new photo is posted.
5. **Opening hours** — Google lists "Opens 9 am Sat"; the rest are set to "by
   appointment". Confirm the real weekday hours in `site.js`.

## Deploy

Static output — host `dist/` anywhere (Vercel, Netlify, Cloudflare Pages).
For Vercel: framework preset **Vite**, build `npm run build`, output `dist`.
