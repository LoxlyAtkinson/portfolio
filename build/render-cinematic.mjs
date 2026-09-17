#!/usr/bin/env node
/**
 * Renders the cinematic scroll version into docs/cinematic/.
 *
 * Grammar: gallery / catalog (see scrollcraft/builds/cinematic-portfolio/BRIEF.md).
 * Reuses the SAME content files as the evidence site, so a claim corrected in
 * content/ is corrected in both. Nothing in docs/cinematic/ is hand edited.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'docs/cinematic')

const profile = JSON.parse(readFileSync(join(ROOT, 'content/profile.json'), 'utf8'))

const ORDER = [
  'eden-fm', 'naptosa', 'trio-data', 'kuils-river-doctors', 'sales-crm',
  'pisa-assessments', 'omnimarketer', 'smart-ai-solutions', 'century-club',
]
const cases = ORDER
  .map(s => {
    const p = join(ROOT, `content/cases/${s}.json`)
    return existsSync(p) ? { ...JSON.parse(readFileSync(p, 'utf8')), slug: s } : null
  })
  .filter(Boolean)

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/* Fifteen systems verified HTTP 200 on 2026-09-17. This list IS the ledger. */
const LEDGER = [
  { host: 'naptosawc.co.za', url: 'https://naptosawc.co.za/', slug: 'naptosa' },
  { host: 'my.edenfm.co.za', url: 'https://my.edenfm.co.za/', slug: 'eden-fm' },
  { host: 'trio-data.co.za', url: 'https://www.trio-data.co.za/', slug: 'trio-data' },
  { host: 'kuilsriverdoctors.co.za', url: 'https://kuilsriverdoctors.co.za/', slug: 'kuils-river-doctors' },
  { host: 'pisaconsulting.com', url: 'https://www.pisaconsulting.com/assessments', slug: 'pisa-assessments' },
  { host: 'omnimarketer.app', url: 'https://omnimarketer.app/', slug: 'omnimarketer' },
  { host: 'smartaisolutions.co.za', url: 'https://www.smartaisolutions.co.za/', slug: 'smart-ai-solutions' },
  { host: 'centuryclub.co.za', url: 'https://centuryclub.co.za/', slug: 'century-club' },
  { host: 'ctcommunications.co.za', url: 'https://ctcommunications.co.za/' },
  { host: 'timeworksdata.co.za', url: 'https://timeworksdata.co.za/' },
  { host: 'sublify.co.za', url: 'https://sublify.co.za/' },
  { host: 'earthboundmcc.co.za', url: 'https://earthboundmcc.co.za/' },
  { host: 'pandoradataservices.co.za', url: 'https://pandoradataservices.co.za/' },
  { host: 'ekantikconsulting.com', url: 'https://ekantikconsulting.com/' },
  { host: 'computercomplex.co.za', url: 'https://computercomplex.co.za/' },
]

/**
 * The 25 gates, read from the real pipeline source rather than invented:
 * scripts/deploy-guarded.py in the NAPTOSA repository, 25 gate functions,
 * titles as written there, with three changes, all deliberate:
 *   G03, G05  said "FTP". Redacted: it names client infrastructure.
 *   G19       named the hosting provider. Redacted for the same reason.
 *   G21       reads "the bundle we built" in source. Depersonalised here,
 *             because build/verify.mjs bans first person plural on a solo
 *             practice and the rule is worth more than the verbatim quote.
 * Nothing else is altered and no gate is invented.
 */
