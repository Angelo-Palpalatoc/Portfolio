import type { SerialLine } from '../portfolio.types';

export function SerialMonitor({
  lines,
  open,
  onToggle,
}: {
  lines: SerialLine[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section
      className="shrink-0 border-t border-arduino-border bg-arduino-panel"
      aria-label="Serial Monitor"
    >
      <div className={`flex h-[26px] items-center ${open ? 'border-b border-arduino-border' : ''}`}>
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="flex h-[26px] items-center gap-2 bg-transparent px-3 font-arduino-code text-[12px] tracking-[0.1em] hover:text-white"
        >
          <span className="text-[9px] text-arduino-muted">{open ? '▾' : '▸'}</span>SERIAL MONITOR
          {!open && <span className="tracking-normal text-arduino-muted">— tap to expand</span>}
        </button>
        <span className="flex-1" />
        <div className="flex gap-[6px] px-3 text-arduino-muted" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M2 4 H14 M2 8 H14 M2 12 H10" />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="3" y="7" width="10" height="7" />
            <path d="M5.5 7 V4.5 A2.5 2.5 0 0 1 10.5 4.5 V7" />
          </svg>
        </div>
      </div>
      {open && (
        <div className="h-[120px] overflow-y-auto bg-arduino-bg px-[14px] pb-[10px] pt-2 font-arduino-code text-[12.5px] leading-[1.55]">
          {lines.map((line, index) => (
            <div key={`${line.time}-${index}`}>
              <span className="text-arduino-muted">{line.time}</span>{' '}
              <span className={line.tone === 'success' ? 'text-[#6a9955]' : ''}>
                {line.message}
              </span>
            </div>
          ))}
          <div>
            <span className="text-arduino-teal">&gt;</span>{' '}
            <span className="text-arduino-muted">Ready.</span>
            <span className="ide-caret ml-1 inline-block h-[13px] w-[7px] bg-arduino-teal align-[-2px]" />
          </div>
        </div>
      )}
    </section>
  );
}
