import { portfolioLinks } from '../portfolio.data';
import type { BootPhase } from '../portfolio.types';

const loadingLabels = [
  'Loading skills........',
  'Loading projects......',
  'Loading experience....',
  'Connecting to GitHub..',
];

export function BootScreen({
  phase,
  step,
  narrow,
  onRun,
}: {
  phase: BootPhase;
  step: number;
  narrow: boolean;
  onRun: () => void;
}) {
  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center overflow-y-auto bg-arduino-bg p-6">
      {phase === 'loading' ? (
        <div className="my-auto w-full max-w-[420px] font-arduino-code text-sm leading-8">
          <div className="mb-3">Initializing developer...</div>
          {loadingLabels.slice(0, step).map((label) => (
            <div key={label} className="text-arduino-muted">
              {label} <span className="text-arduino-teal">OK</span>
            </div>
          ))}
          <span className="ide-caret inline-block h-4 w-2 bg-arduino-teal align-[-3px]" />
        </div>
      ) : (
        <div className="my-auto flex max-w-[760px] flex-col items-center gap-6 px-2 text-center">
          <div className="font-arduino-code text-[12px] font-bold tracking-[0.16em] text-[#28c6c4]">
            ANGELO PALPALATOC · FULL-STACK &amp; AI ENGINEER
          </div>
          <h1
            className={`m-0 text-balance font-arduino-ui font-bold leading-[1.24] tracking-[-0.025em] text-[#f4f6f7] ${
              narrow ? 'text-[26px]' : 'text-[36px]'
            }`}
          >
            <span className="font-medium text-[#b4bec2]">“Everyone can write code now,</span>
            <br />
            but few can <span className="text-[#28c6c4]">solve real-world problems</span>.”
          </h1>
          <div className="font-arduino-code text-[12.5px] leading-[1.85] text-arduino-muted">
            React / TypeScript • Python / FastAPI • PostgreSQL • LLM &amp; RAG
          </div>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            <button type="button" className="ide-primary-button" onClick={onRun}>
              [ RUN PORTFOLIO ]
            </button>
            <a
              className="ide-secondary-button"
              href={portfolioLinks.github}
              target="_blank"
              rel="noreferrer"
            >
              [ VIEW GITHUB ]
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
