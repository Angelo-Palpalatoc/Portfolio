import { portfolioLinks } from '../portfolio.data';
import type { BootPhase } from '../portfolio.types';

const loadingLabels = [
  'Loading skills........',
  'Loading projects......',
  'Loading experience....',
  'Connecting to GitHub..',
];

const wordmark = ` █████╗ ███╗   ██╗ ██████╗ ███████╗██╗      ██████╗
██╔══██╗████╗  ██║██╔════╝ ██╔════╝██║     ██╔═══██╗
███████║██╔██╗ ██║██║  ███╗█████╗  ██║     ██║   ██║
██╔══██║██║╚██╗██║██║   ██║██╔══╝  ██║     ██║   ██║
██║  ██║██║ ╚████║╚██████╔╝███████╗███████╗╚██████╔╝
╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝`;

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
        <div className="my-auto flex flex-col items-center gap-7">
          {narrow ? (
            <div className="pl-[0.22em] font-arduino-code text-[40px] font-bold tracking-[0.22em]">
              ANGELO
            </div>
          ) : (
            <pre className="m-0 whitespace-pre font-arduino-code text-[12px] leading-[1.15] text-arduino-teal">
              {wordmark}
            </pre>
          )}
          <div className="text-center font-arduino-code text-[13px] leading-[1.9] text-arduino-muted">
            <div className="text-arduino-text">Software Engineer</div>
            <div>Full-Stack • React / TypeScript • Python / FastAPI • AI workflows</div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
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
