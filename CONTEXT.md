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

**Process media** (read `us-ice-witness-repo/dev-docs/adding-video-audio.md` for full details):

When the user says "I put a video/image in raw_media", do this:

1. **List `raw_media/`** to find the file (it will have the user's original filename)
2. **Determine the incident slug** — the slug is the incident markdown filename without `.md` (e.g., `2025-10-27-durango-family-school-route`). Ask the user which incident if unclear.
3. **Rename** the file to `<slug>.raw.<ext>` in `raw_media/`:
   ```bash
   # Example: rename a screen recording to match the incident
   mv "raw_media/Screen Recording 2026-02-16.mov" "raw_media/2025-10-27-durango-family-school-route.raw.mov"
   ```
   **Note:** Filenames from macOS often contain Unicode narrow no-break spaces (U+202F). Use shell globs (`mv raw_media/Screen\ Recording* raw_media/<slug>.raw.mov`) if `mv` with quotes fails.
4. **Organize into date folders:** `./us-ice-witness-repo/bin/run folderize_media.py --execute`
5. **Process + generate summary:** `./us-ice-witness-repo/bin/run run-media-pipeline.py`
6. **Commit** the compressed files that appear in `docs/media/` and the updated `docs/data/incidents-summary.json`

**Important:**
- Only process ONE media file per incident (video OR image, not both). If both a `.mov` and `.png` are in `raw_media/`, ask the user which one to use.
- **NEVER commit raw/uncompressed video directly to `docs/media/`.** The pipeline compresses videos to 1-6MB. Raw files stay in `raw_media/` which is gitignored.
- The pipeline auto-generates an OG poster image (frame at 2 seconds) for each video.

---

## Remember

- **Most instructions are in `us-ice-witness-repo/CONTEXT.md`**
- **Detailed task docs are in `us-ice-witness-repo/dev-docs/`** — read the relevant one for your task
- **Full documentation at https://docs.ice-witness.org**
- This file only contains Colorado-specific information
