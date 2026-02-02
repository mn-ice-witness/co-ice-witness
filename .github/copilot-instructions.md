# GitHub Copilot Instructions for Colorado ICE Witness

## CRITICAL: Read Context First

Before any task, read these files for context:

1. `us-ice-witness/CONTEXT.md` - Master instructions (read this FIRST)
2. `CONTEXT.md` - Colorado-specific info only

## Key Rules

- Incident schema is defined in `us-ice-witness/CONTEXT.md`
- 5 categories: citizens, observers, immigrants, schools-hospitals, response
- Required fields: date, type, status, trustworthiness, created, last_updated
- Media goes in `raw_media/`, processed to `docs/media/`
- All scripts are in `us-ice-witness/bin/`

## Common Tasks

**Add incident:** Create file at `docs/incidents/YYYY-MM/YYYY-MM-DD-slug/index.md`

**Process media:** `python3 us-ice-witness/bin/process_media.py`

**Generate summary:** `python3 us-ice-witness/bin/generate_summary.py`
