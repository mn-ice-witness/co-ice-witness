# Colorado ICE Witness - Data Repository

This repo contains **DATA ONLY** for Colorado ICE incidents.

The website is served from [us-ice-witness](https://github.com/mn-ice-witness/us-ice-witness) at `us-ice-witness.org/co/`

## Structure

```
docs/
├── data/
│   └── incidents-summary.json   # Auto-generated, don't edit
├── incidents/
│   └── YYYY-MM/
│       └── incident-slug/
│           └── index.md
└── media/
    └── (images, videos)
```

## Adding Incidents

1. Clone the main repo for scripts and docs:
   ```bash
   git clone https://github.com/mn-ice-witness/us-ice-witness.git us-ice-witness-repo
   ```

2. Read the editorial guidelines:
   - `us-ice-witness-repo/dev-docs/adding-incidents.md`
   - `us-ice-witness-repo/dev-docs/incident-schema.md`

3. Create incident file in `docs/incidents/YYYY-MM/slug/index.md`

4. Run: `./us-ice-witness-repo/bin/run generate_summary.py`

5. Commit and push

## Deployment

Push to `main` to update data. The main website fetches from this repo's deployed files.
