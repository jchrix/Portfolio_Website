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
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f4f2ed">
<script>try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="preload" href="/fonts/google-sans/google-sans-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site/site.css">
<script src="/assets/vendor/lenis.min.js"></script>
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
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode" title="Switch to dark mode">
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </nav>
</header>`;
}

const LINKEDIN_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>';
const BEHANCE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.5 11.2c1-.5 1.5-1.3 1.5-2.5 0-2.2-1.6-3.2-3.9-3.2H1v13h5.4c2.5 0 4.4-1.2 4.4-3.7 0-1.6-.8-2.9-2.3-3.6ZM3.9 7.7h2.3c.9 0 1.5.4 1.5 1.3s-.6 1.4-1.6 1.4H3.9V7.7Zm2.6 7.7H3.9v-3.1h2.8c1.1 0 1.8.6 1.8 1.6 0 1.1-.8 1.5-2 1.5ZM14.5 7h5.4v1.3h-5.4V7Zm2.9 1.9c-3 0-4.5 2.1-4.5 4.6 0 2.6 1.4 4.6 4.6 4.6 2.3 0 3.6-1.1 4.2-3.1h-2.3c-.2.6-.8 1-1.8 1-1.3 0-2-.7-2.1-2h6.5c.2-3-1.2-5.1-4.6-5.1Zm-2 3.7c.1-1 .8-1.7 2-1.7s1.8.7 1.9 1.7h-3.9Z"/></svg>';

function footer() {
  const { linkedin, behance } = SITE.links;
  return `<footer class="footer">
  <div class="footer__inner wrap">
    <div class="footer__top">
      <div class="footer__intro">
        <p class="footer__title">Created with <em>care.</em></p>
        <p class="footer__text">Open to product design work with startups and enterprise teams. Tell me about the problem you need solved.</p>
        <div class="footer__cta">
          <span>Have a project in mind?</span>
          <a href="/contact/">Get in touch</a>
        </div>
        <div class="footer__social">
          <a href="${linkedin}" rel="noopener" aria-label="LinkedIn">${LINKEDIN_ICON}</a>
          <a href="${behance}" rel="noopener" aria-label="Behance">${BEHANCE_ICON}</a>
        </div>
      </div>
      <nav class="footer__col" aria-label="Site">
        <h2>Navigate</h2>
        <a href="/">Home</a>
        <a href="/#work">Work</a>
        <a href="/#skills">Skills</a>
        <a href="/blog/">Blog</a>
        <a href="/#about">About</a>
        <a href="/contact/">Contact</a>
      </nav>
      <nav class="footer__col" aria-label="Elsewhere">
        <h2>Elsewhere</h2>
        <a href="${linkedin}" rel="noopener">LinkedIn</a>
        <a href="${behance}" rel="noopener">Behance</a>
        <a href="#top">Back to top</a>
      </nav>
    </div>
    <p class="footer__legal">Copyright © ${SITE.year} Design by <strong>${SITE.name}</strong></p>
  </div>
  <p class="footer__mark" aria-hidden="true">${SITE.brand}</p>
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
  const post = BLOG.posts[0];
  const years = PROJECTS.map((p) => Number(p.year)).filter(Boolean);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';
  const arrowIcon = ARROW;

  const work = PROJECTS.map((p) => `
      <a class="proj" href="/case-studies/${p.slug}/" data-reveal>
        <div class="proj__media">
          <img src="${p.image.src}" alt="${esc(p.image.alt)}" decoding="async" loading="lazy">
          <span class="chip">${esc(p.discipline)}</span>
        </div>
        <div class="proj__body">
          <div class="proj__text">
            <h3 class="proj__title">${esc(p.sector)}</h3>
            <div class="proj__reveal"><div><p class="proj__meta">${esc(p.cardText || `${p.client} · ${p.year}`)}</p></div></div>
          </div>
          <span class="proj__go" aria-hidden="true">${arrowIcon}</span>
        </div>
      </a>`).join('');

  const skills = HOME.skills.map(([t, d], i) => `<div class="skill" data-reveal style="--d:${i % 3}">
        <span class="skill__num">${String(i + 1).padStart(2, '0')}</span>
        <dt>${esc(t)}</dt>
        <dd>${esc(d)}</dd>
      </div>`).join('');
  const tools = HOME.tools.map(([t, d]) => `<div class="tool"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('');
  const about = HOME.about.map((p) => `<p>${esc(p)}</p>`).join('');

  const body = `<main id="main">
<section class="home-hero" aria-label="Introduction">
  <h1 data-reveal style="--d:0">I design products that make complex problems feel simple, for <span class="swap"><span class="swap__a"><em>users</em>.</span><span class="swap__b" aria-hidden="true"><em>business</em>.</span></span></h1>
  <div class="home-hero__row">
    <p class="home-hero__lead" data-reveal style="--d:1">${esc(HOME.lead)}</p>
  </div>
  <ul class="badges" data-reveal aria-label="Highlights">${HOME.badges.map((b) => `<li class="chip">${esc(b)}</li>`).join('')}</ul>
</section>

<section class="section" id="work" aria-labelledby="work-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="work-title" data-reveal>${esc(HOME.workTitle)}</h2>
      <a class="text-link" href="/projects/" data-reveal>All Projects ${ARROW}</a>
    </div>
    <div class="work-grid">${work}
    </div>
  </div>
</section>

<section class="section" id="skills" aria-labelledby="skills-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="skills-title" data-reveal>${esc(HOME.skillsTitle)}</h2>
      <p data-reveal>The work I do from first workshop to the final handover.</p>
    </div>
    <dl class="skill-grid">${skills}</dl>
    <div class="section__head" style="margin-top:clamp(88px,9vw,140px)">
      <h2 id="tools-title" data-reveal>${esc(HOME.toolsTitle)}</h2>
      <p data-reveal>The software and services I use day to day.</p>
    </div>
    <dl class="tool-cloud" data-reveal>${tools}</dl>
  </div>
</section>

<section class="section" id="blog" aria-labelledby="blog-title">
  <div class="wrap">
    <div class="section__head">
      <h2 id="blog-title" data-reveal>${esc(HOME.blogTitle)}</h2>
      <p data-reveal>Fresh insights from my recent writing.</p>
    </div>
    <a class="blog-row" href="/blog/${post.slug}/" data-reveal>
      <div class="blog-row__img"><img src="${post.image.src}" alt="${esc(post.image.alt)}" loading="lazy"></div>
      <div>
        <time datetime="2024-08-16">${esc(post.date)}</time>
        <h3>${esc(post.title)}</h3>
        <span class="text-link">Read the essay ${ARROW}</span>
      </div>
    </a>
    <p style="margin-top:32px" data-reveal><a class="text-link" href="/blog/">All posts ${ARROW}</a></p>
  </div>
</section>

<section class="section" id="about" aria-labelledby="about-title">
  <div class="dark">
    <div class="about-grid">
      <h2 id="about-title" data-reveal>${esc(HOME.aboutTitle)}</h2>
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
  }, topbar() + body);
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

