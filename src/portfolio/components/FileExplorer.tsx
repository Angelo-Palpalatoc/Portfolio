import type { FileEntry, SectionId } from '../portfolio.types';

export function FileExplorer({
  files,
  active,
  narrow,
  onOpen,
}: {
  files: FileEntry[];
  active: SectionId;
  narrow: boolean;
  onOpen: (id: SectionId) => void;
}) {
  return (
    <nav
      className={`${narrow ? 'absolute bottom-0 left-12 top-[74px] z-[60] w-[250px]' : 'w-[226px] shrink-0'} overflow-y-auto border-r border-arduino-border bg-arduino-panel`}
      aria-label="Portfolio files"
    >
      <div className="px-[14px] pb-2 pt-[9px] font-arduino-code text-[11px] tracking-[0.12em] text-arduino-muted">
        EXPLORER
      </div>
      <div className="flex h-6 items-center gap-[6px] px-[14px] pb-1 pt-[2px] font-arduino-code text-[12px]">
        <span className="text-[9px] text-arduino-muted">▼</span> PORTFOLIO
      </div>
      {files.map((file, index) => (
        <div key={file.id}>
          {index === 5 && (
            <div className="flex h-6 items-center gap-[7px] pl-[26px] font-arduino-code text-[12px] text-[#9c9c9c]">
              <span className="text-[9px]">▾</span>projects
            </div>
          )}
          <button
            type="button"
            aria-current={file.id === active ? 'page' : undefined}
            onClick={() => onOpen(file.id)}
            className={`flex h-6 w-full items-center gap-[7px] border-l-2 bg-transparent pr-[10px] text-left font-arduino-code text-[12px] hover:bg-[#2d2d2e] ${file.project ? 'pl-11' : 'pl-[26px]'} ${file.id === active ? 'border-arduino-teal bg-[#2f3234] text-[#f2f2f2]' : 'border-transparent text-arduino-text'}`}
          >
            <span className="text-[9px] text-[#6b6b6b]">›</span>
            {file.name}
          </button>
        </div>
      ))}
      <div className="mt-[6px] border-t border-arduino-border px-[14px] py-3 font-arduino-code text-[11px] leading-[1.7] text-arduino-muted">
        <div>Santa Maria, Bulacan</div>
        <div>Philippines</div>
      </div>
    </nav>
  );
}
