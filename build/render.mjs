#!/usr/bin/env node
/**
 * Renders the portfolio into docs/ for GitHub Pages.
 * Single source of truth: content/profile.json and content/cases/*.json.
 * Nothing in docs/ is hand edited.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(ROOT, 'docs')

const profile = JSON.parse(readFileSync(join(ROOT, 'content/profile.json'), 'utf8'))

const CASE_ORDER = [
  'eden-fm', 'naptosa', 'trio-data', 'kuils-river-doctors', 'sales-crm',
  'pisa-assessments', 'omnimarketer', 'smart-ai-solutions', 'century-club',
]

const caseDir = join(ROOT, 'content/cases')
const cases = CASE_ORDER
  .map(slug => {
    const p = join(caseDir, `${slug}.json`)
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
  })
  .filter(Boolean)

/* ------------------------------------------------------------------ utils */

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const host = u => { try { return new URL(u).host.replace(/^www\./, '') } catch { return u } }

const HEAD = (title, desc, depth) => {
  const base = depth === 0 ? '' : '../'.repeat(depth)
  return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="Loxly Atkinson">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name" content="Loxly Atkinson">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#9632;</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>`
}

const FOOT = (depth) => {
  const base = depth === 0 ? '' : '../'.repeat(depth)
  return `<div class="wrap">
<footer class="foot">
  <span>Loxly Atkinson, Cape Town. Built and published by hand.</span>
  <span>Every link verified 17 September 2026. <a href="${base}index.html">Back to the top</a></span>
</footer>
</div>
</body>
</html>`
}

const liveLink = (url, label) => url
  ? `<a class="extlink" href="${esc(url)}" target="_blank" rel="noopener">${esc(label || host(url))}</a>`
  : ''

/* --------------------------------------------------------------- homepage */