/* ---------- all projects ---------- */

function projectsPage() {
  const cards = PROJECTS.map((p) => `
      <a class="proj" href="/case-studies/${p.slug}/" data-reveal>
        <div class="proj__media">
          <img src="${p.image.src}" alt="${esc(p.image.alt)}" decoding="async" loading="lazy">
          <span class="chip">${esc(p.discipline)}</span>
        </div>
        <div class="proj__body">
          <div class="proj__text">
            <h2 class="proj__title">${esc(p.sector)}</h2>
            <div class="proj__reveal"><div><p class="proj__meta">${esc(p.cardText || `${p.client} · ${p.year}`)}</p></div></div>
          </div>
          <span class="proj__go" aria-hidden="true">${ARROW}</span>
        </div>
      </a>`).join('');

  const body = `<main id="main">
<section class="page-head">
  <h1 data-reveal>All projects</h1>
  <p class="page-lede" data-reveal>Every case study, from the problem to the results.</p>
</section>
<section class="wrap" style="padding-bottom:160px">
  <div class="work-grid">${cards}
  </div>
</section>
</main>`;
  return page({
    title: `All projects — ${SITE.name}`,
    description: 'All product design projects by Christian Jeremiah: enterprise SaaS, machine translation, pet adoption, live music and ESG tools.',
  }, topbar('work') + body);
}

/* ---------- write ---------- */

const outputs = [
  ['index.html', homePage()],
  ['contact/index.html', contactPage()],
  ['blog/index.html', blogIndexPage()],
  ['projects/index.html', projectsPage()],
  ['blog/what-is-an-experience/index.html', articlePage()],
  ...PROJECTS.map((p, i) => [`case-studies/${p.slug}/index.html`, casePage(p, i)]),
];

for (const [rel, html] of outputs) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  console.log('wrote', rel, `(${(html.length / 1024).toFixed(1)} KB)`);
}
