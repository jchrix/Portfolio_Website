// Copy and facts for the portfolio. Every claim here comes from the previous site's pages.
// Edit text here, then run: node scripts/build-site.mjs

export const SITE = {
  name: 'Christian Jeremiah',
  brand: 'Jrix-IT',
  role: 'Product Designer',
  title: 'Christian Jeremiah — Product Designer',
  year: '2024',
  // Where the contact form sends messages. Leave empty to show the social links only.
  contactEmail: '',
  links: {
    linkedin: 'https://www.linkedin.com/in/jrixit/',
    behance: 'https://www.behance.net/jrixit',
  },
};

export const HOME = {
  headline: 'Product design for tech teams.',
  lead: 'Collaborating with tech teams to design innovative product experiences that solve problems and deliver measurable value.',
  workTitle: 'My work',
  skillsTitle: 'Skillset',
  toolsTitle: 'Tools',
  blogTitle: 'My blog',
  aboutTitle: "I'm Jerry",
  about: [
    'I believe great digital products is where intuitive user experience meets valuable solutions. As a Product Designer, I help enterprise and startups create digital experiences that feel effortless and intuitive. My approach is user-first, research-driven, and impact-focused, ensuring every design serves both users and business goals.',
    'I lead end-to-end design projects from research and prototyping to testing and implementation working closely with cross functional teams to create intuitive, easy to use, high-performing digital products that balance user needs and business success.',
  ],
  skills: [
    ['Design Workshop', 'Align the team’s vision and understanding, speed up decision making through collaboration.'],
    ['Product Research', 'User research, market research, competitor research, concept testing, usability tests.'],
    ['UX Design', 'User research, information architecture, wireframing, prototyping, usability testing.'],
    ['UI Design', 'Design system creation and maintenance, documentation, interaction and visual design.'],
    ['Prototyping', 'Low fidelity, high fidelity, clickable and interactive prototypes.'],
    ['AI Integration & Training', 'Integrating AI into existing products and training AI models for specific tasks.'],
  ],
  tools: [
    ['Figma, Adobe Suite, Sketch', 'Desktop, tablet and mobile design'],
    ['Framer', 'Web design and development'],
    ['Documentation', 'Zeroheight, Supernova, Zeplin'],
    ['Research tools', 'Python, Maze, Hotjar, Otter.ai'],
    ['Process management', 'Jira, Monday, Notion'],
    ['AI tools', 'OpenAI, N8N, Perplexity'],
  ],
};

export const CONTACT = {
  title: 'Get in touch.',
  headline: "Let's create innovative product experiences together.",
  ask: 'Tell me about the product, the team and the problem you need solved.',
  note: 'Your message opens in your email app, addressed to me. Nothing is stored on this site.',
};

