---
type: process-improvement
title: A scan rooted at Desktop/Projects missed an entire second work estate on the D drive, including a client the user had explicitly named
severity: P1
discovered: 2026-09-17
session: 1
tags: [discovery, search, scoping, windows]
---

# Problem
The user named six clients to cover. Five were found. The sixth, "Get it done",
returned nothing: no folder, no repo on either GitHub account, and only two
incidental prose matches for the phrase across a full-text grep. It was reported
as unlocated.

The answer was one path: `D:\Projects\Loxly - Resources\My-Work\colium-crm-platform`.
That directory also holds `Client-Sites/`, containing the **live production
trees** for five clients, two of which had already been written up from their
less-current copies on C:.

# Root cause
Every search was rooted at `C:\Users\loxly\Desktop\Projects`, because that is
the working directory and where the other projects live. Drives were never
enumerated.

A sixteen-agent scan searching exhaustively inside the wrong root is still a
scan of the wrong root, and its thoroughness makes the gap MORE convincing
rather than less: "we searched hard and found nothing" reads as "it does not
exist".

# Fix
Enumerate drives before concluding something is absent.

```bash
ls -1 /c/ /d/ /e/ 2>/dev/null
ls -1 "/d/Projects" 2>/dev/null
find /d/Projects -maxdepth 3 -name ".git" -type d 2>/dev/null | head -60
```

Then re-scan the newly found root properly. Here that took one extra workflow
and turned up the client, plus better source trees for two others.

# How to diagnose next time (2 min path)
1. The user names a thing you cannot find. Do NOT conclude it is absent.
2. Enumerate drives and every plausible root first.
3. Only then ask, and ask for a path rather than a description.

# Prevention
- "Not found" is a statement about where you looked. Say where you looked when
  reporting it, so the user can spot the wrong root immediately.
- On Windows, treat a single-drive search as incomplete by default.

# Related
- `scrollcraft/builds/cinematic-portfolio/BRIEF.md`
- Evidence dossier clusters `colium-crm.md`, `client-sites-live.md`
