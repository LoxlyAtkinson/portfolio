---
type: problem-resolution
title: git push returned 403 because the gh credential helper resolves to the ACTIVE gh account, not the repo owner
severity: MEDIUM
discovered: 2026-09-17
session: 1
tags: [git, github, gh-cli, multi-account, auth]
---

# Problem
```
remote: Permission to LoxlyAtkinson/portfolio.git denied to WebConsoleP.
fatal: ... The requested URL returned error: 403
```
It happened twice in one session, on a repo that had been created and pushed to
successfully minutes earlier.

# Root cause
Two gh accounts are authenticated on this machine: `WebConsoleP`, the default
active one, and `LoxlyAtkinson`, who owns this repo. `gh auth git-credential`
hands git a token for whichever account is **active**, regardless of which repo
is being pushed to. The first push worked because `gh repo create --push` ran
while LoxlyAtkinson was active. Later pushes failed because the active account
had been deliberately switched back to WebConsoleP to leave machine state as
found.

# Fix
```bash
gh auth switch --user LoxlyAtkinson
git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin main
gh auth switch --user WebConsoleP
```
The empty `-c credential.helper=` clears any inherited helper first, so the gh
one is the only one consulted.

# How to diagnose next time (30 s path)
1. Read the error. It names both accounts: denied **to WebConsoleP** for a repo
   owned by **LoxlyAtkinson**.
2. `gh api user -q .login` shows which is active.
3. It is never a permissions problem on the repo. It is the wrong identity.

# Prevention
- On a multi-account machine, check the active login against the repo owner
  before any push to a non-default account's repo.
- If the active account is restored for tidiness, expect the next push in the
  same session to fail, and switch around it.

# Related
- Commits 46926ba, 0361faf
