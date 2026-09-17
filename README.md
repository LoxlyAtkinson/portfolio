# Loxly Atkinson, portfolio

Source for the personal portfolio at **https://loxlyatkinson.github.io/portfolio/**

Independent AI systems builder, Cape Town. Nine flagship case studies plus supporting work,
built from a provenance-checked evidence scan of the actual project repositories rather than
from memory.

## How it is built

`content/` is the single source of truth. `docs/` is generated and is never hand edited.

```
content/profile.json      identity, career, capabilities, supporting work
content/cases/*.json      one file per flagship case study
src/styles.css            the whole design system, one file
build/render.mjs          renders content into docs/
build/verify.mjs          the build gate, see below
docs/                     what GitHub Pages serves
```

```bash
node build/render.mjs     # render
node build/verify.mjs     # gate, exits non-zero on any breach
```

## The build gate

`verify.mjs` fails the build on anything that breaches the claim rules. It is not decoration.
Every rule traces to a binding ruling in the evidence dossier:

- **No em dashes or en dashes** anywhere in visible text. House style, asserted mechanically.
- **No unsourced client numbers.** The NAPTOSA member count, Eden FM audience figures,
  OmniMarketer contact counts and Trio Data placement counts are all banned by name, because
  each is either unmeasured or contradicted in its own source repository.
- **No percentage outcome claims.** No efficiency, uplift, reduction or resolution percentage
  has been measured for any client, so none may appear.
- **No testimonials.** None exists on file for any client.
- **No unsupported trust badges.** SOC 2, ISO 27001 and similar.
- **No tool listed without evidence on disk.** HubSpot, Salesforce, Jira, Tableau, Power BI and
  others are banned by name after one shipped falsely on a CV.
- **No title never held**, and no certification never earned.
- **Every external link must be on the approved-host list**, meaning it returned HTTP 200 on
  17 September 2026 and carries no confidentiality bar.
- **Every internal link must resolve** to a real file.
- **Every case study must carry its "what this does not prove" section.**

If a claim cannot be traced to counted source or a live URL, the gate is the thing that stops it
shipping.

## Client naming

Clients are named only where the work is publicly visible at the client's own domain. Everything
else is described by sector. No client staff member is named anywhere. No client security finding,
credential, commercial term or internal blocker appears on the site or in this repository.

## Licence

Content and copy are the author's. The code is unremarkable and may be reused.

## The cinematic version

**https://loxlyatkinson.github.io/portfolio/cinematic/**

A scroll-driven version of the same content, built with the `scroll-craft`
skill. It does not replace the pages above. The plain version is what a hiring
manager scans in twenty seconds; this one is an experience, and it reads from
exactly the same `content/` files, so a claim corrected in one is corrected in
both.

```
src/cinematic.css          the theme and the page-local classes
src/cinematic-assets/      generated stills, the hero clip, the engine
build/render-cinematic.mjs renders docs/cinematic/ from nothing
scrollcraft/               the brief, the build folder, the fingerprint registry
```

```bash
node build/render-cinematic.mjs
node build/verify.mjs          # the same claim gate runs over these pages too
```

**Grammar:** gallery / catalog. The page is a walkable collection of objects
with museum labels, not an argument. Eight acts, 15 viewport-heights, six device
families, one scrub clip.

**The signature move is the ledger.** The rail down the left edge is the
navigation, and it is also a running receipt: it stamps each system's observed
HTTP status as you pass it and keeps every line. At the peak it stops being an
index and becomes the deploy pipeline, twenty five gates running under the
reader's hand, refusing to ship at G21.

**The gate names are real.** They are read from `scripts/deploy-guarded.py` in
the NAPTOSA repository, which has exactly twenty five gate functions. Three
labels are altered and the renderer says which and why: two named client
infrastructure and one used first person plural, which the claim gate bans on a
solo practice. No gate is invented.

**World:** low-key cinematic. Real working South African interiors at night, one
warm practical light per frame, nobody in shot. Generated with Higgsfield
(Cinema Studio Image 2.5 for stills, Cinema Studio Video for the one camera
move) at a cost of 31 credits, including four rerolls. The headshot is a real
photograph and is not generated.

