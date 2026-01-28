# Colorado ICE Witness

ICE incident documentation for Colorado.

## Structure

```
docs/
├── data/
│   └── incidents-summary.json    # Summary of all incidents
├── incidents/
│   └── YYYY-MM/                  # Incidents organized by month
│       └── incident-slug/
│           └── index.md
└── media/                        # Images and videos
```

## Editorial Guidelines

See the main [US ICE Witness](https://github.com/mn-ice-witness/us-ice-witness) repo for:
- Editorial guidelines
- Incident schema documentation
- Media workflow instructions

## Deployment

This repo's content is served at `us-ice-witness.org/co/`

Pushing to `main` triggers automatic deployment via Cloudflare Pages.
