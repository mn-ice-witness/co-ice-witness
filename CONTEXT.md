# CONTEXT.md - Colorado ICE Witness

This is a state-level ICE incident documentation repository.

## Important: Main Repository Reference

**Editorial standards, schemas, scripts, and most procedures come from the main [us-ice-witness](https://github.com/mn-ice-witness/us-ice-witness) repository.**

Before doing any work, clone the main repo into this project:

```bash
git clone https://github.com/mn-ice-witness/us-ice-witness.git us-ice-witness
```

This folder is gitignored. Update it periodically with `git pull`.

## Quick Setup

1. Clone main repo: `git clone https://github.com/mn-ice-witness/us-ice-witness.git us-ice-witness`
2. Edit `state-config.json` with your state's details
3. Read `us-ice-witness/docs/editorial-standards.md` for content guidelines
4. Read `us-ice-witness/docs/incident-schema.md` for file format

## State-Specific Configuration

Edit `state-config.json` to set:
- State name and code
- Contact email for tips
- Local media sources to monitor
- Search terms for daily searches

## Directory Structure

```
[state]-ice-witness/
├── CONTEXT.md              # This file
├── state-config.json       # State-specific settings
├── dev-docs/               # State-specific overrides ONLY
├── docs/
│   ├── data/
│   │   └── incidents-summary.json
│   ├── incidents/
│   │   └── YYYY-MM/
│   └── media/
└── us-ice-witness/         # (gitignored) Clone of main repo
```

## Running Scripts

Scripts live in the main repo. Run them from your state repo:

```bash
# Generate incidents summary
python us-ice-witness/scripts/generate_summary.py

# Process media files
python us-ice-witness/scripts/process_media.py

# Get timestamp (ALWAYS use this for dates)
./us-ice-witness/bin/timestamp.sh
```

## Adding Incidents

1. Read `us-ice-witness/docs/adding-incidents.md`
2. Create file in `docs/incidents/YYYY-MM/incident-slug/index.md`
3. Follow the schema in `us-ice-witness/docs/incident-schema.md`
4. Run `python us-ice-witness/scripts/generate_summary.py`
5. Commit and push

## Daily Search

Follow the procedure in `us-ice-witness/docs/llm-search-procedure.md`, but search for incidents in YOUR state using the media sources in `state-config.json`.

## State-Specific Overrides

If you need to override a procedure for your state, create a doc in `dev-docs/` with the same name. State-level docs take precedence over main repo docs.

## Critical Rules (from main repo)

These rules ALWAYS apply. See main repo for full details:

- **NEVER type timestamps manually** - use `./us-ice-witness/bin/timestamp.sh`
- **NEVER edit incidents-summary.json** - it's auto-generated
- **Use neutral language** - let facts speak for themselves
- **Every source needs a link** - no link = not a source
- **Trustworthiness values**: high, medium, low, unverified (no compounds)

## Deployment

Push to `main` branch to deploy to production.
Push to `dev` branch to deploy to preview URL.

See `state-config.json` for your deployment URLs.
