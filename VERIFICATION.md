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
