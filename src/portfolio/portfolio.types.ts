export type SectionId =
  | 'main'
  | 'about'
  | 'skills'
  | 'experience'
  | 'contact'
  | 'lighthouse'
  | 'autorename'
  | 'portfolio';

export type FileEntry = {
  id: SectionId;
  name: string;
  path: string;
  project?: boolean;
};

export type SectionInfo = {
  section: string;
  tech: string[];
  meta: [label: string, value: string][];
};

export type ArchitectureNode = {
  label: string;
  detail: string;
  relation?: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type ExperienceEntry = {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
};

export type FeaturedProject = {
  id: Extract<SectionId, 'lighthouse' | 'autorename' | 'portfolio'>;
  file: string;
  name: string;
  tag: string;
  summary: string;
  work?: boolean;
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectTradeoff = {
  title: string;
  text: string;
};

export type SerialLine = {
  time: string;
  message: string;
  tone?: 'success';
};

export type BootPhase = 'loading' | 'wordmark' | 'done';
type CompileStatus = 'idle' | 'compiling' | 'success';

export type PortfolioState = {
  boot: BootPhase;
  bootStep: number;
  active: SectionId;
  tabs: SectionId[];
  drawerOpen: boolean;
  serialOpen: boolean;
  serial: SerialLine[];
  compile: CompileStatus;
};

export type PortfolioAction =
  | { type: 'boot-step' }
  | { type: 'boot-wordmark' }
  | { type: 'boot-finish' }
  | { type: 'open-file'; id: SectionId; time: string }
  | { type: 'select-tab'; id: SectionId }
  | { type: 'close-tab'; id: SectionId }
  | { type: 'toggle-drawer' }
  | { type: 'close-drawer' }
  | { type: 'toggle-serial' }
  | { type: 'compile-start'; time: string }
  | { type: 'compile-success'; time: string }
  | { type: 'compile-clear' };
