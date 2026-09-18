---
type: technology-insight
title: The scrollcraft engine bands a trail scrim below 860px but not a lead one, so a lead-anchored hero fails contrast on a phone
severity: MEDIUM
discovered: 2026-09-17
session: 1
tags: [scrollcraft, contrast, accessibility, mobile, scroll]
---

# Problem
A hero using `.sc-copy--lead` with `.sc-scrim--lead` measured **1.77:1 against a
mean of 11.36** at 390px wide. Desktop was 4.12:1. Both fail, the phone badly.

# Root cause
Two things compounding.

1. Below 860px the engine re-anchors `.sc-copy` to the full viewport width. It
   converts `.sc-scrim--trail` to a bottom band for exactly this reason, and
   has a comment explaining why. It does **not** do the same for
   `.sc-scrim--lead`. So a lead-anchored act keeps a bottom-left *corner*
   gradient while its copy now spans the frame.
2. The corner gradient fades out by 72% of the frame. The copy block was six
   text elements tall, which stands well past that. The practical lamp in the
   plate sat under the top line with nothing over it.

A very high mean against a very low worst is the documented signature: the type
is fine nearly everywhere, and one bright patch is uncovered.

# Fix
Trim the hero to four text elements (taste.md refuses more than four anyway),
deepen the lead gradient, and band it below 860px the way the engine bands trail:

```css
@media (max-width: 860px) {
  .sc-scrim--lead {
    background: linear-gradient(to top,
      color-mix(in oklab, var(--sc-canvas) 98%, transparent) 0%,
      color-mix(in oklab, var(--sc-canvas) 94%, transparent) 30%,
      color-mix(in oklab, var(--sc-canvas) 76%, transparent) 55%,
      color-mix(in oklab, var(--sc-canvas) 36%, transparent) 78%,
      transparent 95%);
  }
}
```

Re-measured: 7.24:1 desktop, 14.16:1 phone.

# How to diagnose next time (5 min path)
1. Run the mobile harness pass. Desktop passing proves nothing here.
2. A worst far below the mean means one bright patch, not a global problem.
3. Check whether the copy anchor is lead or trail, and whether the engine bands
   that anchor at your breakpoint. Only trail is banded.
4. Measure the copy block height against where the gradient reaches.

# Prevention
- Always run the 390px pass; this defect is invisible at desktop width.
- Keep hero copy to four elements or fewer, which is a house rule already and
  also keeps the block inside the scrim's reach.

# Related
- `src/cinematic.css`, `VERIFICATION.md`
