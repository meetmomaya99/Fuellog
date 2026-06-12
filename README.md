# FuelLog — Car Cost Tracker

A lightweight, offline-first Progressive Web App (PWA) for tracking fuel fillups, oil changes, and car maintenance. See your real cost per km at a glance.

**Live app:** https://fuellog-5t6.pages.dev

---

## Features

- **Fuel log** — record every fillup with price, volume, and odometer
- **Fuel economy badges** — instantly see if a fillup was good, average, or poor
- **Gap detection** — flags unusual gaps between fillups
- **Oil change tracker** — log oil changes and get reminders when the next one is due
- **Maintenance log** — record any other service (tyres, brakes, etc.)
- **Cost per km** — calculated automatically across all expenses
- **Charts** — visualise fuel economy and spending over time
- **Offline support** — works fully without an internet connection (service worker)
- **Installable** — install to your home screen on Android or iOS
- **Dark mode** — follows your system preference
- **No account needed** — all data stays on your device

---

## Tech stack

- Single HTML file — no build step, no dependencies, no framework
- Vanilla JS + CSS
- PWA (Web App Manifest + Service Worker)
- Data stored in `localStorage`

---

## Project structure

```
Fuellog/
├── index.html       # The entire app
├── sw.js            # Service worker (offline caching)
├── manifest.json    # PWA metadata (name, icons, shortcuts)
├── privacy.html     # Privacy policy page
├── robots.txt
├── sitemap.xml
├── icons/           # App icons (72px – 512px)
└── screenshots/     # Store / PWA install screenshots
```

---

## Deployment

The app is hosted on **Cloudflare Pages** and deploys automatically when changes are pushed to the `main` branch.

To make a change:
1. Edit the files locally (or directly on GitHub)
2. Commit and push to `main`
3. Cloudflare Pages picks up the change and redeploys in ~30 seconds

---

## Running locally

No build step needed — just open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## License

MIT