// Projects, in the order they appear on the homepage.
// image: a mockup from the project's own work, in /images.
export const PROJECTS = [
  {
    slug: 'keepit',
    name: 'Keepit',
    client: 'Keepit',
    headline: 'Implementing Rapid Recovery',
    summary: 'Microsoft 365 backup and restore for Keepit’s enterprise platform, led end to end from UX.',
    workTitle: 'Microsoft Backup Integration',
    discipline: 'Product design',
    role: 'UX Designer',
    industry: 'SaaS, data protection',
    year: '2024',
    timeline: '5 months',
    team: 'PM, frontend and backend engineers, QA, solution architect',
    image: { src: '/images/wxAZFpSCaTJ52mUOgfUpejUe0.png', alt: 'Keepit backup platform on a laptop in a server rack' },
    intro: [
      'Among other projects such as data backup configuration design, policy creation and multi-app management, I led the design and implementation of Microsoft 365 backup integration into Keepit’s existing backup solution.',
      'The goal was to build a secure, scalable and user-friendly experience that lets enterprise users back up and restore Microsoft 365 workloads, including OneDrive, SharePoint, Teams and Exchange, through the Keepit platform. This meant rethinking the onboarding flow, aligning with Microsoft’s APIs and speeding up data restore, while simplifying complex workflows and fixing pain points in both function and usability.',
    ],
    problem: 'Integrate a Microsoft backup solution into the Keepit platform so that backup and restore take far less time, with enterprise-level security and ease of use.',
    objectives: [
      'Integrate Microsoft 365 in a way that fits existing user flows',
      'Improve backup and restore performance and usability',
    ],
    sections: [
      {
        heading: 'My role',
        paragraphs: ['I led UX from strategy to delivery: identifying gaps, designing end-to-end flows, validating designs through testing, and aligning closely with engineering and product managers.'],
      },
      {
        heading: 'Process',
        paragraphs: [
          'The work followed four phases: discovery, define, design and delivery. I ran stakeholder interviews to uncover technical roadblocks, reviewed the Microsoft Graph APIs and their data limits, and facilitated workshops to align on scope and value.',
          'The product lifecycle was broken into four phases for the Microsoft 365 integration: onboarding, data management, data restore and integration deletion. A journey map and first flows went to an alignment meeting with project managers and front-end and back-end developers.',
          'Low-fidelity designs went to a first round of testing. The feedback shaped a high-fidelity prototype, and a second usability test validated the decisions. A missing piece, the notification component, was designed and documented in Supernova, our design documentation database.',
        ],
      },
      {
        heading: 'How we measured it',
        paragraphs: ['Error rate, completion rate, learnability and satisfaction, so we could see where the design worked and where it needed fine-tuning.'],
      },
      {
        heading: 'Other project contributions',
        list: ['Anomaly detection', 'Dashboard 2.0 redesign', 'Public link protection', 'Policy creation and management'],
        paragraphs: ['I contributed as a team member to these projects too, collaborating on the final design.'],
      },
    ],
    stats: [
      { figure: '73%', text: 'faster backup and restore on 7 TB of test data' },
      { figure: 'Hours → minutes', text: 'backup and recovery time for enterprise data' },
    ],
    results: [
      'Enterprise users can now meet data recovery and backup regulations and the standards for data compliance.',
    ],
    tools: 'Figma, Supernova, Zoom, Slack',
    methods: 'Journey mapping, design reviews, usability testing, edge case documentation. Agile sprints, weekly syncs, async design handoff.',
  },
  {
    slug: 'google-transtale',
    name: 'Google Translate',
    client: 'Google Translate',
    headline: 'Multi-User Translation Case Study',
    summary: 'Duo Mode and Friend Mode for Google Translate: two devices for one conversation across languages.',
    workTitle: 'Multi-User Translation Solution',
    discipline: 'Product design (UI/UX)',
    role: 'UX Designer',
    industry: 'Machine translation',
    year: '2024',
    timeline: '3 months',
    team: 'Solo project, supported by secondary research and peer reviews',
    image: { src: '/images/QtEMspxLYWwMDpTyBicdpou55NU.png', alt: 'A phone running Google Translate on a steel surface' },
    intro: [
      'Google Translate helps people communicate across language barriers, but sharing a single device between speakers creates awkward interactions. To solve this, I designed and prototyped two new features: Duo Mode and Friend Mode.',
      'They let each person use their own device, make meaningful connections between speakers of different languages, and expand Google Translate’s potential user base.',
    ],
    problem: 'Relying on one phone to translate between several people, whether friends or strangers, limits communication and collaboration across language barriers. Tourists, international students and business people have to pass one device back and forth, which breaks the flow of the conversation.',
    objectives: [
      'Design easier communication modes, Duo Mode and Friend Mode, to make conversation more efficient',
    ],
    sections: [
      {
        heading: 'Research',
        paragraphs: ['I mapped the user journey, including activities, feelings, pain points and needs, and ran desk research, a focus group and a diary study.'],
        list: [
          'Translation works better when the device is closer to the speaker.',
          'Sharing a device makes the UI hard to use: text legibility, light and dark mode, and accessibility.',
          'Translate is hard to use offline, in flight mode or without a connection.',
        ],
      },
      {
        heading: 'Define',
        paragraphs: [
          'How might travellers, students and professionals talk with people who speak another language without passing one device back and forth? I set the scope around real-time conversation between people who speak different languages, then built personas, journey maps, user flows and wireframes before visual design.',
        ],
      },
      {
        heading: 'Two modes, one conversation',
        paragraphs: [
          'Mono Mode is the current experience: one device handles translation for both speakers. It is simple, but it means passing the device back and forth.',
          'Duo Mode connects two devices temporarily. Each person uses their own phone, the conversation flows, nothing is saved, and no personal information is shared. It suits short exchanges with strangers.',
          'Friend Mode is for budding friendships across a language barrier. Each person keeps their own device with a more persistent connection, combining efficiency with features that help people build relationships.',
        ],
      },
    ],
    stats: [
      { figure: '73%', text: 'total error rate, higher than expected' },
      { figure: '51%', text: 'completion rate' },
      { figure: '87%', text: 'learnability' },
    ],
    results: [
      'Testing the translation itself as a prototype was hard. In the usability test, most errors came from navigation and user-flow problems, which pointed to the next iterations.',
    ],
    tools: 'Figma, Notion, Python, Octoparse',
    methods: 'Desk research, focus groups, diary study, journey mapping, prototyping.',
    external: { label: 'Read the concept on Behance', href: 'https://www.behance.net/gallery/187720847/Google-Translate-Conversation-Concept' },
  },
  {
    slug: 'rislly',
    name: 'Rislly',
    client: 'Rislly Sp. z o.o.',
    headline: 'Pet Adoption Management',
    summary: 'A pet adoption platform that verifies breeders and shelters, designed for Poznań, Poland.',
    workTitle: 'Pet Adoption Management',
    discipline: 'Product design (UI/UX)',
    role: 'Product Designer',
    industry: 'SaaS',
    year: '2023',
    timeline: '13 months',
    team: 'Product managers, key business stakeholders and two other designers',
    image: { src: '/images/GFQpthtPaQVJlnt3I6MWL3xE5AI.png', alt: 'Rislly pet adoption site on a laptop on a warm orange plinth' },
    intro: [
      'Rislly makes pet adoption safer, more authentic and easier. It verifies breeders and pet care providers so every animal comes from a trusted source.',
      'Beyond adoption, Rislly builds a community where pet owners can connect, share experiences, and find services and products that support healthier lives for pets and owners, all in one trusted ecosystem.',
    ],
    problem: 'Existing platforms in Poznań, Poland make it hard to find pet services safely. Unstructured listings create security risks and poor care, and general marketplaces are not built for adoption paperwork.',
    objectives: [
      'Understand the challenges in the pet adoption ecosystem',
      'Design a solution that streamlines adoption for shelters, breeders and adopters',
    ],
    sections: [
      {
        heading: 'My role',
        paragraphs: ['I led product design, UX and UI, and worked through the whole arc with the team: customer insights and ideation, the project vision, planning and scope, interface and experience, and implementation.'],
      },
      {
        heading: 'Market research',
        paragraphs: [
          'In 2023, 49% of Polish households owned a dog and 40% owned a cat. Municipalities cared for about 71,000 homeless dogs in 2022, and the number keeps rising. Many prospective owners turn to OLX, a general marketplace that does not support adoption paperwork, and report confusing navigation.',
        ],
      },
      {
        heading: 'User interviews',
        paragraphs: [
          'I interviewed recent adopters and shelter and breeder representatives in Poznań. All participants were 18 to 34 and had adopted a pet between 2020 and 2025.',
        ],
        list: [
          'Motivation: 42% seek companionship, 28.6% want emotional support, 28.6% want to add to their family.',
          'Concerns: 57.1% worry about unpredictable behaviour, verifying health and authenticity, and complicated procedures.',
        ],
      },
      {
        heading: 'Insight',
        paragraphs: ['Companionship is the leading motivation, so the product presents pets as companions, not acquisitions, and frames the adoption journey around the relationship.'],
      },
      {
        heading: 'Define and solve',
        paragraphs: [
          'How might we improve document management and verification for shelters, breeders and adopters in Poznań, so that trust, efficiency and a smooth adoption come together? The flow supports document uploads, clear onboarding for shelters and breeders, and a smooth journey for adopters, and it led into wireframes and interface design.',
          'The high-fidelity prototype gives shelters, breeders and adopters personal profiles to track the whole adoption journey: document verification, application status and communication.',
        ],
      },
    ],
    stats: [],
    results: [
      'Documentation, implementation and testing followed. Early adoption was lower than expected. Follow-up research showed the target market had been defined too narrowly, so the team planned a Polish-language version tailored to the local market.',
    ],
    tools: 'Figma, Notion, Typeform, Google Forms, Perplexity AI',
    methods: 'Desk research, user interviews, journey and user-flow mapping.',
  },
  {
    slug: 'opnr',
    name: 'OPNR',
    client: 'OPNR',
    headline: 'OPNR Redesign',
    summary: 'A landing page redesign that helps emerging musicians win opening slots at live shows.',
    workTitle: 'OPNR Redesign',
    discipline: 'Product design (UI/UX)',
    role: 'Product Designer',
    industry: 'SaaS',
    year: '2023',
    timeline: '6 weeks',
    team: 'Product designer, business stakeholders, PM, front-end developer',
    image: { src: '/images/cZzwme1hXwiG1zPyEXzTXWBnnyI.png', alt: 'The OPNR landing page on a laptop on a dark sculpted surface' },
    intro: [
      'OPNR connects emerging musicians with live performance opportunities by securing opening slots at concerts and venues.',
      'After a monetization strategy brought in $25,000 in funding and attracted new users, I led the redesign of OPNR’s landing page. The aim was to help new musicians get opening slots, and to show clearly how OPNR helps artists advance their careers.',
    ],
    problem: 'The existing landing page did not match the company’s goals, did not engage users, and weakened the product experience.',
    objectives: [
      'Improve clarity of the offer and user onboarding',
      'Align the UI with the business growth strategy',
      'Increase interaction, retention and conversion',
    ],
    sections: [
      {
        heading: 'Research',
        paragraphs: [
          'Business data showed three user groups, not the two the client had assumed. That insight sharpened who the page speaks to. Desk research found about 103,000 musicians in the US in 2022, clustered in Los Angeles, New York, Nashville and Orlando, with Chicago ranking high for live events.',
        ],
        list: ['Competitor analysis: ReverbNation, Bandcamp and Gigmor, compared on value proposition, onboarding, monetization and engagement.'],
      },
      {
        heading: 'Product audit',
        paragraphs: ['I audited the original page against usability heuristics. The findings:'],
        list: [
          'The hero spoke only to musicians, leaving out event managers and fans.',
          'Hierarchy, button styles and section headers were inconsistent, so the page felt unpolished.',
          'Long paragraphs made the page hard to scan.',
          'The testimonials took almost half the page, with no call to action or clear next step.',
        ],
      },
      {
        heading: 'Solution',
        paragraphs: [
          'Low-fidelity wireframes tested layout and flow quickly. High-fidelity design followed, with consistent branding, clear calls to action and a clean hierarchy, so the page communicates OPNR’s value and guides visitors on.',
        ],
      },
    ],
    stats: [{ figure: '$25,000', text: 'in funding from the monetization strategy' }],
    results: [
      'Visitors understand what OPNR offers within seconds of landing.',
      'The layout is organized and easier to navigate, with clear calls to action that guide people to sign up or explore further.',
      'The page now speaks to event managers and fans as well as musicians, widening OPNR’s reach.',
    ],
    tools: 'Figma, Google Slides, Notion',
    methods: 'Product audit, competitor benchmarking, UX strategy alignment, interactive prototyping. Success measured by conversion rate, bounce rate, click-through rate and retention.',
  },
  {
    slug: 'girintec',
    name: 'Girintec',
    client: 'Girintec',
    headline: 'Sustainability Platform for Startups',
    summary: 'An ESG tool that helps early-stage tech startups build sustainability into their product from the start.',
    workTitle: 'Sustainable Profile',
    discipline: 'Product design (UI/UX)',
    role: 'Product Designer',
    industry: 'SaaS',
    year: '2023',
    timeline: '9 weeks',
    team: 'Solo project, supported by desk research and peer feedback sessions',
    image: { src: '/images/9HAbXzUngeFLQZIrjI7KN9fSkw.png', alt: 'The Girintec sustainable tech startups page on a laptop' },
    intro: [
      'Girintec helps early-stage tech startups build Environmental, Social and Governance (ESG) principles into their products from the start. It empowers founders to build responsible, scalable and investment-ready products.',
      'It is a practical tool that bridges sustainability theory and real execution, with actionable insights and decision support grounded in ESG compliance and environmental impact metrics.',
    ],
    problem: 'Many startup founders know sustainability matters, but lack practical tools, frameworks and guidance to put it into product development. Sustainability stays theoretical rather than part of the business strategy.',
    objectives: [
      'Equip founders with tools to make ESG-informed decisions',
      'Highlight key data and trends to support sustainable product development',
      'Build a user-friendly, accessible interface for early-stage startups',
    ],
    sections: [
      {
        heading: 'My role',
        paragraphs: ['As the sole designer, I owned UX research, concept development and UI design, from ideation through to high-fidelity wireframes.'],
      },
      {
        heading: 'Discovery',
        paragraphs: ['Market research, affinity mapping, UI ideation and peer feedback sessions validated the need for the platform.'],
        list: [
          'An estimated 1.35 million tech startups are founded every year.',
          'ICT accounts for up to 2.8% of global emissions, but can cut emissions by 15 to 20%.',
          'Many founders know about sustainability but struggle to apply it.',
          'No existing platform is built to help startups create ESG-aligned products.',
        ],
      },
      {
        heading: 'Define',
        paragraphs: [
          'How might we help tech startup founders embed sustainability and ESG best practice into early product development, without overwhelming them? The MVP scope covered ESG-aligned ideation tools, sustainability insights for tech verticals, and interface design for an MVP prototype. Backend work, real-time data integrations and the business model were out of scope.',
        ],
      },
      {
        heading: 'Key features',
        list: [
          'ESG regional alignment: insights tailored to location',
          'Sustainability profile: a personal overview of the startup’s sustainability efforts',
          'ESG goal tracker: progress towards ESG goals',
        ],
      },
      {
        heading: 'Design',
        paragraphs: [
          'The user flow guides founders step by step, from onboarding through to monitoring progress. Key screens: onboarding, sustainability profile setup, ESG regional alignment, goal setting, the ESG and product monitoring dashboard, and continuous monitoring with feedback.',
          'Low-fidelity wireframes in black and white checked placement and navigation with stakeholders and potential users. Validated flows then moved to a polished, interactive high-fidelity interface.',
        ],
      },
    ],
    stats: [],
    results: [
      'The platform gives founders intuitive tools to align products with ESG principles and track sustainability metrics from the ground up.',
      'With an accessible, clear interface, sustainability data and ESG decisions become straightforward for founders to act on.',
    ],
    tools: 'Figma, Notion, Miro, Google Forms',
    methods: 'Secondary research, trend analysis, affinity mapping, heuristic evaluation, competitive analysis, simulated user feedback sessions.',
  },
];