function renderHome () {
  const p = profile
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.role,
    email: `mailto:${p.email}`,
    url: 'https://loxlyatkinson.github.io/portfolio/',
    sameAs: [p.linkedin],
    address: { '@type': 'PostalAddress', addressLocality: 'Cape Town', addressCountry: 'ZA' },
    knowsLanguage: ['en', 'af'],
  }

  const workCards = cases.map(c => `
      <article class="card">
        <div class="card-top">
          <h3><a href="work/${esc(c.slug)}/">${esc(c.title)}</a></h3>
        </div>
        <div class="meta">${esc(c.client)} &middot; ${esc(c.sector)}</div>
        <p>${esc(c.summary.split('. ')[0])}.</p>
        <div class="card-foot">
          <span class="pill${c.status.toLowerCase().startsWith('live') ? ' live' : ''}">${esc(c.status)}</span>
          ${c.liveUrl ? liveLink(c.liveUrl, c.liveLabel) : ''}
        </div>
      </article>`).join('')

  const ledger = p.ledger.map(l => `
      <div class="ledger-cell">
        <span class="n">${esc(l.value)}</span>
        <span class="l">${esc(l.label)}</span>
        <span class="s">${esc(l.note)}</span>
      </div>`).join('')

  const practice = p.howIWork.items.map(i => `
      <div>
        <h3>${esc(i.heading)}</h3>
        <p>${esc(i.body)}</p>
      </div>`).join('')

  const bounds = p.notClaimed.items.map(i => `<li>${esc(i)}</li>`).join('\n        ')

  const also = p.alsoShipped.items.map(i => `
      <div class="entry">
        <h3>${esc(i.name)}</h3>
        <div class="meta">${esc(i.sector)}</div>
        <p>${esc(i.body)}</p>
        ${i.url ? liveLink(i.url, i.urlLabel) : `<div class="meta" style="margin-top:.65rem">${esc(i.urlLabel)}</div>`}
      </div>`).join('')

  const roles = p.career.map(r => `
      <div class="role">
        <div class="when">${esc(r.period)}</div>
        <div>
          <h3>${esc(r.title)}</h3>
          <div class="org">${esc(r.org)}, ${esc(r.place)}</div>
          <p>${esc(r.body)}</p>
        </div>
      </div>`).join('')

  const edu = p.education.map(e => `<div class="row"><b>${esc(e.what)}</b><span>${esc(e.detail)}</span></div>`).join('\n      ')

  const caps = p.capabilities.map(c => `
      <div class="grp">
        <h3>${esc(c.group)}</h3>
        <ul>${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`).join('')

  const pubs = p.published.items.map(i => `
      <li><a href="${esc(i.url)}" target="_blank" rel="noopener">
        <span class="t">${esc(i.name)}</span>
        <span class="u">${esc(host(i.url))}${esc(new URL(i.url).pathname.replace(/\/$/, ''))}</span>
      </a></li>`).join('')

  return `${HEAD(
    `${p.name}, ${p.role}`,
    `${p.name} builds and ships production AI and automation systems on his own, from Cape Town. Fifteen live systems across nineteen sectors, every number counted from source.`,
    0
  )}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>

<header class="masthead">
  <div class="wrap">
    <span class="eyebrow">${esc(p.location)}</span>
    <h1>${esc(p.headline.replace(' and watch what breaks.', ''))} and <em>watch what breaks.</em></h1>
    <div class="identity">
      <span class="who">${esc(p.name)}</span>
      <span>${esc(p.role)}, trading as ${esc(p.practice)}</span>
      <a href="mailto:${esc(p.email)}">${esc(p.email)}</a>
      <a href="${esc(p.linkedin)}" target="_blank" rel="noopener">${esc(p.linkedinLabel)}</a>
    </div>
    <div class="lede">
      ${p.intro.map(t => `<p>${esc(t)}</p>`).join('\n      ')}
    </div>
  </div>
</header>

<div class="ledger">
  <div class="ledger-grid">${ledger}
  </div>
</div>

<main id="main">

<section>
  <div class="wrap">
    <div class="sec-head">
      <h2>Selected work</h2>
      <span class="count">${cases.length} case studies</span>
    </div>
    <p class="sec-intro">Nine builds in depth. Each one has its own page covering what it does, what was hard about it, and what it does not prove. Every figure is counted from source.</p>
  </div>
  <div class="wrap">
    <div class="work">${workCards}
    </div>
  </div>
  <div class="wrap"><div class="sec-body" style="padding-top:1.5rem"></div></div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head"><h2>How I work</h2></div>
    <p class="sec-intro">${esc(p.howIWork.intro)}</p>
    <div class="practice">${practice}
    </div>
    <div class="sec-body" style="padding-top:1.5rem"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head"><h2>What I do not claim</h2></div>
    <p class="sec-intro">${esc(p.notClaimed.intro)}</p>
    <div class="bounds">
      <ul>
        ${bounds}
      </ul>
    </div>
    <div class="sec-body" style="padding-top:1.5rem"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head">
      <h2>Also shipped</h2>
      <span class="count">${p.alsoShipped.items.length} more</span>
    </div>
    <p class="sec-intro">${esc(p.alsoShipped.intro)}</p>
    <div class="stack-list">${also}
    </div>
    <div class="sec-body" style="padding-top:1.5rem"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head"><h2>Published work</h2></div>
    <p class="sec-intro">${esc(p.published.intro)}</p>
    <ul class="pubs">${pubs}
    </ul>
    <div class="sec-body" style="padding-top:1.5rem"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head"><h2>Tools in production use</h2></div>
    <p class="sec-intro">Everything listed here appears in shipped source on at least one of the systems above. Nothing is listed on the strength of having read about it.</p>
    <div class="caps">${caps}
    </div>
    <div class="sec-body" style="padding-top:1.5rem"></div>
  </div>
</section>

<section class="plain">
  <div class="wrap">
    <div class="sec-head"><h2>Before this</h2></div>
    <div class="cv">${roles}
    </div>
    <div class="sec-head" style="padding-top:2.5rem"><h2>Education</h2></div>
    <div class="edu">
      ${edu}
    </div>
    <div class="sec-body"></div>
  </div>
</section>

</main>

<section class="contact">
  <div class="wrap">
    <h2>Everything here is live and I will walk you through any of it.</h2>
    <p>${esc(p.quote)}</p>
    <div class="links">
      <a href="mailto:${esc(p.email)}">${esc(p.email)}</a>
      <a href="${esc(p.linkedin)}" target="_blank" rel="noopener">${esc(p.linkedinLabel)}</a>
      <span style="font-family:var(--mono);font-size:.86rem;opacity:.65">${esc(p.location)}, UTC+2</span>
    </div>
  </div>
</section>

${FOOT(0)}
`
}

/* ------------------------------------------------------------ case studies */

