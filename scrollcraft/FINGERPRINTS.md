# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|

*(empty: your first build has nothing to clear, so build whatever the interview
points at. From the second onwards, this table is the constraint.)*

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

Nothing is taken yet.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.

---

## The registry

| # | Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **cinematic-portfolio** (Loxly Atkinson) | Gallery / catalog | A fixed left-edge ledger rail that is simultaneously the index, a running receipt and, at the peak, the deploy gate. No bar, no wordmark-plus-CTA. Becomes a bottom strip under 1040px | `scrub`, but as gallery's object one: the first object already in view and already labelled, with no separate title stage and no hero claim | 8 acts, 15.0vh: scrub 2.6, flow 1.0, pan 3.6, flow+count 1.4, silence 0.7, **pin 3.4 (peak)**, flow 1.0, pin 1.3. Six device families, none twice in a row, one scrub | An inquiry plate typeset exactly like an object label, with the real headshot. Cue holds on one value. No magnet, no spotlight | **The ledger.** It stamps each system's observed HTTP status as you pass it, keeps every line, and at the peak turns into the 25-gate deploy pipeline that runs under the reader's hand and refuses to ship at G21 | Low-key cinematic: real working South African interiors at night, one warm practical per frame | 4520 |

**First row in this registry, so the gate had nothing to clear.** Recorded here
so the next build has to differ from it on at least 4 of the 6 dimensions.

What a future build should expect to have to avoid: the gallery grammar, a rail
that doubles as nav and record, an act sequence that opens on `scrub` and closes
on a short `pin`, and any signature move built on accumulating receipts.
