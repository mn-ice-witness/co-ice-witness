# Colorado ICE Witness - Context for Claude Code

This is the **Colorado (CO)** data repository for the US ICE Witness project.

## Repository Structure

```
docs/
├── data/
│   └── incidents-summary.json   # Auto-generated, don't edit manually
├── incidents/
│   └── YYYY-MM/
│       └── YYYY-MM-DD-slug/
│           └── index.md
└── media/
    └── (images, videos for incidents)
```

## Master Documentation

**IMPORTANT:** All development documentation, schemas, and guidelines are in the master `us-ice-witness` repository.

If you have a local symlink at `us-ice-witness/`, read these files:
- `us-ice-witness/dev-docs/adding-incidents.md` - How to add new incidents
- `us-ice-witness/dev-docs/incident-schema.md` - Required fields and format
- `us-ice-witness/dev-docs/source-tiers.md` - Source credibility guidelines
- `us-ice-witness/dev-docs/state-news-sources-template.md` - News source documentation

If no symlink exists, clone the master repo:
```bash
git clone https://github.com/mn-ice-witness/us-ice-witness.git us-ice-witness
```

## The 5 Incident Categories

There are exactly 5 incident types. Use ONLY these:

| Type | Description |
|------|-------------|
| `citizens` | U.S. citizens OR anyone with valid legal status detained/affected |
| `observers` | People detained/attacked for filming, observing, or protesting ICE |
| `immigrants` | People without legal status: undocumented, asylum-seekers, etc. |
| `schools-hospitals` | Actions at/near schools or hospitals |
| `response` | Federal government (DHS/ICE/CBP) official statements ONLY |

## Colorado-Specific News Sources

See `NEWS-SOURCES.md` in this repo for Colorado-specific sources including:
- Denver Post, Colorado Sun, Denverite
- Denver7, CPR News, Colorado Newsline
- Colorado Politics, Westword

## Scripts and Hooks

All common code lives in the `us-ice-witness` symlink. State repos contain only data.

**Generate summary:**
```bash
python3 us-ice-witness/scripts/generate_summary.py
```

**Install git hooks (validates on commit):**
```bash
bash us-ice-witness/hooks/install-hooks.sh
```

## Adding an Incident

1. Read the schema: `us-ice-witness/dev-docs/incident-schema.md`
2. Create file: `docs/incidents/YYYY-MM/YYYY-MM-DD-slug.md`
3. Get timestamp: Run `date +"%Y-%m-%dT%H:%M:%S"` (NEVER make up timestamps)
4. Generate summary: `python3 us-ice-witness/scripts/generate_summary.py`
5. Commit and push (hooks auto-validate and regenerate summary)

## Key Colorado Communities

- **Denver:** Largest city, sanctuary city policy
- **Aurora:** Large immigrant population, highly-publicized raids
- **Colorado Springs:** Growing immigrant community
- **Greeley/Northern Colorado:** Agricultural workforce

## Legal Context

In November 2025, a federal judge ruled ICE's conduct during arrests in Colorado was "unlawful" and issued a preliminary injunction restricting arrest methods.

## State Code

This repository uses state code: **CO**
Data URL: `https://co-ice-witness.pages.dev`