const GATES = [
  ['G01', 'Deploy tooling present'],
  ['G02', 'Remote root survives path conversion'],
  ['G03', 'Deploy target is a hostname, not an IP'],
  ['G04', 'Credentials loaded, names only'],
  ['G04B', 'Build environment complete'],
  ['G05', 'Login preflight'],
  ['G06', 'Live origin reachable from here'],
  ['G07', 'Ship surface clean'],
  ['G08', 'Working tree equals HEAD on the ship surface'],
  ['G09', 'Ports and orphan build processes'],
  ['G10', 'Typecheck actually checks files'],
  ['G10B', 'Generated content is current'],
  ['G11', 'Build, prerendered, foreground'],
  ['G12', 'Every manifest route rendered to disk'],
  ['G13', 'Zero bare shells and zero soft 404s in dist'],
  ['G14', 'dist is newer than every source it claims to build'],
  ['G15', 'No undefined env values baked into the bundle'],
  ['G16', 'htaccess shipped and intact'],
  ['G17', 'Bundle fingerprint recorded'],
  ['G18', 'Upload plan is sane'],
  ['G19', 'Upload to host'],
  ['G20', 'Raw HTML SEO smoke, live'],
  ['G21', 'Live bundle is the bundle that was just built'],
  ['G22', 'Live last modified post dates this deploy'],
  ['G23', 'Live route sample'],
]
const FAIL_AT = GATES.findIndex(g => g[0] === 'G21')

const FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'

const head = (title, desc, depth) => {
  const b = depth === 0 ? '' : '../'.repeat(depth)
  return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="Loxly Atkinson">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230B0907'/><circle cx='16' cy='16' r='5' fill='%23E89340'/></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${b}scrollcraft.css">
<link rel="stylesheet" href="${b}cinematic.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<span data-sc-progress></span>
<div class="sc-grain" aria-hidden="true"></div>`
}

const ledgerMarkup = () => `
<aside class="led" id="led" data-sc-verify-state="idle" aria-label="Verification ledger and index">
  <div class="led__head">
    <span class="led__title">Ledger</span>
    <span class="led__count"><b id="ledN">0</b> / ${LEDGER.length}</span>
  </div>
  <span class="led__now" id="ledNow">nothing verified yet</span>
  <ol class="led__list" id="ledList">
    ${LEDGER.map(l => `<li class="led__row" data-host="${esc(l.host)}"><a href="${esc(l.url)}" target="_blank" rel="noopener"><span class="led__host">${esc(l.host)}</span><span class="led__code">200</span></a></li>`).join('\n    ')}
  </ol>
  <p class="led__foot">Every line is a status observed on 17 September 2026, not a claim.</p>
  <div class="led__gate" id="ledGate">
    <ol class="gate__rows" id="gateRows">
      ${GATES.map(([id, t]) => `<li class="gate__row" data-gate="${id}"><span class="gate__n">${id}</span><span class="gate__what">${esc(t)}</span><span class="gate__ok">ok</span></li>`).join('\n      ')}
    </ol>
    <p class="gate__verdict" id="gateVerdict">Refused to ship
      <small>G21 fetched the live page, read its bundle hash, refetched that chunk and compared it with what had just been built. They did not match. The deploy stopped here.</small>
    </p>
  </div>
</aside>`

const pageScript = () => `
<script>
(function () {
  var led = document.getElementById('led');
  if (!led) return;
  var rows = {}, stamped = 0;
  var listRows = led.querySelectorAll('.led__row');
  listRows.forEach(function (r) { rows[r.dataset.host] = r; });
  var nEl = document.getElementById('ledN');
  var nowEl = document.getElementById('ledNow');

  function stamp(host) {
    var r = rows[host];
    if (!r || r.classList.contains('is-stamped')) return;
    r.classList.add('is-stamped');
    stamped++;
    if (nEl) nEl.textContent = stamped;
    if (nowEl) nowEl.innerHTML = host + ' <b>200</b>';
    led.setAttribute('data-sc-verify-state', 'stamped:' + stamped);
  }

  // Objects stamp their own ledger row as they arrive. Works with and without
  // motion, because it is intersection, not scroll position.
  var marks = document.querySelectorAll('[data-led-host]');
  if ('IntersectionObserver' in window && marks.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { stamp(e.target.dataset.ledHost); io.unobserve(e.target); } });
    }, { threshold: 0.35 });
    marks.forEach(function (m) { io.observe(m); });
  } else {
    marks.forEach(function (m) { stamp(m.dataset.ledHost); });
  }

  // ---- the peak: the same rail becomes the deploy gate -------------------
  var act = document.getElementById('gateAct');
  if (!act) return;
  var gateRows = Array.prototype.slice.call(document.querySelectorAll('.gate__row'));
  var verdict = document.getElementById('gateVerdict');
  var FAIL_AT = ${FAIL_AT};
  var running = false, raf = 0, lastState = '';

  function paint(p) {
    // gates run across the first 82% of the act, then the verdict holds
    var t = Math.min(1, Math.max(0, p / 0.82));
    var upto = Math.round(t * gateRows.length);
    for (var i = 0; i < gateRows.length; i++) {
      var on = i < upto;
      gateRows[i].classList.toggle('is-on', on);
      gateRows[i].classList.toggle('is-fail', on && i === FAIL_AT);
      if (i === FAIL_AT) gateRows[i].querySelector('.gate__ok').textContent = on ? 'REFUSED' : 'ok';
    }
    var failed = upto > FAIL_AT;
    if (verdict) verdict.classList.toggle('is-on', failed);
    led.classList.toggle('is-gate', p > 0.01);
    var s = failed ? 'gate:refused' : 'gate:' + upto;
    if (s !== lastState) { led.setAttribute('data-sc-verify-state', s); lastState = s; }
  }

  function readP() {
    var v = getComputedStyle(act).getPropertyValue('--sc-p');
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function loop() {
    paint(readP());
    if (running) raf = requestAnimationFrame(loop);
  }

  var io2 = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting && !running) { running = true; loop(); }
      else if (!e.isIntersecting && running) {
        running = false; cancelAnimationFrame(raf);
        led.classList.remove('is-gate');
        led.setAttribute('data-sc-verify-state', 'stamped:' + stamped);
        lastState = '';
      }
    });
  }, { threshold: 0 });
  io2.observe(act);

  // Reduced motion: no rAF, show the resolved end state when the act is reached.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    io2.disconnect();
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { led.classList.add('is-gate'); paint(1); } });
    }, { threshold: 0.2 }).observe(act);
  }
})();
</script>`

const foot = (depth) => {
  const b = depth === 0 ? '' : '../'.repeat(depth)
  return `<div class="wrap">
  <footer class="foot">
    <span>Loxly Atkinson, Cape Town.</span>
    <span><a href="${b}index.html">The collection</a> &nbsp; <a href="${b}../index.html">The plain version</a></span>
  </footer>
