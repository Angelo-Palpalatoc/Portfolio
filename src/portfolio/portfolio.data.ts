import type {
  ArchitectureNode,
  ExperienceEntry,
  FeaturedProject,
  FileEntry,
  ProjectMetric,
  ProjectTradeoff,
  SectionId,
  SectionInfo,
  SkillGroup,
} from './portfolio.types';

export const portfolioLinks = {
  emailAddress: 'palpalatocangelo@gmail.com',
  email: 'mailto:palpalatocangelo@gmail.com',
  gmailCompose: 'https://mail.google.com/mail/?view=cm&fs=1&to=palpalatocangelo%40gmail.com',
  github: 'https://github.com/Angelo-Palpalatoc',
  linkedin: 'https://www.linkedin.com/in/angelo-palpalatoc-66baa8329/',
  cv: '/Angelo-Palpalatoc-CV.pdf',
  portfolioRepo: 'https://github.com/Angelo-Palpalatoc/Portfolio',
  secRenamerRepo: 'https://github.com/Angelo-Palpalatoc/AutomaticFileName',
} as const;

export function getEmailLinkProps(): {
  href: string;
  target?: '_blank';
  rel?: 'noreferrer';
} {
  const isTouchDevice =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse), (max-width: 700px)').matches;
  if (isTouchDevice) return { href: portfolioLinks.email };
  return { href: portfolioLinks.gmailCompose, target: '_blank', rel: 'noreferrer' };
}

export const fileEntries: FileEntry[] = [
  { id: 'main', name: 'main.ino', path: 'main.ino' },
  { id: 'about', name: 'about.ino', path: 'about.ino' },
  { id: 'skills', name: 'skills.ino', path: 'skills.ino' },
  { id: 'experience', name: 'experience.ino', path: 'experience.ino' },
  { id: 'contact', name: 'contact.ino', path: 'contact.ino' },
  { id: 'lighthouse', name: 'lighthouse.ino', path: 'projects/lighthouse.ino', project: true },
  { id: 'autorename', name: 'sec_renamer.ino', path: 'projects/sec_renamer.ino', project: true },
  { id: 'portfolio', name: 'portfolio.ino', path: 'projects/portfolio.ino', project: true },
];

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'lighthouse',
    file: 'lighthouse.ino',
    name: 'Lighthouse',
    tag: 'WORK PROJECT',
    work: true,
    summary:
      'Generative AI claims workspace using LLM streaming chat and RAG grounded in uploaded documents for accurate, source-backed guidance.',
  },
  {
    id: 'autorename',
    file: 'sec_renamer.ino',
    name: 'Sec Renamer',
    tag: 'ANDROID · OFFLINE OCR',
    summary:
      'Offline-first Kotlin & Compose Multiplatform app for on-device ML Kit OCR and safe batch document renaming.',
  },
  {
    id: 'portfolio',
    file: 'portfolio.ino',
    name: 'Room Portfolio',
    tag: 'INTERACTIVE WEB',
    summary:
      'Cursor-driven room-to-monitor portfolio built with React, TypeScript, Tailwind CSS, and CSS projective homography.',
  },
];

export const sectionInfo: Record<SectionId, SectionInfo> = {
  main: {
    section: 'main.ino',
    tech: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'GenAI / RAG'],
    meta: [
      ['role', 'Full-Stack Software Engineer'],
      ['location', 'Santa Maria, PH'],
      ['status', 'Available'],
    ],
  },
  about: {
    section: 'about.ino',
    tech: ['React', 'TypeScript', 'Tailwind', 'Python', 'FastAPI'],
    meta: [
      ['degree', 'B.S. Cpt. Eng.'],
      ['school', 'PUP Santa Maria'],
      ['years', '2021–2025'],
    ],
  },
  skills: {
    section: 'skills.ino',
    tech: ['TypeScript', 'React', 'FastAPI', 'PostgreSQL', 'Kotlin', 'ML Kit OCR'],
    meta: [
      ['areas', '7 groups'],
      ['AI', 'workflow integration'],
      ['mobile', 'offline-first OCR'],
    ],
  },
  experience: {
    section: 'experience.ino',
    tech: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Git', 'Jira'],
    meta: [
      ['roles', '4'],
      ['latest', 'Aug 2026–Present'],
      ['mode', 'Full-Stack'],
    ],
  },
  contact: {
    section: 'contact.ino',
    tech: ['Email', 'CV (PDF)', 'LinkedIn', 'GitHub'],
    meta: [
      ['email', 'palpalatocangelo@gmail.com'],
      ['timezone', 'GMT+8'],
      ['status', 'Available'],
    ],
  },
  lighthouse: {
    section: 'projects/lighthouse.ino',
    tech: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'LLM / GenAI', 'RAG'],
    meta: [
      ['status', 'Work project'],
      ['role', 'Full-stack / AI integration'],
      ['links', 'Private (NDA)'],
    ],
  },
  autorename: {
    section: 'projects/sec_renamer.ino',
    tech: ['Kotlin', 'Compose', 'ML Kit OCR', 'Offline processing'],
    meta: [
      ['status', 'Personal project'],
      ['role', 'Android app'],
      ['mode', 'Interactive demo'],
    ],
  },
  portfolio: {
    section: 'projects/portfolio.ino',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vitest', 'Projective transforms'],
    meta: [
      ['status', 'Personal project'],
      ['role', 'Design and development'],
      ['inspiration', 'Henry Heffernan'],
    ],
  },
};

