# Colorado ICE Witness - Context for AI Assistants

**This project is designed to work with an AI coding assistant**, preferably Claude Code using Opus 4.5.

---

## CRITICAL: BOOTSTRAP CHECK

**Before doing ANYTHING, check if the shared codebase is set up:**

```bash
ls -la us-ice-witness-repo/CONTEXT.md
```

### If the folder exists and works:

**Read the master instructions:**
```
us-ice-witness-repo/CONTEXT.md
```

That file contains ALL instructions for incidents, media, schemas, validation, and deployment. It also points to `us-ice-witness-repo/dev-docs/` which has detailed technical docs on every topic (incident schema, media processing, source tiers, etc.). **Read the relevant dev-doc for whatever task you're doing.**

**Then return here** for Colorado-specific info below.

### If the folder does NOT exist:

The shared codebase must be set up first. Ask the user:

> "The shared `us-ice-witness-repo` folder is missing. Would you like me to set it up?"
>
> **Option A: Clone nearby + symlink (Recommended)**
> ```bash
> git clone https://github.com/mn-ice-witness/us-ice-witness.git ../GIT_US_ICE_WITNESS
> ln -s ../GIT_US_ICE_WITNESS us-ice-witness-repo
> ```
>
> **Option B: Clone directly**
> ```bash
> git clone https://github.com/mn-ice-witness/us-ice-witness.git us-ice-witness-repo
> ```

After setup, install hooks:
```bash
./us-ice-witness-repo/hooks/install-hooks.sh
```

**Documentation:** https://docs.ice-witness.org

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

---

## Quick Reference

**Add an incident:**
> "Add this incident: [paste news URL]"

**Process media:**
> "I put a video in raw_media for the aurora-arrest incident. Process it."

**Generate summary:**
```bash
./us-ice-witness-repo/bin/run generate_summary.py
```

---

## Remember

- **Most instructions are in `us-ice-witness-repo/CONTEXT.md`**
- **Full documentation at https://docs.ice-witness.org**
- This file only contains Colorado-specific information
