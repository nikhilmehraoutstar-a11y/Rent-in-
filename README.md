# RentIn Jabalpur

A focused first version of a student-housing directory: room/PG owners place a vacancy on an interactive map, and students can view its exact location, details, WhatsApp the owner, or open directions.

## What is included

- Interactive Jabalpur map powered by OpenStreetMap and Leaflet (no map API key required)
- Owner vacancy form with a click-to-place map pin and browser location option
- Live listing data from Supabase
- Map pins, vacancy count, rent, description, WhatsApp contact, and Google Maps directions
- Responsive site ready for Vercel

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set the two Supabase variables.
4. In the Supabase SQL Editor, run `supabase/migrations/001_create_listings.sql`.
5. Run `npm run dev`.

Without the environment variables, the website uses two sample listings so that the interface can still be previewed.

## Deploy

### Supabase

1. Create a project at [Supabase](https://supabase.com/dashboard).
2. Use the SQL migration above to create the `listings` table and policies.
3. Get the Project URL and publishable/anon key from **Project Settings → API**.

### Vercel

1. Import this GitHub repository into [Vercel](https://vercel.com/new).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
3. Deploy. Vercel uses the included build configuration automatically.

## Important launch note

This MVP permits public listing creation because the owner experience must be frictionless. Before marketing it widely, add Supabase Authentication or an admin approval step to prevent spam and fake listings.
