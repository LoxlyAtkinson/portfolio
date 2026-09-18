---
type: anti-pattern
title: A renderer that rmSyncs its whole output directory silently deletes every sibling build in it
severity: P1
discovered: 2026-09-17
session: 1
tags: [build, static-site, data-loss, github-pages]
---

# Problem
`build/render.mjs` opened with `rmSync(DOCS, { recursive: true, force: true })`
to get a clean output. That was harmless while `docs/` held one build. The
moment a second renderer wrote `docs/cinematic/`, running the first renderer
deleted the second build's HTML, its engine and all 13 of its assets. Nothing
errored. The next `verify.mjs` run just reported broken internal links, which
reads like a bad href rather than a wiped directory.

# Root cause
The renderer treated the whole output directory as its own. It is not: it is a
shared publish root, and `docs/` is what GitHub Pages serves. Ownership is
per-path, not per-directory.

# Fix
Remove only the paths the script actually writes:

```js
for (const f of ['index.html', 'styles.css', 'sitemap.xml', 'robots.txt']) {
  const p = join(DOCS, f)
  if (existsSync(p)) rmSync(p)
}
rmSync(join(DOCS, 'work'), { recursive: true, force: true })
```

And make each renderer self-sufficient, so a wipe is recoverable: the cinematic
renderer now copies its own engine and assets from a committed
`src/cinematic-assets/`, and `rm -rf docs/cinematic && node build/render-cinematic.mjs`
reproduces it from nothing.

# How to diagnose next time (2 min path, not 20)
1. Broken internal link to a path you know you wrote? `ls` the directory before
   assuming the href is wrong.
2. `git status` on the publish root. A wipe shows as mass deletions.
3. Grep every build script for `rmSync`, `rimraf`, `rm -rf` against a shared
   output root.

# Prevention
- A build script may delete only paths it writes. Never the root.
- Every generated directory must be reproducible from committed source, so a
  wipe costs a rebuild rather than the assets.
- Run the full build chain, not just the script you edited, before verifying.

# Related
- `build/render.mjs`, `build/render-cinematic.mjs`
- Commit 46926ba
