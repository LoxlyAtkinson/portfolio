# Session log

Append only. Newest entry at the bottom.

---

## [2026-09-17] session | Session 1 -- Personal portfolio, evidence build then cinematic build

**Duration:** ~7h
**NLM Notebook:** 43e287cd-f04b-4b30-83f3-474bce459e77
**NLM Note:** see project-config.json

### Accomplished

**Both builds are live, public and verified.**

1. **Evidence portfolio** at `https://loxlyatkinson.github.io/portfolio/`
   (public repo `LoxlyAtkinson/portfolio`, Pages from `main` + `/docs`).
   Overview page plus nine flagship case studies. Content came from a
   provenance-checked scan of the whole work estate run by 16 agents across two
   workflows, synthesised into a 94KB master dossier, then written by nine
   writers and re-checked by nine independent fact checkers before shipping.
2. **Cinematic version** at `.../portfolio/cinematic/`, ten scroll-driven pages
   built with the `scroll-craft` skill, reading the SAME `content/` files so a
   claim corrected in one is corrected in both.
3. **`build/verify.mjs`**, a real build gate over all 20 pages. Fails on
   unsourced client numbers, percentage outcomes, testimonials, trust badges,
   tools with no evidence on disk, titles never held, em and en dashes,
   unapproved link hosts, broken internal links, and any case study missing its
   honest-limits section.

### Pending

- **The 56,000 NAPTOSA figure has no source.** Owner chose "build now, source
  after". It is off the portfolio with a marked slot waiting, and it is STILL
  LIVE in the CV corpus including CV #37 awaiting submit.
- **Ash Electronics inclusion ruling.** The bio marks it deliberately excluded,
  but the site is live with a lead CRM and 34 routes. Exclusion and evidence
  contradict each other.
- **Three unrotated credential sets** found during the scan. See Recovery
  Obligations in SESSION_STATE.md.
- Act 4 of the cinematic page reads as brisk rather than weighty. Left as built
  rather than padded with filler scroll.

### Decisions

- **Primary reader is a hiring manager**, not a client. Positioning is
  "builds and ships AI systems", not Head of AI and not pre-sales.
- **Self-framing is "independent AI systems builder, trading as Smart AI
  Solutions".** Note this was a page-level choice: the corpus permits "Founder"
  on marketing and bans it only on job applications.
- **Clients named only where the work is publicly visible at their own domain**,
  outcomes only, zero internals. Signed NDAs exist on disk for Trio Data and
  NAPTOSA; owner ruled that an NDA protects confidential information, not the
  existence of the relationship.
- **No phone number on a public page.** Email is `loxly@smartaisolutions.co.za`,
  which is live on his own contact page.
- **The Colium client is anonymised** as "a South African IT retailer", per its
  own confidentiality marking.
- **Cinematic grammar is gallery / catalog**, chosen over the other seven with
  reasons recorded in the brief. Filmic one-shot was rejected because it forbids
  an index and more than one entry point, and this is a ten-page site.
- **Gate names are read from real source**, not invented. Three labels altered
  and the renderer records which and why.

### Key Files Modified

- `content/profile.json` -- identity, career, capabilities, supporting work
- `content/cases/*.json` -- nine fact-checked case studies
- `build/render.mjs` -- evidence renderer; rmSync scoped to its own files
- `build/render-cinematic.mjs` -- cinematic renderer, self-sufficient
- `build/verify.mjs` -- the claim gate
- `src/styles.css`, `src/cinematic.css` -- two design systems
- `src/cinematic-assets/` -- generated world plus the engine, committed
- `VERIFICATION.md` -- both verification passes with measured numbers
- `scrollcraft/builds/cinematic-portfolio/BRIEF.md` -- the interview and score
- `scrollcraft/FINGERPRINTS.md` -- registry row 1

### Environment State

- Services: none running. The port 4520 preview server was stopped at close.
- Git: branch `main`, working tree clean, 5 commits this session, all pushed.
- Build: `node build/render.mjs && node build/render-cinematic.mjs && node build/verify.mjs` all pass. 20 pages checked, all gates green.
- Live: all 22 routes return 200; bogus paths return real 404s.

### Next Session

1. **Get the 56,000 source** or cut the figure from the CV corpus too. It is a
   live credibility risk on applications going out now.
2. **Rule on Ash Electronics** so the site can either name it or keep excluding
   it deliberately.
3. **Rotate the three credential sets.**

### Lint

Wiki lint not run: `.wiki/` created this session and the lint hook targets an
existing vault structure. See sync receipt.
