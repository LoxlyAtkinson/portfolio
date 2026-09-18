---
type: process-improvement
title: My first contrast fix changed the variable I could see instead of the cause, and the measured number did not move
severity: MEDIUM
discovered: 2026-09-17
session: 1
tags: [contrast, debugging, verification, css]
---

# Problem
A hero line measured 4.12:1. I changed its colour from `--sc-ink-soft` to
`--sc-ink`, rebuilt, re-ran the harness, and got **4.12:1 again**. A full
harness cycle, about four minutes, spent on a change that could not have worked.

# Root cause
The failing measurement is a ratio between ink and the background composited
under it. I reasoned about the ink because the ink was the thing I had a
variable for. The actual cause was the other side of the ratio: a copy block
taller than the scrim reached, over a plate with a bright lamp in it.
Brightening light text sitting on a bright patch moves the ratio barely at all.

verify.md states the general tell plainly and I did not apply it: **if a
contrast number is unchanged after a real change, stop tuning and check what is
actually being composited.**

# Fix
Read the second number. `worst 1.77, mean 11.36` says the type is fine nearly
everywhere and one patch is uncovered. That points at the background, not the
ink. Fixed by shortening the copy block and extending the scrim.

# How to diagnose next time (1 min path)
1. Look at worst AND mean together before touching anything. A large gap means a
   local bright patch; a low mean means a global problem.
2. Low mean, change the ink. Large gap, change what sits under the ink.
3. If a measured number is byte-identical after a real change, you changed
   something that is not in the measurement. Stop and re-read what is measured.

# Prevention
- Never make a second attempt at a measured failure without a hypothesis that
  explains why the first attempt did nothing.
- State which side of a ratio you are changing, and why, before editing.

# Related
- `VERIFICATION.md`, `src/cinematic.css`
