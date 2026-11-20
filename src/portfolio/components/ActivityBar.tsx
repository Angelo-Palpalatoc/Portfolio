import type { SectionId } from '../portfolio.types';

const railItems: {
  id: SectionId | 'explorer';
  title: string;
  icon: 'folder' | 'chip' | 'columns' | 'search';
}[] = [
  { id: 'explorer', title: 'Explorer', icon: 'folder' },
  { id: 'skills', title: 'skills.ino', icon: 'chip' },
  { id: 'experience', title: 'experience.ino', icon: 'columns' },
  { id: 'lighthouse', title: 'projects/lighthouse.ino', icon: 'search' },
];

function RailIcon({ type }: { type: 'folder' | 'chip' | 'columns' | 'search' | 'person' }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      {type === 'folder' && <path d="M2.5 5.5 H8 L9.5 7.5 H17.5 V15.5 H2.5 Z" />}
      {type === 'chip' && (
        <>
          <rect x="6" y="6" width="8" height="8" />
          <path d="M3 8 H6 M3 12 H6 M14 8 H17 M14 12 H17 M8 3 V6 M12 3 V6 M8 14 V17 M12 14 V17" />
        </>
      )}
      {type === 'columns' && (
        <>
          <rect x="3" y="4" width="6" height="12" />
          <rect x="11" y="4" width="6" height="12" />
        </>
      )}
      {type === 'search' && (
        <>
          <circle cx="9" cy="9" r="5" />
          <path d="M12.8 12.8 L17 17" />
        </>
      )}
      {type === 'person' && (
        <>
          <circle cx="10" cy="7" r="3" />
          <path d="M4 17 C4 13.5 6.7 12 10 12 C13.3 12 16 13.5 16 17" />
        </>
      )}
    </svg>
  );
}

export function ActivityBar({
  active,
  onOpen,
  onExplorer,
}: {
  active: SectionId;
  onOpen: (id: SectionId) => void;
  onExplorer: () => void;
}) {
  return (
    <nav
      className="z-[70] flex w-12 shrink-0 flex-col items-center border-r border-arduino-border bg-arduino-panel pb-3 pt-[10px]"
      aria-label="IDE shortcuts"
    >
      {railItems.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            title={item.title}
            aria-label={item.title}
            aria-current={selected ? 'page' : undefined}
            className={`flex h-11 w-12 items-center justify-center border-l-2 bg-transparent ${selected ? 'border-arduino-teal text-arduino-teal' : 'border-transparent text-arduino-muted'} hover:text-arduino-text`}
            onClick={item.id === 'explorer' ? onExplorer : () => onOpen(item.id as SectionId)}
          >
            <RailIcon type={item.icon} />
          </button>
        );
      })}
      <span className="flex-1" />
      <button
        type="button"
        title="about.ino"
        aria-label="about.ino"
        aria-current={active === 'about' ? 'page' : undefined}
        className={`flex h-11 w-12 items-center justify-center border-l-2 bg-transparent ${active === 'about' ? 'border-arduino-teal text-arduino-teal' : 'border-transparent text-arduino-muted'} hover:text-arduino-text`}
        onClick={() => onOpen('about')}
      >
        <RailIcon type="person" />
      </button>
    </nav>
  );
}
