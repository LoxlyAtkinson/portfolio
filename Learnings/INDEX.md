# Learnings index

| # | Title | Category | Severity | Session | One line |
|---|---|---|---|---|---|
| 001 | [Blanket rmSync deletes sibling builds](anti-patterns/blanket-rmsync-deletes-sibling-builds.md) | anti-pattern | P1 | 1 | A renderer that wipes its whole output root silently deleted a second build living in it. |
| 002 | [Lead scrim is not banded on mobile](technology-insights/scrollcraft-lead-scrim-not-banded-on-mobile.md) | technology-insight | MEDIUM | 1 | scrollcraft bands a trail scrim below 860px but not a lead one, so a lead-anchored hero measured 1.77:1 on a phone. |
| 003 | [Fix the cause, not the variable you can see](process-improvements/fix-the-cause-not-the-variable-you-can-see.md) | process-improvement | MEDIUM | 1 | Changed the ink on a failing contrast ratio and the number did not move, because the cause was the background. |
| 004 | [gh credential helper uses the active account](problem-resolutions/gh-credential-helper-uses-the-active-account.md) | problem-resolution | MEDIUM | 1 | git push 403 on a multi-account machine: the helper hands git the ACTIVE account's token, not the repo owner's. |
| 005 | [Scan every drive, not just the obvious one](process-improvements/scan-every-drive-not-just-the-obvious-one.md) | process-improvement | P1 | 1 | A sixteen-agent scan rooted at one drive missed a whole second work estate, including a client the user had named. |

## Categories in use

- `anti-patterns/` — things that look reasonable and cause damage
- `problem-resolutions/` — a concrete failure and the fix that worked
- `process-improvements/` — how to work, not what to type
- `technology-insights/` — behaviour of a specific tool or library