// Pictures from each project's own work, shown in the reading column.
// `at` is the index of the section each one follows. Captions describe what the picture shows.
export const FIGURES = {
  keepit: [
    { at: 0, src: '/images/BDyU1nGh1WKJ2jp9hgBR0qugvXw.png', alt: 'Ideation board with sticky notes and sketched flows', caption: 'An ideation board: sticky notes and sketched flows from the early design work.' },
    { at: 1, src: '/images/5MPZ4a9LjNG4qovQGQvDwSKp0.png', alt: 'Design process board with flows grouped in columns', caption: 'The design process board, with the flows grouped by phase across the integration.' },
    { at: 2, src: '/images/E1xRjpq07URpSKh5QabKS1UYpKA.png', alt: 'Low-fidelity grey wireframes of backup screens', caption: 'Low-fidelity wireframes that went into the first round of usability testing.' },
  ],
  'google-transtale': [
    { at: 0, src: '/images/VdVFvT4136cV6bW6Xtxjxl6kIw.png', alt: 'User journey map laid out in a grid of stages', caption: 'The user journey map, with activities, feelings and pain points for each stage.' },
    { at: 1, src: '/images/tLM7CYiSisqdXgDDRKBhQUWnJys.png', alt: 'User flow diagram with branching screens', caption: 'The user flow for the translation journey, mapped screen by screen.' },
    { at: 2, src: '/images/GJQOBRykfg9d3KtbyD2NxV3oLk4.png', alt: 'Low-fidelity mobile wireframes, several with QR code screens', caption: 'Low-fidelity mobile wireframes, including the screens that show a QR code.' },
  ],
  rislly: [
    { at: 1, src: '/images/e1Pj1tpYFwwWVTQiGuJZwje2PT8.png', alt: 'Pet adoption flow diagram with decision points', caption: 'The pet adoption flow, mapped around document checks and verification steps.' },
    { at: 2, src: '/images/u0dJsNXNwSPeXnwM0HS82H1dOI.png', alt: 'Pet profile screen with a parrot photograph and details', caption: 'A pet profile screen, with photograph, breed, sex, age, location and bio.' },
    { at: 4, src: '/images/hYDyk22X4pZwmPWikhapQWsRoQ.png', alt: 'Pet management screens on a laptop', caption: 'Pet management screens on a laptop, listing each pet with its details.' },
  ],
  opnr: [
    { at: 0, src: '/images/mOkyo1kHpjzuECV4KgMhKHic34.png', alt: 'Market research slide with a map of US musician clusters', caption: 'Market research: where musicians cluster across the US, by metro area.' },
    { at: 1, src: '/images/bodorYE5mmVxCtLU95T7tOPOoAk.png', alt: 'Product audit slide listing findings by section', caption: 'The product audit of the original landing page, run against usability heuristics.' },
    { at: 2, src: '/images/qvBAKamLhnWCSCf6wvFygexrQ.png', alt: 'Competitor analysis board comparing platforms', caption: 'Competitor analysis of ReverbNation, Bandcamp and Gigmor, compared side by side.' },
  ],
  girintec: [
    { at: 1, src: '/images/NHHxmoe7KzN33prl3WAU4cSwlQ.png', alt: 'Dashboard with a world map, charts and metric cards', caption: 'The monitoring dashboard, with product metrics and a regional view of sustainability data.' },
    { at: 3, src: '/images/XPXimFrhrE3g8j1YUOYRBIE0N8.png', alt: 'Sustainable profile screen with company details and products', caption: 'The sustainable profile, with company details, goals and a products section.' },
    { at: 4, src: '/images/I7SXzokbec2xeiOGM9rYm2XfDs.jpg', alt: 'Sustainable profile page with a forest photograph and sections for mission and goals', caption: 'The sustainable profile at full size, with the overview and the mission section.' },
  ],
};

export const BLOG = {
  title: 'All blog posts',
  posts: [
    {
      slug: 'what-is-an-experience',
      date: 'Aug 16, 2024',
      title: 'Creating Unforgettable Product/User Experiences (That Users Actually Love)',
      image: { src: '/images/tY9GWifuQ13Xr5jcy4Y91qwElk.webp', alt: 'Illustration with the words "What is an Experience?"' },
    },
  ],
};
