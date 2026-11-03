// Writes every page of the portfolio from scripts/content/*.
// Run: node scripts/build-site.mjs
// The output is plain static HTML that the existing server.js (or any static host) serves as-is.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, HOME, CONTACT, PROJECTS, BLOG, FIGURES } from './content/site.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ARTICLE = JSON.parse(readFileSync(join(ROOT, 'scripts/content/article.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13 13 3M5.5 3H13v7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function head({ title, description }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#1c1c1c">
<link rel="preload" href="/fonts/clash-grotesk/MJQFMMOTEGNXDVM7HBBDTQHTVB2M7Y6G.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site/site.css">
<script defer src="/assets/site/site.js"></script>
</head>
`;
}

function topbar(current = '') {
  const link = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<header class="topbar">
  <a class="wordmark" href="/">${SITE.brand}</a>
  <nav class="nav" aria-label="Primary">
    ${link('/#work', 'Work', 'work')}
    ${link('/#skills', 'Skills', 'skills')}
    ${link('/blog/', 'Blog', 'blog')}
    ${link('/#about', 'About', 'about')}
    <a class="btn nav__cta" href="/contact/"${current === 'contact' ? ' aria-current="page"' : ''}>Get in touch</a>
  </nav>
</header>`;
}

function footer() {
  return `<footer class="footer wrap">
  <div class="footer__row">
    <span>© ${SITE.year} ${SITE.name} (${SITE.brand})</span>
    <span><a href="${SITE.links.linkedin}" rel="noopener">LinkedIn</a> · <a href="${SITE.links.behance}" rel="noopener">Behance</a></span>
  </div>
</footer>`;
}

function page(args, body) {
  return head(args) + `<body>
<a class="skip" href="#main">Skip to content</a>
${body}
${footer()}
</body>
</html>
`;
}

/* ---------- home ---------- */

