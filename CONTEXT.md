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

**Process media** — complete rules below. Also see `us-ice-witness-repo/dev-docs/adding-video-audio.md`.

---

## Media Processing — Full Rules

### Do NOT use Git LFS

The media pipeline compresses videos to 1-6MB, well under GitHub's 100MB limit. Processed files are committed directly to git. **Never set up Git LFS** — it causes broken pointer files.

### Prerequisites

- **ffmpeg and ffprobe** must be installed (`brew install ffmpeg` on macOS)
- **Python packages**: `pyyaml` and `pillow` in the Python environment from `~/.ice-witness.config`
- Run any pipeline script and it will error with clear messages if something is missing

### How Media Matching Works

Media files are matched to incidents **by filename**. The raw media filename (minus `.raw` suffix and extension) must exactly match the incident filename (minus `.md`).

| Incident File | Raw Media File | Processed Output |
|---------------|---------------|-----------------|
| `docs/incidents/2026-01/15/2026-01-15-aurora-arrest.md` | `raw_media/2026-01/15/2026-01-15-aurora-arrest.raw.mov` | `docs/media/2026-01/15/2026-01-15-aurora-arrest.mp4` |

There is NO `media` field in incident frontmatter. The summary generator auto-detects media by scanning `docs/media/` for matching filenames.

### When the User Says "I Put a Video/Image in raw_media"

1. **List `raw_media/`** to find the file (it will have the user's original filename)
2. **Determine the incident slug** — the slug is the incident markdown filename without `.md` (e.g., `2025-10-27-durango-family-school-route`). The user should provide the incident URL or name. Ask if unclear.
3. **Rename** the file to `<slug>.raw.<ext>` in `raw_media/`:
   ```bash
   mv raw_media/Screen\ Recording* raw_media/2025-10-27-durango-family-school-route.raw.mov
   ```
   **Note:** macOS filenames often contain Unicode narrow no-break spaces (U+202F) before "AM"/"PM". Use shell globs instead of quoting if `mv` with quotes fails.
4. **Only process ONE video file per incident.** If both a `.mov` and `.png` are in `raw_media/`, ask the user which one to use. Do not process both.
5. **Organize into date folders:** `./us-ice-witness-repo/bin/run folderize_media.py --execute`
6. **Process + generate summary:** `./us-ice-witness-repo/bin/run run-media-pipeline.py`
7. **Commit** the compressed files in `docs/media/` and the updated `docs/data/incidents-summary.json`

### What the Pipeline Does

**Videos:**
- Compresses with H.264 (CRF 35, or CRF 30 for high-quality)
- Scales to 720p max height, caps at 30fps
- Crops 8px from all edges (removes screen recording UI artifacts)
- Normalizes audio to EBU R128 standard (-16 LUFS)
- Adds `faststart` flag for web streaming
- **Auto-generates an OG poster image** (1200x630) from frame at 2 seconds

**Images:**
- Converts to optimized JPEG, scales to 1200px max width

### OG Poster Images

Every video automatically gets an OG poster image extracted at the 2-second mark. This image:
- Shows as the video thumbnail/poster while the video loads
- Is used for social media previews
- Filename format: `<slug>-og-2s-<mtime>.jpg`

**To customize the frame timestamp**, edit `docs/data/og-tweaks.md`:
```
2026-01-15-aurora-arrest: 5.5
2026-02-10-denver-courthouse: 8.0
```

**To provide a custom OG image** instead of extracting from video, add a file named `<slug>.raw_og.png` in the same raw_media folder.

### High Quality Video Encoding

For videos needing less compression (documents, text closeups), list slugs in `docs/data/high-quality-videos.md`:
```
2026-01-15-document-closeup
```
These use CRF 30 instead of the default CRF 35.

### Multi-Part Videos

Multiple clips for one incident are concatenated. Use numbered suffixes with a colon:
```
raw_media/2026-01/15/
├── 2026-01-15-aurora-arrest:01.raw.mov
├── 2026-01-15-aurora-arrest:02.raw.mov
└── 2026-01-15-aurora-arrest:03.raw.mov
```
Rules: start at `:01`, no gaps, same extension. Output: single `2026-01-15-aurora-arrest.mp4`.

### Critical Rules

- **NEVER commit raw/uncompressed video to `docs/media/`** — always use the pipeline
- **NEVER set up Git LFS**
- **One video per incident** — don't process both a video and screenshot for the same slug
- Raw files stay in `raw_media/` which is gitignored
- Always commit both `docs/media/` files AND `docs/data/incidents-summary.json`

### Force Reprocess

```bash
./us-ice-witness-repo/bin/run process_media.py --force
./us-ice-witness-repo/bin/run generate_summary.py
```

### Folder Structure

```
raw_media/                              # NOT tracked by git (local only)
└── 2026-01/
    └── 15/
        └── 2026-01-15-aurora-arrest.raw.mov

docs/media/                             # Tracked by git (deployed)
└── 2026-01/
    └── 15/
        ├── 2026-01-15-aurora-arrest.mp4
        └── 2026-01-15-aurora-arrest-og-2s-1234567890.jpg
```

---

## Remember

- **Most instructions are in `us-ice-witness-repo/CONTEXT.md`**
- **Detailed task docs are in `us-ice-witness-repo/dev-docs/`** — read the relevant one for your task
- **Full documentation at https://docs.ice-witness.org**
- This file only contains Colorado-specific information
