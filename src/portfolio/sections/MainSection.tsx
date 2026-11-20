import { featuredProjects, heroStack, portfolioLinks } from '../portfolio.data';
import type { SectionId } from '../portfolio.types';
import { CodePreview, Eyebrow } from './SectionPieces';

const codeLines = [
  <span className="text-[#6a9955]">// main.ino</span>,
  '',
  <>
    <span className="text-[#569cd6]">#include</span>{' '}
    <span className="text-[#ce9178]">"developer.h"</span>
  </>,
  '',
  <>
    <span className="text-[#4ec9b0]">Developer</span> me = {'{'}
  </>,
  <>
    {'    '}
    <span className="text-[#dcdcaa]">name</span>:{' '}
    <span className="text-[#ce9178]">"Angelo Palpalatoc"</span>,
  </>,
  <>
    {'    '}
    <span className="text-[#dcdcaa]">role</span>:{' '}
    <span className="text-[#ce9178]">"Full-Stack Software Engineer"</span>,
  </>,
  <>
    {'    '}
    <span className="text-[#dcdcaa]">focus</span>: {'{'}
  </>,
  <>
    {'        '}
    <span className="text-[#ce9178]">"Full-Stack Web &amp; Mobile Development"</span>,
  </>,
  <>
    {'        '}
    <span className="text-[#ce9178]">"React / TypeScript / Python"</span>,
  </>,
  <>
    {'        '}
    <span className="text-[#ce9178]">"APIs, PostgreSQL &amp; AI Workflows"</span>
  </>,
  '    }',
  '};',
  '',
  <>
    <span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">setup</span>(){' '}
    {'{'}
  </>,
  <>
    {'    '}developer.<span className="text-[#dcdcaa]">initialize</span>();
  </>,
  '}',
];

export function MainSection({
  onExplore,
  onOpen,
}: {
  onExplore: () => void;
  onOpen: (id: SectionId) => void;
}) {
  return (
    <>
      <CodePreview lines={codeLines} />
      <div className="mt-9 max-w-[740px]">
        <h1 className="mb-[6px] text-[38px] font-bold leading-[1.15] tracking-[-0.02em] text-[#f2f2f2]">
          Angelo Palpalatoc
        </h1>
        <div className="font-arduino-code text-[13px] tracking-[0.04em] text-arduino-teal">
          Full-Stack Software Engineer
        </div>
        <div className="mt-2 font-arduino-code text-[12.5px] text-arduino-muted">
          React / TypeScript • Python / FastAPI • PostgreSQL • AI document workflows
        </div>
        <p className="mt-[22px] text-pretty text-[16.5px] leading-[1.65]">
          I build clear, reliable software across the full stack, from responsive interfaces to
          APIs, PostgreSQL data flows, and AI-assisted document processing. I focus on making
          complex workflows easy to understand and use.
        </p>
        <div className="mt-6 flex flex-wrap gap-[10px]">
          {['FULL-STACK', 'AI DOCUMENT WORKFLOWS', 'RESPONSIVE WEB & MOBILE'].map((item, index) => (
            <div
              key={item}
              className={`min-w-[130px] flex-[1_1_150px] border-l-2 pl-[10px] ${index === 0 ? 'border-arduino-teal text-arduino-teal' : 'border-arduino-border'}`}
            >
              <div className="font-arduino-code text-[11.5px] tracking-[0.04em]">{item}</div>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button type="button" className="ide-primary-button !px-5" onClick={onExplore}>
            [ EXPLORE PROJECTS ]
          </button>
          <a
            href={portfolioLinks.cv}
            target="_blank"
            rel="noreferrer"
            className="ide-secondary-button !px-[18px]"
          >
            [ DOWNLOAD CV ]
          </a>
          <a
            href={portfolioLinks.email}
            className="ide-secondary-button !px-[18px] !tracking-normal"
          >
            palpalatocangelo@gmail.com
          </a>
        </div>
        <div className="mt-[30px] flex flex-wrap gap-[10px]">
          {heroStack.map((item) => (
            <span
              key={item}
              className="border border-arduino-border px-[10px] py-[5px] font-arduino-code text-[11.5px] text-arduino-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="mt-10 max-w-[880px]" aria-label="Featured projects">
        <Eyebrow>FEATURED PROJECTS</Eyebrow>
        <div className="grid grid-cols-3 gap-px border border-arduino-border bg-arduino-border max-[819px]:grid-cols-1">
          {featuredProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpen(project.id)}
              className="group flex flex-col items-start justify-between bg-arduino-panel p-5 text-left transition-colors hover:bg-[#2a2d2e]"
            >
              <div>
                <div
                  className={`mb-2 font-arduino-code text-[10.5px] tracking-[0.1em] ${project.work ? 'text-[#d19a66]' : 'text-[#4ec9b0]'}`}
                >
                  {project.tag}
                </div>
                <div className="text-[16px] font-semibold text-[#f2f2f2] group-hover:text-arduino-teal">
                  {project.name}
                </div>
                <p className="mt-2 font-arduino-ui text-[13.5px] leading-[1.55] text-arduino-text">
                  {project.summary}
                </p>
              </div>
              <span className="mt-4 font-arduino-code text-[11px] text-arduino-teal">
                Open {project.file} →
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