function homePage() {
  const first = PROJECTS[0];
  const heroPhoto = first.image;
  const work = PROJECTS.map((p, i) => `
          <a class="work__row" href="/case-studies/${p.slug}/" data-work-row${i === 0 ? ' aria-current="true"' : ' aria-current="false"'}>
            <span class="name">${esc(p.workTitle)}</span>
            <span class="meta">${esc(p.client)} · ${esc(p.year)}</span>
          </a>`).join('');
  const media = PROJECTS.map((p, i) => `
        <figure class="work__media${i === 0 ? ' is-active' : ''}" data-work-media data-now="${esc(p.name)}" aria-hidden="${i === 0 ? 'false' : 'true'}">
          <img src="${p.image.src}" alt="${esc(p.image.alt)}" decoding="async">
          <figcaption><span><strong>${esc(p.client)}</strong><br>${esc(p.discipline)}</span><a class="text-link" href="/case-studies/${p.slug}/" tabindex="${i === 0 ? '0' : '-1'}">Read the case</a></figcaption>
        </figure>`).join('');
  const skills = HOME.skills.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('');
  const tools = HOME.tools.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('');
  const post = BLOG.posts[0];
  const about = HOME.about.map((p) => `<p>${esc(p)}</p>`).join('');

  const body = `<main id="main">
<section class="hero" aria-label="Introduction">
  <div class="sheet">
    <div class="sheet__top">
      <a class="wordmark" href="/">${SITE.brand}</a>
      <nav aria-label="Primary"><a href="#work">Work</a><a href="#skills">Skills</a><a href="/blog/">Blog</a><a href="#about">About</a></nav>
    </div>
    <div class="sheet__body">
      <h1 data-reveal style="--d:0">${esc(HOME.headline)}</h1>
      <p data-reveal style="--d:1">${esc(HOME.lead)}</p>
      <div class="sheet__actions" data-reveal style="--d:2">
        <a class="btn" href="/contact/">Get in touch ${ARROW}</a>
        <a class="btn btn--ghost" href="#work">My work</a>
      </div>
    </div>
    <p class="sheet__foot">${SITE.name} · ${SITE.role}</p>
  </div>
  <figure class="photo">
    <img src="${heroPhoto.src}" alt="${esc(heroPhoto.alt)}">
    <figcaption><span>${esc(first.client)}: ${esc(first.workTitle)}</span><a class="text-link" href="/case-studies/${first.slug}/">Read the case</a></figcaption>
  </figure>
</section>

<section class="work-head" id="work" aria-labelledby="work-title">
  <h2 id="work-title">${esc(HOME.workTitle)}</h2>
</section>

<section class="work" data-work aria-label="Selected projects">
  <div class="work__stage">
    <div class="work__left">
      <p class="work__now" data-work-now aria-live="polite">${esc(first.name)}</p>
      <nav class="work__index" aria-label="Case studies">${work}
      </nav>
    </div>
    <div class="work__right">${media}
    </div>
  </div>
</section>

<section class="section band" id="skills" aria-labelledby="skills-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="skills-title" class="head" data-reveal>${esc(HOME.skillsTitle)}</h2>
    </div>
    <dl class="rows" data-reveal>${skills}</dl>
    <div class="section__head" style="margin-top:clamp(96px,10vw,160px)">
      <h2 id="tools-title" class="head" data-reveal>${esc(HOME.toolsTitle)}</h2>
    </div>
    <dl class="rows rows--small" data-reveal>${tools}</dl>
  </div>
</section>

<section class="section" id="blog" aria-labelledby="blog-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="blog-title" class="head" data-reveal>${esc(HOME.blogTitle)}</h2>
    </div>
    <a class="blog-row" href="/blog/${post.slug}/" data-reveal>
      <div class="blog-row__img"><img src="${post.image.src}" alt="${esc(post.image.alt)}"></div>
      <div>
        <h3>${esc(post.title)}</h3>
        <time datetime="2024-08-16">${esc(post.date)}</time>
      </div>
      <span class="text-link">Read ${ARROW}</span>
    </a>
    <p style="margin-top:32px" data-reveal><a class="text-link" href="/blog/">See all posts ${ARROW}</a></p>
  </div>
</section>

<section class="section band" id="about" aria-labelledby="about-title">
  <div class="wrap">
    <div class="about-grid">
      <h2 id="about-title" class="head" data-reveal>${esc(HOME.aboutTitle)}</h2>
      <div class="about" data-reveal>
        ${about}
        <p class="sign"><strong>${esc(SITE.name)}</strong><span>${esc(SITE.role)}</span></p>
        <p style="margin-top:40px"><a class="btn" href="/contact/">Get in touch ${ARROW}</a></p>
      </div>
    </div>
  </div>
</section>
</main>`;
  return page({
    title: SITE.title,
    description: 'Christian Jeremiah, product designer. Case studies in enterprise SaaS, machine translation, pet adoption, live music and ESG tools.',
  }, body);
}

/* ---------- case studies ---------- */

function caseBlock(section) {
  const parts = [];
  parts.push(`<h2 data-reveal>${esc(section.heading)}</h2>`);
  (section.paragraphs || []).forEach((p) => parts.push(`<p data-reveal>${esc(p)}</p>`));
  if (section.list && section.list.length) {
    parts.push(`<ul data-reveal>${section.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`);
  }
  return `<div class="case__section">${parts.join('\n        ')}</div>`;
}

function figuresAt(slug, sectionIndex) {
  return (FIGURES[slug] || [])
    .filter((f) => f.at === sectionIndex)
    .map((f) => `<figure class="case-figure" data-reveal><img src="${f.src}" alt="${esc(f.alt)}" decoding="async"><figcaption>${esc(f.caption)}</figcaption></figure>`)
    .join('\n    ');
}