</div>
<script src="${b}scrollcraft.js"></script>
<script>ScrollCraft.mount(document.body);</script>
${pageScript()}
</body>
</html>`
}

/* ------------------------------------------------------------------ index */

function renderIndex () {
  const first = cases[0]
  const rest = cases.slice(1)

  const objects = rest.map(c => {
    const l = LEDGER.find(x => x.slug === c.slug)
    return `
      <article class="obj" data-led-host="${l ? esc(l.host) : ''}">
        <div class="obj__img"><img src="assets/${esc(c.slug)}.webp" width="1800" height="1005" loading="lazy" alt="A low-key photograph of the kind of room this system runs in."></div>
        <div class="obj__body">
          <h3 class="obj__name"><a href="work/${esc(c.slug)}/">${esc(c.title)}</a></h3>
          <dl class="lbl">
            <dt>Client</dt><dd><b>${esc(c.client)}</b></dd>
            <dt>Sector</dt><dd>${esc(c.sector)}</dd>
            <dt>Built</dt><dd>${esc(c.period || 'not recorded')}</dd>
            <dt>Counted</dt><dd>${esc((c.numbers || [])[0] ? c.numbers[0].value + ' ' + c.numbers[0].label.toLowerCase() : 'see the object page')}</dd>
            <dt>Status</dt><dd class="${/^live/i.test(c.status) ? 'is-live' : ''}">${esc(c.status)}</dd>
          </dl>
          <div class="obj__foot">${c.liveUrl ? `<a class="ext" href="${esc(c.liveUrl)}" target="_blank" rel="noopener">${esc(c.liveLabel || c.liveUrl)}</a>` : `<a class="ext" href="work/${esc(c.slug)}/" style="border-bottom-color:rgba(232,147,64,.35)">Open the object</a>`}</div>
        </div>
      </article>`
  }).join('')

  const firstLed = LEDGER.find(x => x.slug === first.slug)

  return `${head(
    'Loxly Atkinson, the collection',
    'Fifteen live systems, nine of them in depth. Every figure counted from source, every link verified on 17 September 2026.',
    0
  )}