export const sourceLineNumber: Record<SectionId, number> = {
  main: 17,
  about: 38,
  skills: 96,
  experience: 74,
  contact: 5,
  lighthouse: 148,
  autorename: 112,
  portfolio: 126,
};

export const heroStack = [
  'React',
  'TypeScript',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'GenAI / RAG',
  'Tailwind',
  'Kotlin',
  'ML Kit OCR',
];

export const lighthouseStack = [
  'React',
  'TypeScript',
  'Jotai',
  'Tailwind CSS',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'REST APIs',
  'Generative AI',
  'Streaming chat',
  'LLM assistant',
  'Retrieval-Augmented Generation (RAG)',
  'AI document extraction',
];

export const lighthouseMetrics: ProjectMetric[] = [
  { value: '156', label: 'Commits shipped across UI & API' },
  { value: '10+', label: 'Workspace views & feature modules' },
  { value: '19', label: 'Custom React data & workflow hooks' },
  { value: '26', label: 'Backend & PostgreSQL model files' },
];

export const lighthouseTradeoffs: ProjectTradeoff[] = [
  {
    title: 'ZIP-in-chat vs. unpacked Documents view',
    text: 'Showing an uploaded ZIP as a single archive inside the chat thread kept conversations clean, while unpacking individual files inside the Documents tab let adjusters preview, recategorize, or soft-delete specific records without losing context.',
  },
  {
    title: 'Explicit processing states & provenance separation',
    text: 'Color-coded processing, completion, and failure indicators prevented duplicate uploads on slow extractions. Across the 8-service architecture, separating machine-extracted suggestions from verified claim facts kept AI assistance helpful without silently overwriting authoritative records.',
  },
];

export const secRenameStack = [
  'Kotlin Multiplatform',
  'Compose Multiplatform',
  'ML Kit OCR',
  'Offline-first processing',
  'Single and batch workflow',
];

export const secRenamerMetrics: ProjectMetric[] = [
  { value: '23', label: 'Kotlin multiplatform & Android files' },
  { value: '17', label: 'Automated unit & workflow test suites' },
  { value: '30', label: 'Synthetic OCR & edge-case fixtures' },
  { value: '100%', label: 'On-device processing, zero cloud upload' },
];

export const secRenamerTradeoffs: ProjectTradeoff[] = [
  {
    title: 'On-device ML Kit OCR over cloud OCR',
    text: 'Financial certificates contain sensitive corporate data and often run on restricted networks. Running OCR and company matching locally eliminates network latency and privacy risk at the cost of extra rule-based normalization for noisy scans.',
  },
  {
    title: 'Non-destructive verified copies over in-place rename',
    text: 'Writing a verified copy to the chosen export folder with duplicate checks keeps original scans intact for audit trails, preventing accidental data loss if OCR misreads a damaged page.',
  },
];

export const roomPortfolioStack = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'CSS',
  'Vite',
  'Vitest',
  'Web Audio API',
  'Projective transforms',
  'Responsive interaction',
];

