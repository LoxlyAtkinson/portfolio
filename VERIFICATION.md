# Verification

Expectations authored BEFORE capture, then ticked against what is actually visible in the
browser. Not ticked against what was intended.

**Target:** https://loxlyatkinson.github.io/portfolio/
**Captured:** 2026-09-17, Chromium at 1280x900 and 390x844, light and dark
**Proof images:** `proof/`

## Checklist, written before the capture

| # | The screenshot must show | Result |
|---|---|---|
| 1 | The page loads at `loxlyatkinson.github.io/portfolio/`, not a 404 | PASS. 200, and a bogus path returns a real 404, not a soft one |
| 2 | The name "Loxly Atkinson" is visible | PASS |
| 3 | The role line reads "Independent AI systems builder, trading as Smart AI Solutions" | PASS, exact string match in the DOM |
| 4 | `loxly@smartaisolutions.co.za` is visible as the contact address | PASS |
| 5 | **No phone number appears anywhere on the page** | PASS. No match for the number in the rendered text or the served HTML |
| 6 | The ledger strip shows the four figures 15, 19, 13 and 1 with their labels | PASS |
| 7 | Nine case study cards appear under "Selected work" | PASS, 9 cards |
| 8 | At least one live client link is visible with a green "Live" pill next to it | PASS, 7 live pills and 15 outbound links |
| 9 | A "What I do not claim" section is present and readable | PASS, 6 items |
| 10 | **The string "56,000" appears nowhere on the page** | PASS, on the rendered text and on the served HTML |
| 11 | The display serif renders as Newsreader, not a Times fallback | PASS, measured against a Georgia control |
| 12 | No horizontal overflow at 1280px wide | PASS, document 1265px in a 1280px window |
| 13 | No horizontal overflow at 390px wide | PASS, zero elements extending past the viewport |
| 14 | A case study page loads and shows its "What this does not prove" section | PASS on `/work/naptosa/` |
| 15 | Dark mode renders with a dark ground and readable contrast | PASS, ground `rgb(14,16,19)` on ink `rgb(241,239,234)` |

**Score: 15 of 15.**

## One defect the checklist did not anticipate, found by eye and fixed

The checklist covered overflow but not legibility, and the first capture of a case study page
showed a real failure it would not have caught. The fact bar used
`grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))`, which put eight cells at roughly
180px each on a 1280px viewport. The labels are full sentences rather than captions, so every one
of them broke to a single word per line, one label running to eleven lines.

No automated gate would have caught this. It was visible immediately on reading the rendered page.
Fixed at `265px`, single column below 640px, with the source line pinned to the bottom of each
cell so cells with labels of different lengths still align. Re-verified after deploy: four columns
of 315px, longest label now two lines.

Recorded here rather than quietly corrected, because the point of the checklist is that a miss
gets written down.

## Automated gates, all passing

`node build/verify.mjs` over 10 rendered pages:

- No em dash or en dash in visible text on any page.
- No banned claim on any page: no member counts, no percentage outcomes, no testimonials, no trust
  badges, no tool without evidence on disk, no title never held.
- Every external link on the approved-host list.
- Every internal link resolves to a real file.
- Exactly one `<title>`, one meta description and one `<h1>` per page.
- Every case study carries its honest-limits section.

## Live route smoke test, 2026-09-17

All returned 200 under redirects:

```
/  /work/eden-fm/  /work/naptosa/  /work/trio-data/  /work/kuils-river-doctors/
/work/sales-crm/  /work/pisa-assessments/  /work/omnimarketer/
/work/smart-ai-solutions/  /work/century-club/  /sitemap.xml  /styles.css
```

Control: `/this-does-not-exist` returned 404, so the 200s above are real routes and not a
catch-all shell.

---

# The cinematic version

**https://loxlyatkinson.github.io/portfolio/cinematic/**

Verified 2026-09-17 with the scroll-craft harness on localhost, then again in a
real browser against the live origin. The harness walks each act at six scroll
positions and measures contrast on the composited page, which is the only way
to check a page that has a different frame at every scroll position.

## Three harness passes, all clean

