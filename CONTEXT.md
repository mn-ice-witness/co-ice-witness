# Colorado ICE Witness - Context for AI Assistants

**This project is designed to work with an AI coding assistant**, preferably Claude Code using Opus 4.5.

## CRITICAL: READ THE MASTER CONTEXT FIRST

**STOP. Before doing ANYTHING, you MUST read:**

```
us-ice-witness/CONTEXT.md
```

**That file contains ALL the instructions for:**
- How to add incidents
- Incident schema and required fields
- How to process media
- The 5 incident categories
- Validation rules
- Deployment process
- Key reference files in `dev-docs/`

**This file only contains Colorado-specific information. The master context has everything else.**

If `us-ice-witness/` doesn't exist, get it first:
```bash
# Option A: Clone nearby + symlink (recommended)
git clone https://github.com/mn-ice-witness/us-ice-witness.git ../GIT_US_ICE_WITNESS
ln -s ../GIT_US_ICE_WITNESS us-ice-witness

# Option B: Clone directly
git clone https://github.com/mn-ice-witness/us-ice-witness.git us-ice-witness
```

---

## Colorado State Info

| Field | Value |
|-------|-------|
| State Code | **CO** |
| State Name | Colorado |
| Site URL | co.ice-witness.org |
| Data URL | co-ice-witness.pages.dev |

## Colorado-Specific Context

**Key Communities:**
- Denver (sanctuary city)
- Aurora (large immigrant population, highly-publicized raids)
- Colorado Springs (growing immigrant community)
- Greeley/Northern Colorado (agricultural workforce)

**Legal Context:** In November 2025, a federal judge ruled ICE's conduct during arrests in Colorado was "unlawful" and issued a preliminary injunction restricting arrest methods.

## Colorado News Sources

See `dev-docs/NEWS-SOURCES.md` for state-specific news sources to monitor.

## Setup Help

If you need to set up this repo, see `dev-docs/SETUP-HELPER.md` for step-by-step instructions.

---

## Quick Reference

**Add an incident:**
> "Add this incident: [paste news URL]"

**Process media:**
> "I put a video in raw_media for the aurora-arrest incident. Process it."

**Generate summary:**
```bash
./us-ice-witness/bin/run generate_summary.py
```

**Remember: All detailed instructions are in `us-ice-witness/CONTEXT.md`**