export const roomPortfolioTradeoffs: ProjectTradeoff[] = [
  {
    title: 'Dual-monitor CSS 3D homography over Three.js / WebGL',
    text: 'Projecting a 1280px desktop and a live interactive portrait CV onto calibrated physical monitor corners with CSS 3D matrices keeps real DOM text razor-sharp, scrolling native, and keyboard accessibility intact without a heavy WebGL runtime.',
  },
  {
    title: 'Staged WebP assets, code splitting & synthesized Web Audio',
    text: 'Converting the room and desktop wallpaper to WebP, lazy-loading the Arduino IDE, and synthesizing tactile UI clicks with the Web Audio API (zero external audio files) keep initial load light while preserving a responsive, tactile desk experience.',
  },
];

export const lighthouseArchitecture: ArchitectureNode[] = [
  {
    label: 'React + TypeScript — Web app UI',
    detail: 'Responsive claim workspace',
    relation: 'calls Portal API',
  },
  {
    label: 'Python + FastAPI — Portal API',
    detail: 'Document and chat endpoints',
    relation: 'reads and writes data',
  },
  {
    label: 'PostgreSQL + Object Storage',
    detail: 'Claims, metadata, and document files',
    relation: 'provides evidence context',
  },
  {
    label: 'AI extraction + Retrieval-Augmented Generation (RAG)',
    detail: 'Grounded document evidence',
    relation: 'streams assistant responses',
  },
  { label: 'LLM assistant + streaming chat', detail: 'Guided explanations and questions' },
];

export const secRenameArchitecture: ArchitectureNode[] = [
  {
    label: 'Compose Multiplatform / Kotlin',
    detail: 'Single and batch document UI',
    relation: 'updates workflow state',
  },
  {
    label: 'Kotlin ViewModel + StateFlow',
    detail: 'Source, review, and save state',
    relation: 'reads selected documents',
  },
  {
    label: 'Android ContentResolver + on-device OCR',
    detail: 'Local text extraction',
    relation: 'matches names and rules',
  },
  {
    label: 'Company matching + SEC filename rules',
    detail: 'Suggested document names',
    relation: 'queues work and progress',
  },
  {
    label: 'Kotlin coroutines + batch queue',
    detail: 'Single and batch coordination',
    relation: 'writes a verified copy',
  },
  { label: 'ExportStore + CopyIntegrity', detail: 'Duplicate checks and safe device export' },
];

export const roomPortfolioArchitecture: ArchitectureNode[] = [
  {
    label: 'React + TypeScript + Vite',
    detail: 'Application shell and state',
    relation: 'updates camera pose',
  },
  {
    label: 'Camera pose + projection math',
    detail: 'Monitor alignment and zoom',
    relation: 'drives room and desk views',
  },
  {
    label: 'CSS transforms + responsive interaction',
    detail: 'Cursor, touch, and keyboard behavior',
    relation: 'loads the portfolio runtime',
  },
  {
    label: 'React + typed portfolio state',
    detail: 'Arduino IDE components and content',
    relation: 'opens embedded projects',
  },
  { label: 'Embedded React project demos', detail: 'Sec Renamer and interactive showcases' },
];

export const productionSkills: SkillGroup[] = [
  {
    label: 'LANGUAGES',
    items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'Kotlin'],
  },
  {
    label: 'FRONTEND',
    items: ['React', 'Redux', 'Jotai', 'Tailwind CSS', 'Compose Multiplatform'],
  },
  { label: 'BACKEND', items: ['FastAPI', 'REST API design', 'Server-Sent Events'] },
  { label: 'DATA', items: ['PostgreSQL', 'Relational data modeling'] },
  {
    label: 'AI / DOCUMENTS',
    items: ['AI document-extraction integration', 'Streaming chat', 'ML Kit OCR'],
  },
  {
    label: 'TOOLS',
    items: ['Git', 'GitHub', 'Bitbucket', 'NPM', 'Vite', 'Vitest', 'VS Code', 'Figma', 'Jira'],
  },
  {
    label: 'PERFORMANCE',
    items: ['Code splitting', 'Lazy loading', 'Asset and page-load optimization'],
  },
];

export const workingKnowledge = ['Node.js', 'Docker', 'LLM integration', 'RAG', 'Embeddings'];

