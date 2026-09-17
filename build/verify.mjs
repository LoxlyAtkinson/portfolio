#!/usr/bin/env node
/**
 * Build gate. Fails the build on anything that breaches the claim rules.
 * Every rule here traces to a binding ruling in the evidence dossier
 * (_Portfolio/evidence/MASTER-DOSSIER.md sections 5, 6 and 7).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(ROOT, 'docs')

const fails = []
const warns = []

function walk (dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (f.endsWith('.html')) out.push(p)
  }
  return out
}

const pages = walk(DOCS)
if (!pages.length) fails.push('no HTML pages found in docs/')

/* URLs verified HTTP 200 on 2026-09-17 and cleared for publication. */
const APPROVED_HOSTS = new Set([
  'www.trio-data.co.za', 'trio-data.co.za',
  'naptosawc.co.za',
  'my.edenfm.co.za', 'www.edenfm.co.za',
  'www.pisaconsulting.com',
  'kuilsriverdoctors.co.za',
  'centuryclub.co.za', 'ctcommunications.co.za', 'timeworksdata.co.za',
  'sublify.co.za', 'earthboundmcc.co.za', 'pandoradataservices.co.za',
  'ekantikconsulting.com', 'computercomplex.co.za',
  'omnimarketer.app', 'www.smartaisolutions.co.za',
  'loxlyatkinson.github.io',
  'linkedin.com', 'www.linkedin.com',
  'fonts.googleapis.com', 'fonts.gstatic.com',
  'schema.org', 'www.sitemaps.org', 'www.w3.org',
])

/**
 * Banned outright. Owner rulings and evidence rulings.
 *
 * `denialOk` marks a term that is legitimate when the page is DENYING it, for example
 * "there are no testimonials here". Those lines are the point of the honest-limits section,
 * so the gate reads the surrounding context rather than banning the word outright. A term
 * without `denialOk` fails on sight.
 */
const NEGATORS = /\b(no|not|never|zero|without|none|nor|neither|do not|does not|did not|cannot|refus)\w*\b/i

