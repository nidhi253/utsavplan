# UtsavPlan

Event planning and coordination for Indian family functions (wedding, haldi, mehendi, sangeet, birthdays, naming ceremonies, housewarmings and any other event).

> They help you find vendors. We help you pull off the event.

## What's in this repo

| Path | What it is |
|---|---|
| `app/` | The working Next.js app |
| `PRD.html` | Product requirements: problem, differentiation, features, MVP vs later |
| `MVP-scope.html` | Feature list split into MVP, stretch and later |
| `mockup.html` | Clickable design mockup (single file, open in a browser) |

## Run the app

```bash
cd app
npm install
npm run dev      # http://localhost:3000
```

Production check: `npm run build`.

## What works today

- **Plan Setup:** type any events (a wedding often has several), each with its own date and guest count. Known events get a tailored checklist; others get a generic one.
- **Event plan:** tasks, vendors, manual payments (paid/pending) and a shopping list, grouped by function.
- **Vendor directory:** search, a side filter drawer (category, event type, city, price, rating, availability, sort), and "View work" on every card.
- **Vendor profile:** work gallery, services and prices, shortlist, request booking for a specific function.
- **Artist confirm page:** the artist taps Confirm or Decline.
- **Family link:** read-only, no login, refreshes every 2 seconds.

### Try the live update

1. Plan an event and request a booking from any vendor.
2. On the event's Vendors tab, tap "Share with family" and open the link in a second tab.
3. Open "the artist's confirm page" in a third tab and tap Confirm.
4. The family tab flips to Confirmed within about 2 seconds.

## Not built yet

Day-of timeline, verified-booking reviews (the Reviews tab is a placeholder), shopping cost estimates, real availability checks, real login. See `PRD.html` for the roadmap.

## How it's built

- Next.js (App Router), TypeScript, plain CSS.
- Server data in a JSON file (`app/data/db.json`, created on first use and git-ignored). No external services or keys.
- The shortlist and "my events" list are stored in the browser; other devices see an event through its share link.
- Vendors and event templates are seeded in `app/lib/data.ts`.

## Image credits

The vendor photos in `app/public/images` are placeholders from Wikimedia Commons, mostly under CC BY-SA. Each photo's source and license is in `app/public/images/CREDITS.txt`. Replace them with photos you have rights to before any public launch.