function renderCase (c, i) {
  const prev = cases[i - 1]
  const next = cases[i + 1]

  const facts = (c.numbers || []).map(n => `
      <div class="fact">
        <span class="n">${esc(n.value)}</span>
        <span class="l">${esc(n.label)}</span>
        <span class="src">${esc(n.source)}</span>
      </div>`).join('')

  const built = (c.whatIBuilt || []).map(b => `
      <h3>${esc(b.heading)}</h3>
      <p>${esc(b.body)}</p>`).join('')

  const proof = (c.proof || []).length ? `
<section>
  <div class="wrap">
    <div class="sec-head"><h2>How it was proven</h2></div>
    <ul class="checks">
      ${c.proof.map(p => `<li>${esc(p)}</li>`).join('\n      ')}
    </ul>
    <div class="sec-body"></div>
  </div>
</section>` : ''

  return `${HEAD(
    `${c.title}, ${c.client} | Loxly Atkinson`,
    c.summary,
    2
  )}

<header class="casehead">
  <div class="wrap">
    <a class="back" href="../../index.html">All work</a>
    <h1>${esc(c.title)}</h1>
    <div class="sub">
      <span class="pill${c.status.toLowerCase().startsWith('live') ? ' live' : ''}">${esc(c.status)}</span>
      <span class="pill">${esc(c.sector)}</span>
      ${c.period ? `<span class="pill">${esc(c.period)}</span>` : ''}
      ${c.role ? `<span class="pill">${esc(c.role)}</span>` : ''}
      ${c.liveUrl ? liveLink(c.liveUrl, c.liveLabel) : ''}
    </div>
    <p class="summary">${esc(c.summary)}</p>
  </div>
</header>

${facts ? `<div class="factbar"><div class="facts">${facts}\n</div></div>` : ''}

<main id="main">

<section>
  <div class="wrap">
    <div class="sec-head"><h2>The situation</h2></div>
    <div class="prose"><p>${esc(c.problem)}</p></div>
    <div class="sec-body"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head"><h2>What I built</h2></div>
    <div class="prose">${built}
    </div>
    <div class="sec-body"></div>
  </div>
</section>

<section class="hardpart">
  <div class="wrap">
    <span class="tag">The hard part</span>
    <h2>${esc(c.hardPart.heading)}</h2>
    <p>${esc(c.hardPart.body)}</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head"><h2>Built with</h2></div>
    <ul class="tags">${(c.stack || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <div class="sec-body"></div>
  </div>
</section>

${proof}

<section class="plain">
  <div class="wrap">
    <div class="sec-head"><h2>What this does not prove</h2></div>
    <div class="bounds">
      <ul>
        ${(c.honestLimits || []).map(h => `<li>${esc(h)}</li>`).join('\n        ')}
      </ul>
    </div>
    <div class="casenav" style="margin-top:2.5rem">
      ${prev ? `<a href="../${esc(prev.slug)}/"><span class="lbl">Previous</span>${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a href="../${esc(next.slug)}/" style="text-align:right"><span class="lbl">Next</span>${esc(next.title)}</a>` : '<span></span>'}
    </div>
  </div>
</section>

</main>
${FOOT(2)}
`
}

/* ------------------------------------------------------------------ build */

rmSync(DOCS, { recursive: true, force: true })
mkdirSync(join(DOCS, 'work'), { recursive: true })

writeFileSync(join(DOCS, 'index.html'), renderHome(), 'utf8')
copyFileSync(join(ROOT, 'src/styles.css'), join(DOCS, 'styles.css'))
writeFileSync(join(DOCS, '.nojekyll'), '', 'utf8')

cases.forEach((c, i) => {
  const dir = join(DOCS, 'work', c.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), renderCase(c, i), 'utf8')
})

const base = 'https://loxlyatkinson.github.io/portfolio/'
writeFileSync(join(DOCS, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [`${base}`, ...cases.map(c => `${base}work/${c.slug}/`)]
    .map(u => `  <url><loc>${u}</loc><lastmod>2026-09-17</lastmod></url>`).join('\n') +
  `\n</urlset>\n`, 'utf8')
writeFileSync(join(DOCS, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`, 'utf8')

console.log(`built ${1 + cases.length} pages into docs/ (${cases.length} case studies)`)
if (cases.length !== CASE_ORDER.length) {
  console.warn(`WARNING: expected ${CASE_ORDER.length} case studies, found ${cases.length}`)
  console.warn(`missing: ${CASE_ORDER.filter(s => !cases.find(c => c.slug === s)).join(', ')}`)
}
