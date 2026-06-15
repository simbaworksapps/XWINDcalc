# SIMBA XWIND

Standalone offline-first aviation crosswind calculator PWA.

## Deploy

Upload this folder to a GitHub repository and point Cloudflare Pages at it. The app is mostly static, with one Pages Function for METAR wind lookup.

- Build command: leave blank
- Output directory: `/` if this folder is the repo root, or `outputs/xwind` if deploying from the parent workspace
- Required files: `index.html`, `styles.css`, `app.js`, `manifest.json`, `service-worker.js`, `assets/`, `icons/`, `data/`, `functions/`

## Run Locally

```powershell
python -m http.server 8768
```

Then open `http://127.0.0.1:8768/`.

## Data

The bundled runway database uses FAA NASR APT CSV data for U.S. airports, a small curated military-field override layer for selected overseas fields, and OurAirports `airports.csv` / `runways.csv` as the worldwide fallback. The current generated file contains 35,752 airports with runway data before overrides.

Curated military-field overrides live in `data/military-overrides.js` so commonly visited military fields can be corrected without regenerating the whole worldwide database. Current curated entries include EGUL, EGUN, EGVA, ETAR, ETAD, LGSA, LICZ, LPLA, LEMO, LERT, LTAG, OMAM, OKAS, ORAA, OTBH, OEPS, PGUA, RJTY, RODN, RKJK, and RKSO.

For U.S. airports, runway labels come from FAA NASR `APT_RWY` / `APT_RWY_END`. Runway headings are stored as magnetic/published-style headings for cockpit wind calculations. The generator computes true bearings from FAA runway-end coordinates where available, converts them with recent FAA magnetic variation when available or MAGVAR 2025 when the FAA variation date is stale, then falls back to FAA true alignment or runway number only when needed. The OurAirports fallback converts true runway headings to magnetic with MAGVAR 2025 and calculates the opposite runway end as a reciprocal heading.

Runway heading tolerance: FAA/MAGVAR and chart-verified curated headings are expected to be within about 1 degree of current charted runway direction. MAGVAR-processed worldwide fallback headings are improved but may still be rounded, stale, or source-limited and can vary by several degrees or more, so users should verify against current official publications for operational use.

The current FAA cycle used here is NASR effective 2026-06-11. As of June 15, 2026, FAA lists this as the current NASR subscription cycle.

## Updating

When deploying a new version, bump `CACHE_NAME` in `service-worker.js`. Users with the installed app will see the Update button after the new service worker is detected.

## METAR Wind

Airport selection attempts to load the latest METAR wind through `functions/api/metar.js`, which proxies AviationWeather because the official API does not allow direct browser CORS requests. Local `python -m http.server` testing will show manual wind fallback unless you run an equivalent local function/proxy.