const BANNED = [
  { re: /56[,\s]?000/i, why: 'NAPTOSA member count, unsourced and contradicted three times in source' },
  { re: /50[,\s]?000\+?\s*(member|user)/i, why: 'NAPTOSA member count variant, stripped off the client site as unsourced' },
  { re: /\btestimonial/i, why: 'no testimonial exists for any client', denialOk: true },
  { re: /SOC\s?2/i, why: 'unsupported trust badge' },
  { re: /ISO\s?27001/i, why: 'unsupported trust badge' },
  { re: /Laravel Partnered/i, why: 'unsupported trust badge' },
  { re: /200[,\s]?000\s*listener/i, why: 'Eden FM audience claim, no measurement exists' },
  { re: /3[,\s]?000\+?\s*conversations/i, why: 'Eden FM claim, no measurement exists' },
  { re: /\b16[\s-]module/i, why: 'Eden FM presenter console is 17 modules, not 16' },
  { re: /68 edge functions/i, why: 'stale Eden FM figure' },
  { re: /391 prerendered/i, why: 'Smart AI figure is 393 of 393 at last deploy' },
  { re: /\b(Founder|CEO|Chief Executive)\b/, why: 'independent-builder framing was chosen for this page' },
  { re: /\b(we|our team|my team)\s+(built|build|shipped|deliver)/i, why: 'solo practice, never a team' },
  { re: /\b(HubSpot|Salesforce|Jira|ClickUp|Asana|Monday\.com|Confluence|Azure DevOps|Tableau|Power BI|UiPath|Airflow|dbt)\b/i, why: 'no evidence on disk, never to be listed' },
  { re: /\b(Scrum Master|Product Owner|Agile coach|Business Analyst|Delivery Lead)\b/i, why: 'never a held title', denialOk: true },
  { re: /\b(CSM|PSM|SAFe|PMP|PRINCE2|ITIL|CBAP)\b/, why: 'no certification held', denialOk: true },
  { re: /\bseamless|cutting[- ]edge|robust solution|leverage[ds]?\b/i, why: 'marketing adjective, breaches house voice' },
  { re: /\bI(?:'m| am) passionate\b/i, why: 'AI tell, breaches house voice' },
  { re: /\bexperts?\b/i, why: 'never a bare self-label; demonstrate depth instead', denialOk: true },
  { re: /\bdegree\b/i, why: 'no degree held', denialOk: true },
]

/** True when the match sits inside a sentence that is denying it. */
function isDenial (text, index, length) {
  const from = text.lastIndexOf('.', index) + 1
  const toRaw = text.indexOf('.', index + length)
  const to = toRaw === -1 ? text.length : toRaw
  return NEGATORS.test(text.slice(from, to))
}

/* Percentage outcome claims. Percentages describing a result are banned; none has been measured. */
const PCT_OUTCOME = /(\d{1,3})\s?%\s?(increase|improvement|reduction|faster|more|better|uplift|growth|conversion|resolution|uptime)/i

const DASH = /[—–]/

for (const p of pages) {
  const raw = readFileSync(p, 'utf8')
  const rel = p.replace(ROOT, '').replace(/\\/g, '/')

  // Strip script/style, then tags, to get visible text.
  const text = raw
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')

  if (DASH.test(text)) {
    const m = text.match(new RegExp('.{0,45}[—–].{0,45}'))
    fails.push(`${rel}: em or en dash in visible text near "${m ? m[0].trim() : '?'}"`)
  }

  for (const b of BANNED) {
    const re = new RegExp(b.re.source, b.re.flags.includes('g') ? b.re.flags : b.re.flags + 'g')
    for (const m of text.matchAll(re)) {
      if (b.denialOk && isDenial(text, m.index, m[0].length)) continue
      fails.push(`${rel}: banned "${m[0]}" (${b.why})`)
      break
    }
  }

  const pct = text.match(PCT_OUTCOME)
  if (pct) fails.push(`${rel}: percentage outcome claim "${pct[0]}", none has been measured for any client`)

  // exactly one title, one meta description
  const titles = raw.match(/<title>/gi) || []
  if (titles.length !== 1) fails.push(`${rel}: expected 1 <title>, found ${titles.length}`)
  const descs = raw.match(/<meta name="description"/gi) || []
  if (descs.length !== 1) fails.push(`${rel}: expected 1 meta description, found ${descs.length}`)
  const h1s = raw.match(/<h1[\s>]/gi) || []
  if (h1s.length !== 1) fails.push(`${rel}: expected 1 <h1>, found ${h1s.length}`)

  // every external link on an approved host
  for (const m of raw.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    let h
    try { h = new URL(m[1]).host } catch { fails.push(`${rel}: unparseable URL ${m[1]}`); continue }
    if (!APPROVED_HOSTS.has(h)) fails.push(`${rel}: link to unapproved host ${h} (${m[1]})`)
  }

  // internal links resolve
  for (const m of raw.matchAll(/href="(?!https?:|mailto:|#|data:)([^"]+)"/g)) {
    const target = m[1].replace(/[?#].*$/, '')
    const abs = resolve(dirname(p), target)
    const ok = existsSync(abs) || existsSync(join(abs, 'index.html'))
    if (!ok) fails.push(`${rel}: broken internal link "${target}"`)
  }
}

/* Every case study must carry a "what this does not prove" section. */
for (const p of pages.filter(x => x.includes('work'))) {
  const raw = readFileSync(p, 'utf8')
  const rel = p.replace(ROOT, '').replace(/\\/g, '/')
  if (!/What this does not prove/i.test(raw)) fails.push(`${rel}: missing the honest-limits section`)
  if (!/The hard part/i.test(raw)) warns.push(`${rel}: no hard-part section`)
}

/* Report */
console.log(`checked ${pages.length} pages`)
for (const w of warns) console.log(`  warn  ${w}`)
if (fails.length) {
  console.error(`\n${fails.length} FAILURE(S):`)
  for (const f of fails) console.error(`  FAIL  ${f}`)
  process.exit(1)
}
console.log('all gates passed')
