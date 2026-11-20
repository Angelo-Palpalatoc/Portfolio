import type {
  ArchitectureNode,
  ExperienceEntry,
  FileEntry,
  SectionId,
  SectionInfo,
  SkillGroup,
} from './portfolio.types';

export const portfolioLinks = {
  email: 'mailto:palpalatocangelo@gmail.com',
  github: 'https://github.com/Angelo-Palpalatoc',
  linkedin: 'https://www.linkedin.com/in/angelo-palpalatoc-66baa8329/',
} as const;

export const fileEntries: FileEntry[] = [
  { id: 'main', name: 'main.ino', path: 'main.ino' },
  { id: 'about', name: 'about.ino', path: 'about.ino' },
  { id: 'skills', name: 'skills.ino', path: 'skills.ino' },
  { id: 'experience', name: 'experience.ino', path: 'experience.ino' },
  { id: 'contact', name: 'contact.ino', path: 'contact.ino' },
  { id: 'lighthouse', name: 'lighthouse.ino', path: 'projects/lighthouse.ino', project: true },
  { id: 'autorename', name: 'autorenamer.ino', path: 'projects/autorenamer.ino', project: true },
  { id: 'portfolio', name: 'portfolio.ino', path: 'projects/portfolio.ino', project: true },
];

export const sectionInfo: Record<SectionId, SectionInfo> = {
  main: {
    section: 'main.ino',
    tech: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'AI integration'],
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
    tech: ['React', 'TypeScript', 'Git', 'Jira'],
    meta: [
      ['roles', '3'],
      ['latest', 'Jan–Aug 2025'],
      ['mode', 'Freelance'],
    ],
  },
  contact: {
    section: 'contact.ino',
    tech: ['Email', 'LinkedIn', 'GitHub'],
    meta: [
      ['email', 'palpalatocangelo@'],
      ['timezone', 'GMT+8'],
      ['status', 'Available'],
    ],
  },
  lighthouse: {
    section: 'projects/lighthouse.ino',
    tech: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'AI integration'],
    meta: [
      ['status', 'Work project'],
      ['role', 'Full-stack / AI integration'],
      ['links', 'none yet'],
    ],
  },
  autorename: {
    section: 'projects/autorenamer.ino',
    tech: ['Kotlin', 'Compose', 'ML Kit OCR', 'Offline processing'],
    meta: [
      ['status', 'Personal project'],
      ['role', 'Android app'],
      ['mode', 'Sample data'],
    ],
  },
  portfolio: {
    section: 'projects/portfolio.ino',
    tech: ['React', 'TypeScript', 'CSS', 'Vite', 'Projective transforms'],
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
  'Tailwind',
  'Kotlin',
  'ML Kit OCR',
];

export const lighthouseStack = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'REST APIs',
  'Streaming chat',
  'LLM assistant',
  'Retrieval context',
  'AI document extraction',
];

export const secRenameStack = [
  'Kotlin Multiplatform',
  'Compose Multiplatform',
  'ML Kit OCR',
  'Offline-first processing',
  'Single and batch workflow',
];

export const roomPortfolioStack = [
  'React',
  'TypeScript',
  'CSS',
  'Vite',
  'Projective transforms',
  'Responsive interaction',
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
    label: 'AI extraction + retrieval context',
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
  { label: 'Embedded React project demos', detail: 'AutoRename and interactive showcases' },
];

export const productionSkills: SkillGroup[] = [
  {
    label: 'LANGUAGES',
    items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'Kotlin'],
  },
  { label: 'FRONTEND', items: ['React', 'Redux', 'Tailwind CSS', 'Compose Multiplatform'] },
  { label: 'BACKEND', items: ['FastAPI', 'REST API design', 'Server-Sent Events'] },
  { label: 'DATA', items: ['PostgreSQL', 'Relational data modeling'] },
  {
    label: 'AI / DOCUMENTS',
    items: ['AI document-extraction integration', 'Streaming chat', 'ML Kit OCR'],
  },
  {
    label: 'TOOLS',
    items: ['Git', 'GitHub', 'Bitbucket', 'NPM', 'Webpack', 'VS Code', 'Figma', 'Jira'],
  },
  {
    label: 'PERFORMANCE',
    items: ['Code splitting', 'Lazy loading', 'Asset and page-load optimization'],
  },
];

export const workingKnowledge = ['Node.js', 'Docker', 'LLM integration', 'RAG', 'Embeddings'];

export const experienceEntries: ExperienceEntry[] = [
  {
    role: 'Software Engineer',
    company: 'Ally Public Adjusting (Freelance)',
    dates: 'January – August 2025',
    bullets: [
      'Designed and built a responsive chat-based web application, owning front-end implementation end to end',
      'Integrated APIs and handled data flow to the database',
      'Built with reusable, modular components; optimized asset handling and load performance',
      'Used AI-assisted development tooling to accelerate delivery, reviewing and testing every change before commit',
      'Worked independently, owning scope and quality without day-to-day supervision',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Hooli Software',
    dates: 'August – October 2024',
    bullets: [
      'Built a responsive web application in React and TypeScript',
      'Translated Figma designs into consistent, functional interfaces across devices',
      'Worked in an agile team using Git, sprint planning, and code review',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Hooli Software',
    dates: 'August – September 2023',
    bullets: [
      'Completed an intensive training program in the company stack (React, TypeScript, HTML, CSS)',
      'Resolved design implementation issues of increasing complexity',
      'Worked directly with senior developers on code quality and workflow',
    ],
  },
];

export const aboutProjects = [
  {
    title: 'FIRST PROFESSIONAL WORK',
    text: 'At Hooli Software, I translated Figma designs into responsive React interfaces, resolved component-overlap issues, and learned to turn a design system into working code.',
  },
  {
    title: 'LIGHTHOUSE',
    text: 'I learned to understand an insurance-claims business, contribute to frontend, database, and architecture work, and support document processing with RAG-grounded AI assistance.',
  },
  {
    title: 'AUTORENAME',
    text: "An offline-first document-renaming app inspired by a financial institution's digitization needs. It keeps sensitive files on-device while making the workflow simple to use.",
  },
  {
    title: 'ROOM PORTFOLIO',
    text: 'An interactive room-to-monitor experience built with React and TypeScript. It taught me cursor-driven camera movement, perspective alignment, responsive interaction, and smooth transitions.',
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
