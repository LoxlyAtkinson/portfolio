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
