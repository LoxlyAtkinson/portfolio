# SESSION STATE — Loxly Atkinson, personal portfolio

**Last saved:** 2026-09-17 (Session 1)
**Repo:** https://github.com/LoxlyAtkinson/portfolio (PUBLIC)
**NLM notebook:** `43e287cd-f04b-4b30-83f3-474bce459e77`

---

## START HERE

Both builds are **shipped, live and verified**. Nothing is half-finished. The
open items are all decisions only the owner can make.

| Surface | URL | State |
|---|---|---|
| Evidence portfolio | https://loxlyatkinson.github.io/portfolio/ | LIVE, 10 pages, all 200 |
| Cinematic version | https://loxlyatkinson.github.io/portfolio/cinematic/ | LIVE, 10 pages, all 200 |

**Goal (authoritative):** no goal bundle and no writing-plans arc exists for this
project. The work was a direct build request, completed. See "Next session"
below for the three open owner decisions.

**Do not** weaken `build/verify.mjs` to make copy fit. It is the mechanical
enforcement of the claim ledger and it has already caught four real breaches.

---

## Immediate next actions

1. **The 56,000 NAPTOSA figure.** It failed verification: it traces to two lines
   of the owner's own speaker notes, is contradicted three times in the same
   repo, and the 50,000+ variant was stripped off NAPTOSA's live homepage on
   2026-09-12 as unsourced with a gate added to keep it off. The owner said he
   can source it and chose "build now, source after". It is OFF both sites with
   a marked slot waiting. **It is still live in the CV corpus, including CV #37
   awaiting submit.** Either produce the source or cut it there too.
2. **Ash Electronics: in or out?** The bio marks it DELIBERATELY EXCLUDED by
   owner instruction, but that exclusion was written about an e-commerce
   framing. The site is live with a lead CRM, an inline CMS and 34 routes. The
   exclusion and the evidence contradict each other.
3. **Rotate three credential sets** (see Recovery Obligations).

---

## What was built

- **Evidence portfolio.** Overview plus nine case studies, sourced from a
  provenance-checked scan of the whole estate: 16 agents across two workflows
  produced an 94KB master dossier, then nine writers drafted case studies and
  nine independent fact checkers re-verified every number before shipping.
- **Cinematic version.** Ten scroll-driven pages, `scroll-craft` skill, gallery
  grammar, eight acts over 15 viewport-heights. Signature move is the ledger
  rail that stamps observed HTTP statuses and becomes the 25-gate deploy
  pipeline at the peak, refusing at G21. World generated with Higgsfield, 31
  credits.
- **`build/verify.mjs`.** A real gate over all 20 pages.

## Architecture notes for the next session

- `content/profile.json` and `content/cases/*.json` are the single source of
  truth for BOTH renderers. Correct a claim once, it corrects everywhere.
- `build/render.mjs` deletes only its own outputs. Do not restore a blanket
  `rmSync(DOCS)`; it wipes the cinematic build (Learning 001).
- `build/render-cinematic.mjs` copies its own engine and assets from
  `src/cinematic-assets/`, so `docs/cinematic/` rebuilds from nothing.
- Preview on port **4520** (`node <skill>/scripts/serve.mjs --root docs/cinematic --port 4520`).
- **Pushing needs the right gh account** (Learning 004): `gh auth switch --user LoxlyAtkinson`
  before push, switch back after.

## Environment at save

- Services: none. Port 4520 preview stopped.
- Git: `main`, working tree clean, 5 commits, all pushed.
- Build: render + render-cinematic + verify all pass. 20 pages, all gates green.
- gh active account: restored to `WebConsoleP`.

---

## Task List Snapshot

> For the next session: no tasks to recreate.

**No TaskCreate tasks were opened this session.** The work ran as two
build-and-verify arcs driven directly from the user's requests, with decisions
taken through `AskUserQuestion` rather than tracked as tasks. There is nothing
to rebuild and nothing to reality-check.

| ID | Status | Subject | BlockedBy |
|----|--------|---------|-----------|
| — | — | (none) | — |

---

## Pending Recovery Obligations

- **type:** `pinecone-sync`
  **severity:** LOW
  **artifact/path:** `~/.claude/state/pinecone-sync-ledger.json`
  **reason:** last delta sync stamped `2026-09-15T04:12:07Z`, which is roughly
  3 days stale against a daily 06:12 cron. The cron may not be firing.
  **next command or action:** check the 06:12 daily brain-maintenance cron is
  scheduled and succeeding. Do NOT run an inline sync.
  **blocking:** NO

- **type:** `nlm-noteid-null`
  **severity:** LOW
  **artifact/path:** `.claude/project-config.json` → `notebookLm.sessions[0].noteId`
  **reason:** notebook was created this session; the note ID is recorded after
  the note is posted. If it is still `null` on resume, the note did not post.
  **next command or action:** `PYTHONIOENCODING=utf-8 nlm note list 43e287cd-f04b-4b30-83f3-474bce459e77`
  and record the ID, or re-post.
  **blocking:** NO

### Not a save obligation, but open and real

**Three unrotated credential sets**, found during the estate scan and recorded
in the master dossier's do-not-publish list. None of them touches either site.

1. Plaintext live FTP credentials hardcoded in the ASH Electronics deploy script.
2. Plaintext live FTP credentials hardcoded in the Computer Complex deploy script.
3. Client production database credentials in plaintext in four Ace Consulting
   evidence files (gitignored, blocked from deploy, not rotated).

Detail lives in `Job Workflow Orchestrator/_Portfolio/evidence/MASTER-DOSSIER.md`
section 7A. **Do not copy the credentials anywhere.**

---

## Active loop

None. No `/loop` was armed this session and no `.claude/state/active-loop.json`
exists.