function casePage(project, index) {
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  // "Other contributions" reads last, after the results, so no short list sits above a heading.
  const other = project.sections.filter((s) => /^Other/.test(s.heading));
  const main = project.sections.filter((s) => !/^Other/.test(s.heading));
  const facts = [
    ['Project', project.workTitle],
    ['Client', project.client],
    ['Role', project.role],
    ['Industry', project.industry],
    ['Year', project.year],
    ['Timeline', project.timeline],
    ['Team', project.team],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');

  const stats = project.stats && project.stats.length
    ? `<div class="case__section" data-reveal><h2>Results</h2><div class="stats">${project.stats.map((s) => `<div class="stat"><div class="figure">${esc(s.figure)}</div><p class="label">${esc(s.text)}</p></div>`).join('')}</div>${project.results.map((r) => `<p>${esc(r)}</p>`).join('')}</div>`
    : `<div class="case__section" data-reveal><h2>Results</h2>${project.results.map((r) => `<p>${esc(r)}</p>`).join('')}</div>`;

  const external = project.external
    ? `<p style="margin-top:32px"><a class="text-link" href="${esc(project.external.href)}" rel="noopener">${esc(project.external.label)} ${ARROW}</a></p>`
    : '';

  const body = `<main id="main">
<div class="case">
  <figure class="case__media">
    <div class="frame"><img src="${project.image.src}" alt="${esc(project.image.alt)}"></div>
  </figure>
  <article class="case__read">
    <h1 class="case__title">${esc(project.headline)}</h1>
    <p class="case__lede">${esc(project.summary)}</p>
    <div class="case__section" data-reveal>${project.intro.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <dl class="facts" data-reveal>${facts}</dl>
    ${caseBlock({ heading: 'The problem', paragraphs: [project.problem] })}
    ${caseBlock({ heading: 'Objectives', list: project.objectives })}
    ${main.map((s, i) => caseBlock(s) + figuresAt(project.slug, i)).join('\n    ')}
    ${stats}
    <div class="case__section" data-reveal><h2>Tools and methods</h2><p>${esc(project.tools)}</p><p>${esc(project.methods)}</p></div>
    ${other.map(caseBlock).join('\n    ')}
    ${external}
    <div class="case__tail" data-reveal>
      <a class="case__next" href="/case-studies/${next.slug}/">
        <strong>${esc(next.workTitle)}</strong>
        <span>Next case ${ARROW}</span>
      </a>
    </div>
  </article>
</div>
</main>`;
  return page({
    title: `${project.workTitle} — ${SITE.name}`,
    description: `${project.workTitle} for ${project.client}: ${project.headline}. ${project.discipline}, ${project.year}.`,
  }, topbar('work') + body);
}

/* ---------- blog ---------- */

function articleBody(blocks) {
  const out = [];
  let list = null;
  const flush = () => { if (list) { out.push(`<ul>${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`); list = null; } };
  for (const b of blocks.slice(1)) { // block 0 is the title
    let text = b.text;
    const isBullet = b.tag === 'li' || /^- /.test(text);
    if (isBullet) { if (!list) list = []; list.push(text.replace(/^- /, '')); continue; }
    flush();
    if (b.tag === 'h4' || b.tag === 'h3') { out.push(`<h2 data-reveal>${esc(text)}</h2>`); continue; }
    if (b.tag === 'h1') continue;
    const isLabel = text.length < 60 && /:$/.test(text);
    out.push(`<p class="${isLabel ? 'label' : ''}" data-reveal>${esc(text)}</p>`);
  }
  flush();
  return out.join('\n    ');
}

function articlePage() {
  const title = ARTICLE[0].text;
  const post = BLOG.posts[0];
  const body = `<main id="main">
<div class="article">
  <figure class="case__media cover">
    <div class="frame"><img src="${post.image.src}" alt="${esc(post.image.alt)}"></div>
  </figure>
  <article class="article__read">
    <h1 data-reveal>What is an experience?</h1>
    <p class="deck" data-reveal>${esc(title)}</p>
    <time class="date" datetime="2024-08-16">${esc(post.date)}</time>
    ${articleBody(ARTICLE)}
  </article>
</div>
</main>`;
  return page({
    title: `${title} — ${SITE.name}`,
    description: 'An essay on how product experiences are built: environment, entities, actions, results, emotions and time.',
  }, topbar('blog') + body);
}

function blogIndexPage() {
  const post = BLOG.posts[0];
  const body = `<main id="main">
<section class="page-head">
  <h1 data-reveal>My blog</h1>
  <p class="page-lede" data-reveal>Essays on product design and the experiences people remember.</p>
</section>
<section class="wrap" style="padding-bottom:160px">
  <a class="blog-row blog-row--feature" href="/blog/${post.slug}/">
    <div class="blog-row__img" data-reveal><img src="${post.image.src}" alt="${esc(post.image.alt)}"></div>
    <div>
      <h2 data-reveal>${esc(post.title)}</h2>
      <time datetime="2024-08-16" data-reveal>${esc(post.date)}</time>
      <span class="text-link" data-reveal style="margin-top:28px">Read ${ARROW}</span>
    </div>
  </a>
</section>
</main>`;
  return page({
    title: `My blog — ${SITE.name}`,
    description: 'Writing on product design by Christian Jeremiah.',
  }, topbar('blog') + body);
}

/* ---------- contact ---------- */

function contactPage() {
  const details = [
    ['Role', SITE.role],
    ['LinkedIn', `<a href="${SITE.links.linkedin}" rel="noopener">linkedin.com/in/jrixit</a>`],
    ['Behance', `<a href="${SITE.links.behance}" rel="noopener">behance.net/jrixit</a>`],
  ].map(([k, v]) => `<div data-reveal><dt>${k}</dt><dd>${/^</.test(v) ? v : esc(v)}</dd></div>`).join('');

  const strip = PROJECTS.map((p) => `<a class="strip__item" data-reveal href="/case-studies/${p.slug}/"><img src="${p.image.src}" alt="${esc(p.image.alt)}" decoding="async"><span>${esc(p.workTitle)}</span></a>`).join('');

  const body = `<main id="main" class="wrap">
<section class="contact">
  <div class="contact__intro">
    <h1 class="contact__prompt">${esc(CONTACT.title)}</h1>
    <p class="contact__lede">${esc(CONTACT.headline)}</p>
    <p class="contact__note" data-reveal>${esc(CONTACT.ask)}</p>
  </div>
  <div class="contact__aside">
  <form data-contact-form data-email="${esc(SITE.contactEmail)}" novalidate>
    <div class="field" data-reveal>
      <label for="c-name">Name</label>
      <input id="c-name" name="name" type="text" autocomplete="name" required>
    </div>
    <div class="field" data-reveal>
      <label for="c-email">Email</label>
      <input id="c-email" name="email" type="email" autocomplete="email" required>
    </div>
    <div class="field" data-reveal>
      <label for="c-message">Message</label>
      <textarea id="c-message" name="message" required></textarea>
    </div>
    <button class="btn" type="submit" data-reveal>Send message ${ARROW}</button>
    <p class="contact__note" data-form-note>${SITE.contactEmail ? esc(CONTACT.note) : 'Until the contact address is set, use LinkedIn or Behance below.'}</p>
  </form>
  <dl class="contact__details">${details}</dl>
  </div>
</section>
<section class="strip-section" aria-labelledby="strip-title">
  <h2 id="strip-title" class="head">Selected work</h2>
  <div class="strip">${strip}</div>
</section>
</main>`;
  return page({
    title: `Contact — ${SITE.name}`,
    description: 'Get in touch with Christian Jeremiah about product design work.',
  }, topbar('contact') + body);
}

/* ---------- write ---------- */

const outputs = [
  ['index.html', homePage()],
  ['contact/index.html', contactPage()],
  ['blog/index.html', blogIndexPage()],
  ['blog/what-is-an-experience/index.html', articlePage()],
  ...PROJECTS.map((p, i) => [`case-studies/${p.slug}/index.html`, casePage(p, i)]),
];

for (const [rel, html] of outputs) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  console.log('wrote', rel, `(${(html.length / 1024).toFixed(1)} KB)`);
}