export const experienceEntries: ExperienceEntry[] = [
  {
    role: 'Independent Software Engineer',
    company: 'Personal & Portfolio Projects',
    dates: 'August 2026 – Present',
    bullets: [
      'Engineered Sec Renamer, an offline-first Kotlin & Compose Multiplatform Android app using on-device ML Kit OCR, SEC filename rules, and 17 automated test suites',
      'Designed and built this interactive 3D Room Portfolio in React, TypeScript, Tailwind CSS, Vite, and Vitest with calibrated CSS projective monitor mapping',
      'Deepened backend and AI-systems fluency across multi-service FastAPI pipelines, PostgreSQL provenance modeling, and retrieval-grounded workflows',
    ],
  },
  {
    role: 'Software Engineer (Freelance)',
    company: 'Ally Public Adjusting (US-Based)',
    dates: 'January – August 2026',
    bullets: [
      'Owned frontend implementation across 10+ workspace views, 19 custom data hooks, and Jotai global state for a real-time chat and insurance claims document platform (156 commits)',
      'Delivered multi-claim switching, multi-channel file and ZIP archive uploads, 30-day soft-delete recovery, per-claim Action Plans, and an editable Letter Builder auto-filled from extracted claim data',
      'Contributed across 26 FastAPI Portal API, SQLAlchemy PostgreSQL model, and async helper files to connect frontend workflows to persistent claim state',
      'Used AI-assisted engineering workflows with disciplined self-review and testing to accelerate delivery while maintaining clean, modular code',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Hooli Software (US-Based)',
    dates: 'August – October 2024',
    bullets: [
      'Built a responsive web application in React and TypeScript',
      'Translated Figma designs into consistent, functional interfaces across devices',
      'Worked in an agile team using Git, sprint planning, and code review',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Hooli Software (US-Based)',
    dates: 'August – September 2023',
    bullets: [
      'Completed an intensive 1-month training program in the company stack (React, TypeScript, HTML, CSS)',
      'Resolved minor to moderate design implementation issues of increasing complexity',
      'Worked directly with senior developers on code quality and project workflow',
    ],
  },
];

export const honorsAndCertifications = [
  {
    kicker: 'ACADEMIC HONOR',
    title: 'Cum Laude — B.S. Computer Engineering',
    detail: 'Polytechnic University of the Philippines (2021–2025)',
  },
  {
    kicker: 'ROBOTICS AWARDS',
    title: '2× Arduino Crafting Winner',
    detail: 'Champion (2025) & 1st Place (2024)',
  },
  {
    kicker: 'CERTIFICATIONS',
    title: 'Passed ISC2 Cybersecurity',
    detail: 'Civil Service Eligible (Professional)',
  },
] as const;

export const aboutProjects = [
  {
    title: 'FIRST PROFESSIONAL WORK',
    text: 'At Hooli Software, I translated Figma designs into responsive React interfaces, resolved component-overlap issues, and learned to turn a design system into working code.',
  },
  {
    title: 'LIGHTHOUSE',
    text: 'I owned frontend delivery across 10+ views, contributed to FastAPI and PostgreSQL layers, and built workflows for a Generative AI LLM assistant using RAG grounded in uploaded claim documents to prevent hallucinations.',
  },
  {
    title: 'SEC RENAMER',
    text: "An offline-first document-renaming app inspired by a financial institution's digitization needs. It keeps sensitive files on-device while making single and batch workflows simple to use.",
  },
  {
    title: 'ROOM PORTFOLIO',
    text: 'An interactive room-to-monitor experience built with React, TypeScript, and Tailwind CSS. It taught me cursor-driven camera movement, perspective alignment, responsive interaction, and smooth transitions.',
  },
];

export const practiceItems = [
  {
    title: 'User-first thinking',
    text: 'I understand the user journey and business rules before building, then design the simplest path through the product.',
  },
  {
    title: 'End-to-end delivery',
    text: 'I connect the interface, API, database, and processing logic into one clear user flow.',
  },
  {
    title: 'Visible system feedback',
    text: 'I show loading, progress, streaming, success, and error states so users can understand what the system is doing.',
  },
  {
    title: 'Privacy by design',
    text: 'I keep sensitive document workflows local when possible and preserve original files throughout the process.',
  },
  {
    title: 'Responsive component design',
    text: 'I build reusable interfaces for desktop, touch, keyboard, and mobile experiences.',
  },
  {
    title: 'Performance-focused implementation',
    text: 'I use lightweight components, lazy loading, code splitting, and optimized assets to keep the experience responsive.',
  },
  {
    title: 'Practical validation',
    text: 'I test realistic samples, edge cases, responsive behavior, and file integrity before delivery.',
  },
  {
    title: 'Architecture communication',
    text: 'I document responsibilities, data flow, and technology choices so systems are easier to understand and maintain.',
  },
];
