# RentIn Jabalpur

A focused first version of a student-housing directory: room/PG owners place a vacancy on an interactive map, and students can view its exact location, details, WhatsApp the owner, or open directions. It is static-first, so opening `index.html` works without Node.js or a development server.

## What is included

- Interactive Jabalpur map powered by OpenStreetMap and Leaflet (no map API key required)
- Owner vacancy form with a click-to-place map pin and browser location option
- Live listing data from Supabase
- Map pins, vacancy count, rent, description, WhatsApp contact, and Google Maps directions
- Responsive site ready for Vercel

## Run locally

Open `index.html` in any browser. It works with no installation. In demo mode, owner-created vacancies are stored in that browser, so you can test the full flow immediately.

To make listings live for all students, copy `config.example.js` to `config.js`, add `<script src="config.js"></script>` immediately before `app.js` in `index.html`, and set the two public Supabase values. Never add a service-role key to a website.

## Deploy

### Supabase

1. Create a project at [Supabase](https://supabase.com/dashboard).
2. Use the SQL migration above to create the `listings` table and policies.
3. Get the Project URL and publishable/anon key from **Project Settings → API** and put them in `config.js` as described above.

### Vercel

1. Import this GitHub repository into [Vercel](https://vercel.com/new).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
3. Deploy. Vercel uses the included build configuration automatically.

## Important launch note

This MVP permits public listing creation because the owner experience must be frictionless. Before marketing it widely, add Supabase Authentication or an admin approval step to prevent spam and fake listings.