${ledgerMarkup()}
<div class="shift">
<main id="main">

  <!-- 1 ARRIVAL, scrub. Gallery hero: object one, already in view, already
       labelled. No separate title stage, no hero claim. -->
  <section data-sc-act="scrub" data-sc-span="2.6" data-sc-dwell="0.34" data-sc-drift="#0B0907">
    <div data-sc-stage data-led-host="${firstLed ? esc(firstLed.host) : ''}">
      <picture>
        <img class="sc-stage__poster" src="assets/hero-poster.webp" alt="">
      </picture>
      <video data-sc-scrub data-sc-src="assets/hero.mp4" data-sc-src-mobile="assets/hero-m.mp4" muted playsinline></video>
      <div class="sc-scrim sc-scrim--lead" aria-hidden="true"></div>
      <div class="sc-copy sc-copy--lead" data-sc-cue="0 0.8 0">
        <h1 style="font-family:var(--mono);font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--sc-ink);font-weight:400;margin-bottom:1.1rem">Loxly Atkinson. Fifteen systems, live now.</h1>
        <p class="sc-display sc-display--xl" style="margin:0 0 .8rem">${esc(first.title)}</p>
        <p class="hero-lbl">${esc(first.client)} &nbsp;&middot;&nbsp; ${esc(first.sector)} &nbsp;&middot;&nbsp; <span class="is-live">${esc(first.status)}</span></p>
        <p style="margin-top:.9rem">${first.liveUrl ? `<a class="ext" href="${esc(first.liveUrl)}" target="_blank" rel="noopener">${esc(first.liveLabel)}</a>` : ''} &nbsp;&nbsp; <a class="ext" href="work/${esc(first.slug)}/">Open the object</a></p>
      </div>
    </div>
  </section>

  <!-- 2 SCHEMA, flow + in + reveal. Compressed: this is information. -->
  <section class="sc-section" data-sc-act="flow" data-sc-span="1" data-sc-drift="#0E0B09" style="padding-block:clamp(3rem,7vw,5rem)">
    <div class="wrap">
      <div class="sc-stack measure" data-sc-in data-sc-stagger="70">
        <span class="eyebrow">How to read this</span>
        <p class="sc-display sc-display--md">Every object below carries the same five lines.</p>
        <p class="sc-body">Who it was built for. What sector they are in. When it was built. One figure counted out of its own source. And whether it is running right now. Nothing on any label is persuasion, and no figure appears that I could not count. The ledger fills in as you pass each one, and every line in it is a status actually observed.</p>
      </div>
    </div>
  </section>

  <!-- 3 THE COLLECTION, pan. This grammar's spine. -->
  <section data-sc-act="pan" data-sc-span="3.6" data-sc-drift="#100C09">
    <div data-sc-stage>
      <div class="rail" data-sc-pan="0.05">
        <div class="rail__lead">
          <span class="eyebrow">The collection</span>
          <p class="sc-display sc-display--md">${cases.length} objects.</p>
          <p class="sc-body" style="font-size:.95rem">Each one has its own page: what it does, what was hard about it, and what it does not prove.</p>
        </div>
        ${objects}
        <div class="rail__end">
          <p class="sc-body" style="font-size:.95rem;color:var(--sc-ink-soft)">Six more live systems are in the ledger and not in this room. They were smaller jobs, and the label would be the same.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4 SUBSTANCE, reveal + count. Real counted figures only. -->
  <section class="sc-section" data-sc-act="flow" data-sc-span="1.4" data-sc-drift="#0E0B09">
    <div class="wrap">
      <div class="sc-stack" data-sc-in data-sc-stagger="60" style="margin-bottom:2rem">
        <span class="eyebrow">Material</span>
        <p class="sc-display sc-display--md measure">What the work is actually made of.</p>
      </div>
      <div class="facts">
        <div><span class="n"><span data-sc-count="0 224">0</span></span><span class="l">Hand written Postgres migrations on one project</span><span class="s">counted in the migrations tree</span></div>
        <div><span class="n"><span data-sc-count="0 35,653">0</span></span><span class="l">Lines of SQL, and no ORM anywhere</span><span class="s">wc over the same tree</span></div>
        <div><span class="n"><span data-sc-count="0 237">0</span></span><span class="l">Row level security policies</span><span class="s">CREATE POLICY count</span></div>
        <div><span class="n"><span data-sc-count="0 224">0</span></span><span class="l">Proof harnesses among 320 scripts on another</span><span class="s">counted in the scripts directory</span></div>
        <div><span class="n"><span data-sc-count="0 1,723">0</span></span><span class="l">Written engineering post mortems across four projects</span><span class="s">755 plus 457 plus 306 plus 205</span></div>
        <div><span class="n"><span data-sc-count="0 15">0</span></span><span class="l">Systems answering on the open internet today</span><span class="s">every one probed on 17 September 2026</span></div>
      </div>
    </div>
  </section>

  <!-- 5 SILENCE. Authored. Declared in BRIEF.md so verification grades it as
       intentional rather than as dead scroll. -->
  <section class="sc-section" data-sc-act="flow" data-sc-span="0.7" data-sc-drift="#080605" aria-hidden="true">
    <div class="wrap" style="min-height:42vh;display:flex;align-items:center;justify-content:center">
      <span style="display:block;width:3rem;height:1px;background:var(--hair)"></span>
    </div>
  </section>

  <!-- 6 THE PEAK, pin. The ledger rail becomes the deploy gate.
       Largest span on the page. Ground present, first cue greets. -->
  <section id="gateAct" data-sc-act="pin" data-sc-span="3.4" data-sc-drift="#0B0907">
    <div data-sc-stage style="display:flex;align-items:center">
      <div class="wrap">
        <div class="measure">
          <span class="eyebrow" data-sc-cue="0 1 0 0">Deploying</span>
          <p class="sc-display sc-display--lg" style="margin-top:1rem" data-sc-cue="0 0.30 0">One deploy reported success and left a ten day old homepage serving.</p>
          <p class="sc-display sc-display--lg" style="margin-top:1rem" data-sc-cue="0.26 0.60">So now every gate names the failure it exists to prevent.</p>
          <p class="sc-display sc-display--lg" style="margin-top:1rem" data-sc-cue="0.56 0.86">G21 fetches the live page and compares its bundle hash with what was just built.</p>
          <p class="sc-body" style="margin-top:1.4rem;color:var(--refuse)" data-sc-cue="0.84 1 0.06 0">It refused. That is the pipeline working, and it has refused on a real run.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 7 BOUNDARIES, flow + in. Same label voice as the objects. -->
  <section class="sc-section" data-sc-act="flow" data-sc-span="1" data-sc-drift="#0E0B09">
    <div class="wrap">
      <div class="sc-stack measure" data-sc-in data-sc-stagger="60" style="margin-bottom:1.6rem">
        <span class="eyebrow">Boundaries</span>
        <p class="sc-display sc-display--md">${esc(profile.notClaimed.intro)}</p>
      </div>
      <div class="bounds measure">
        <ul>${profile.notClaimed.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>
    </div>
  </section>

</main>
</div>

<!-- 8 CLOSE, pin. Inquiry plate typeset as a label. Cue holds, ground present. -->
<section class="shift" data-sc-act="pin" data-sc-span="1.3" data-sc-drift="#100C09">
  <div data-sc-stage style="display:flex;align-items:center;background:var(--sc-surface)">
    <div class="wrap">
      <div class="plate" data-sc-cue="0.05" data-sc-rise="0">
        <img class="plate__face" src="assets/loxly.webp" width="440" height="440" alt="Loxly Atkinson">
        <div>
          <dl class="lbl" style="grid-template-columns:6.5rem 1fr;margin-bottom:1.2rem">
            <dt>Name</dt><dd><b>${esc(profile.name)}</b></dd>
            <dt>Role</dt><dd>${esc(profile.role)}, trading as ${esc(profile.practice)}</dd>
            <dt>Where</dt><dd>${esc(profile.location)}, UTC+2</dd>
            <dt>Languages</dt><dd>${esc(profile.languages)}</dd>
          </dl>
          <p class="plate__line">Everything here is live and I will walk you through any of it.</p>
          <div class="plate__links">
            <a class="ext" href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>
            <a class="ext" href="${esc(profile.linkedin)}" target="_blank" rel="noopener">${esc(profile.linkedinLabel)}</a>
            <a class="ext" href="../index.html" style="color:var(--sc-ink-soft);border-bottom-color:var(--hair)">The plain version, with all the receipts</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

${foot(0)}
`
}

/* ------------------------------------------------------------- case pages */

function renderCase (c, i) {
  const prev = cases[i - 1], next = cases[i + 1]
  const led = LEDGER.find(x => x.slug === c.slug)

  const facts = (c.numbers || []).map(n =>
    `<div><span class="n">${esc(n.value)}</span><span class="l">${esc(n.label)}</span><span class="s">${esc(n.source)}</span></div>`).join('')

  const built = (c.whatIBuilt || []).map((b, k) => `
      <div data-sc-reveal="${k % 2 ? 'right' : 'left'}" data-sc-reveal-at="0.05 0.4">
        <h3>${esc(b.heading)}</h3>
        <p>${esc(b.body)}</p>
      </div>`).join('')

  return `${head(`${c.title} | Loxly Atkinson`, c.summary, 2)}
${ledgerMarkup()}
<div class="shift">
<main id="main">

  <!-- Object plate. Pinned still with a parallax bed: depth from differential
       movement, which is the cheapest premium signal available. -->
  <section data-sc-act="pin" data-sc-span="2.2" data-sc-drift="#0B0907">
    <div data-sc-stage ${led ? `data-led-host="${esc(led.host)}"` : ''} style="overflow:hidden">
      <div data-sc-parallax="-0.9" style="position:absolute;inset:-8% 0;">
        <img src="../../assets/${esc(c.slug)}.webp" width="1800" height="1005" alt="A low-key photograph of the kind of room this system runs in." style="width:100%;height:100%;object-fit:cover">
      </div>
      <div class="sc-scrim sc-scrim--lead" aria-hidden="true"></div>
      <div class="sc-copy sc-copy--lead" data-sc-cue="0 0.82 0">
        <a class="back" href="../../index.html">The collection</a>
        <h1 class="case__title">${esc(c.title)}</h1>
        <dl class="lbl" style="max-width:32rem;margin-top:1.4rem">
          <dt>Client</dt><dd><b>${esc(c.client)}</b></dd>
          <dt>Sector</dt><dd>${esc(c.sector)}</dd>
          ${c.period ? `<dt>Built</dt><dd>${esc(c.period)}</dd>` : ''}
          ${c.role ? `<dt>Role</dt><dd>${esc(c.role)}</dd>` : ''}
          <dt>Status</dt><dd class="${/^live/i.test(c.status) ? 'is-live' : ''}">${esc(c.status)}</dd>
        </dl>
        ${c.liveUrl ? `<p style="margin-top:1rem"><a class="ext" href="${esc(c.liveUrl)}" target="_blank" rel="noopener">${esc(c.liveLabel || c.liveUrl)}</a></p>` : ''}
      </div>
    </div>
  </section>

  <section class="sc-section" data-sc-act="flow" data-sc-drift="#0E0B09" style="padding-block:clamp(3rem,7vw,5rem)">
    <div class="wrap">
      <p class="sc-lede measure" data-sc-in>${esc(c.summary)}</p>
    </div>
  </section>

  ${facts ? `<section class="sc-section" data-sc-act="flow" data-sc-drift="#100C09" style="padding-block:0">
    <div class="wrap"><div class="facts">${facts}</div></div>
  </section>` : ''}

  <section class="sc-section" data-sc-act="flow" data-sc-drift="#0E0B09">
    <div class="wrap">
      <div class="sc-stack measure" data-sc-in data-sc-stagger="60">
        <span class="eyebrow">The situation</span>
        <p class="sc-body">${esc(c.problem)}</p>
      </div>
    </div>
  </section>

  <section class="sc-section" data-sc-act="flow" data-sc-drift="#100C09">
    <div class="wrap">
      <div class="sc-stack measure" data-sc-in style="margin-bottom:1.6rem">
        <span class="eyebrow">What I built</span>
      </div>
      <div class="prose measure">${built}</div>
    </div>
  </section>

  <section class="hardpart sc-section" data-sc-act="flow" data-sc-drift="#14100C">
    <div class="wrap">
      <div class="sc-stack measure" data-sc-in data-sc-stagger="70">
        <span class="eyebrow">The hard part</span>
        <p class="sc-display sc-display--md">${esc(c.hardPart.heading)}</p>
        <p class="sc-body">${esc(c.hardPart.body)}</p>
      </div>
    </div>
  </section>

  ${(c.stack || []).length ? `<section class="sc-section" data-sc-act="flow" data-sc-drift="#0E0B09">
    <div class="wrap">
      <div class="sc-stack" data-sc-in style="margin-bottom:1.1rem"><span class="eyebrow">Built with</span></div>
      <ul class="tags">${c.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    </div>
  </section>` : ''}

  ${(c.proof || []).length ? `<section class="sc-section" data-sc-act="flow" data-sc-drift="#100C09">
    <div class="wrap">
      <div class="sc-stack measure" data-sc-in style="margin-bottom:1.1rem"><span class="eyebrow">How it was proven</span></div>
      <ul class="checks measure">${c.proof.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
    </div>
  </section>` : ''}

  <section class="sc-section" data-sc-act="flow" data-sc-drift="#0B0907">
    <div class="wrap">
      <div class="sc-stack measure" data-sc-in style="margin-bottom:1.4rem">
        <span class="eyebrow">What this does not prove</span>
      </div>
      <div class="bounds measure">
        <ul>${(c.honestLimits || []).map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      </div>
      <nav style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;margin-top:3rem;padding-top:1.6rem;border-top:1px solid var(--hair-soft)">
        ${prev ? `<a class="ext" href="../${esc(prev.slug)}/" style="border:0;color:var(--sc-ink-soft)">${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? `<a class="ext" href="../${esc(next.slug)}/" style="border:0">${esc(next.title)}</a>` : '<span></span>'}
      </nav>
    </div>
  </section>

</main>
</div>
${foot(2)}
`
}

/* ------------------------------------------------------------------ write */

for (const f of ['index.html', 'cinematic.css']) {
  const p = join(OUT, f); if (existsSync(p)) rmSync(p)
}
rmSync(join(OUT, 'work'), { recursive: true, force: true })
mkdirSync(join(OUT, 'work'), { recursive: true })

/* Copy the engine and every generated asset from their committed source, so a
   full rebuild reproduces docs/cinematic/ from nothing. The engine is copied,
   never edited: bespoke behaviour lives in the page, not in the mechanism. */
const SRC = join(ROOT, 'src/cinematic-assets')
mkdirSync(join(OUT, 'assets'), { recursive: true })
for (const f of readdirSync(SRC)) {
  const dest = f === 'scrollcraft.js' || f === 'scrollcraft.css'
    ? join(OUT, f)
    : join(OUT, 'assets', f)
  copyFileSync(join(SRC, f), dest)
}
copyFileSync(join(ROOT, 'src/cinematic.css'), join(OUT, 'cinematic.css'))
writeFileSync(join(OUT, 'index.html'), renderIndex(), 'utf8')
cases.forEach((c, i) => {
  const d = join(OUT, 'work', c.slug)
  mkdirSync(d, { recursive: true })
  writeFileSync(join(d, 'index.html'), renderCase(c, i), 'utf8')
})

console.log(`cinematic: built ${1 + cases.length} pages, ${GATES.length} gates, ${LEDGER.length} ledger rows`)