| Pass | Dead scroll | Frozen clip | Contrast | Console errors | Failed requests |
|---|---|---|---|---|---|
| Desktop 1280 | none | none, clip advances 0 to 5.03 | all cues clear 4.5:1 at their worst frame | 0 | 0 |
| Phone 390 | none | none | all cues clear 4.5:1 at their worst frame | 0 | 0 |
| Reduced motion | none | no clip fetched, correct | all cues clear 4.5:1 | 0 | 0 |

## Two defects the first pass found, both fixed

**The hero copy failed contrast on both viewports.** 4.12:1 at 1280 and
**1.77:1 at 390 against a mean of 11.36**, which is the documented signature of
one bright patch with nothing covering it: the practical lamp in the plate sat
directly under the top line.

The first fix was wrong. Brightening the type did nothing, because the problem
was the block, not the ink. The hero carried an h1, a display title, a five row
label table and two links, which is more than four text elements and something
taste.md refuses outright. The engine's lead corner gradient is tuned for a
short block and fades out by 72%, so the copy simply stood taller than the
scrim reached. Fixed by trimming the hero to four elements, deepening the
gradient, and banding it below 860px, which is what the engine already does for
a trail anchor and does not do for a lead one.

Re-measured: **7.24:1 desktop, 14.16:1 phone.**

**The facts grid left empty trailing cells.** Six items in an auto-fit grid
resolved to four columns at desktop, so two cells sat empty. Replaced with
explicit column counts, because six divides by both three and two and every row
then fills.

## The pan rail overflow, checked by hand

`devices.md` is explicit that the harness cannot catch a rail that does not
overflow, and reports it as healthy. Measured from the report instead: the rail
travels **3,076px at 1280** and **2,869px at 390**, both far above the half a
viewport floor. The act is real travel, not a pinned still.

## Live browser verification, on the deployed origin

Checklist written before the capture, ticked against what the browser reported.

| # | Must be true on the live URL | Result |
|---|---|---|
| 1 | All ten pages return 200, a bogus path returns a real 404 | PASS |
| 2 | The hero clip has a source and its playhead advances on scroll | PASS, 0 to 3.00 of 5.04 |
| 3 | The ledger stamps rows as the reader passes each system | PASS, 6 stamped by the collection act, 8 by the peak |
| 4 | At the peak the rail becomes the gate and all 25 gates run | PASS, 25 rows on |
| 5 | G21 reads REFUSED and the verdict is visible | PASS, `gate:refused` |
| 6 | The close holds with content, headshot loaded | PASS, opacity 1, image loaded |
| 7 | No console errors and no failed requests | PASS, zero of each |
| 8 | No horizontal overflow | PASS |
| 9 | The plain version is unaffected | PASS, still 200 |

## The feel check

Run against the contact sheets, then diffed against BRIEF.md.

| Act | Intended | Felt | |
|---|---|---|---|
| 1 | Stillness | stillness | matches |
| 2 | Recognition | recognition | matches |
| 3 | Breadth | breadth | matches |
| 4 | Weight | **brisk** | **diff** |
| 5 | Silence | silence | matches, and reads as authored |
| 6 | Refusal | refusal | matches, and it is the peak |
| 7 | Restraint | restraint | matches |
| 8 | Arrival | arrival | matches, and it resolves |

**One honest diff.** Act 4 was meant to land as weight and reads as brisk. At
1.4 viewport-heights the counted figures pass faster than they should for
material that is supposed to feel heavy. It is left as built rather than
padded, because the alternative is spending scroll on information rather than
experience, which feel.md warns against. Recorded rather than quietly
reconciled.

The peak holds 14 of 53 sample positions, the most of any act, and is the
largest visual change on the sheet. The act in front of it is deliberately
almost empty.

## What is not covered

- **A real phone.** Headless Chrome cannot reproduce an iOS video decoder, its
  autoplay policy, or Low Power Mode. The engine carries the priming logic for
  this and it is unmodified, but a green run here says nothing about iOS.
- **Keyboard traversal of the pinned peak** was not asserted. The peak carries
  no focusable control, so the documented pinned-act focus trap does not apply,
  but it was not tested.
