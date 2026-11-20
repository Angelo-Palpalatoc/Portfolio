import { useEffect, useReducer, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { fileEntries, portfolioLinks, sectionInfo, sourceLineNumber } from './portfolio.data';
import { initialPortfolioState, portfolioReducer } from './portfolio.reducer';
import type { SectionId } from './portfolio.types';
import { ActivityBar } from './components/ActivityBar';
import { BootScreen } from './components/BootScreen';
import { FileExplorer } from './components/FileExplorer';
import { InfoPanel } from './components/InfoPanel';
import { SerialMonitor } from './components/SerialMonitor';
import { PortfolioSection } from './sections/PortfolioSection';
import { useRotatedTouchScroll } from './useRotatedTouchScroll';
import './tailwind.css';

type ArduinoPortfolioProps = {
  onOpenSecRename?: () => void;
  onReady?: () => void;
};

function stamp(): string {
  const time = new Date();
  const part = (value: number) => String(value).padStart(2, '0');
  return `[${part(time.getHours())}:${part(time.getMinutes())}:${part(time.getSeconds())}]`;
}

export default function ArduinoPortfolio({ onOpenSecRename, onReady }: ArduinoPortfolioProps) {
  const [state, dispatch] = useReducer(portfolioReducer, initialPortfolioState);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  useRotatedTouchScroll(contentRef);
  const [width, setWidth] = useState(1440);
  const compileTimer = useRef<number | undefined>(undefined);
  const clearTimer = useRef<number | undefined>(undefined);
  const narrow = width < 900;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // The room projects this surface with CSS transforms. clientWidth retains
    // the IDE's layout width, unlike getBoundingClientRect().width.
    const measure = () => setWidth(root.clientWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener('resize', measure);
    measure();
    onReady?.();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [onReady]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dispatch({ type: 'boot-wordmark' });
      return;
    }
    const interval = window.setInterval(() => dispatch({ type: 'boot-step' }), 290);
    const wordmark = window.setTimeout(
      () => {
        window.clearInterval(interval);
        dispatch({ type: 'boot-wordmark' });
      },
      4 * 290 + 350,
    );
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(wordmark);
    };
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(compileTimer.current);
      window.clearTimeout(clearTimer.current);
    },
    [],
  );

  const openFile = (id: SectionId) => {
    dispatch({ type: 'open-file', id, time: stamp() });
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const selectTab = (id: SectionId) => {
    dispatch({ type: 'select-tab', id });
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const runCompile = () => {
    window.clearTimeout(compileTimer.current);
    window.clearTimeout(clearTimer.current);
    dispatch({ type: 'compile-start', time: stamp() });
    compileTimer.current = window.setTimeout(() => {
      dispatch({ type: 'compile-success', time: stamp() });
      clearTimer.current = window.setTimeout(() => dispatch({ type: 'compile-clear' }), 3000);
    }, 800);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && state.drawerOpen) {
      event.stopPropagation();
      dispatch({ type: 'close-drawer' });
    }
  };

  return (
    <div
      ref={rootRef}
      className="arduino-ide relative flex h-full min-h-0 flex-col overflow-hidden bg-arduino-bg font-arduino-ui text-arduino-text"
      onKeyDown={onKeyDown}
    >
      {state.boot !== 'done' && (
        <BootScreen
          phase={state.boot}
          step={state.bootStep}
          narrow={narrow}
          onRun={() => dispatch({ type: 'boot-finish' })}
        />
      )}

      <header className="flex h-[30px] shrink-0 items-center gap-[14px] border-b border-arduino-border bg-arduino-panel px-[10px]">
        <span className="flex items-center gap-2 font-arduino-code text-[12px]">
          <span className="inline-block size-2 bg-arduino-teal" />
          PORTFOLIO.ino
        </span>
        <span className="flex-1" />
        <span className="font-arduino-code text-[11px] text-arduino-muted">Angelo Palpalatoc</span>
      </header>
      {!narrow && (
        <nav
          aria-label="IDE menu"
          className="flex h-6 shrink-0 items-center gap-1 border-b border-arduino-border bg-arduino-panel px-[6px] font-arduino-code text-[12px] text-arduino-muted"
        >
          <a
            href={portfolioLinks.cv}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-[2px] text-arduino-muted hover:bg-[#2a2d2e] hover:text-[#f2f2f2]"
            title="Open CV PDF"
          >
            File (CV)
          </a>
          <button
            type="button"
            className="bg-transparent px-2 py-[2px] text-arduino-muted hover:bg-[#2a2d2e] hover:text-[#f2f2f2]"
            onClick={() => dispatch({ type: 'toggle-serial' })}
          >
            View
          </button>
          <button
            type="button"
            className="bg-transparent px-2 py-[2px] text-arduino-muted hover:bg-[#2a2d2e] hover:text-[#f2f2f2]"
            onClick={runCompile}
          >
            Run
          </button>
          <button
            type="button"
            className="bg-transparent px-2 py-[2px] text-arduino-muted hover:bg-[#2a2d2e] hover:text-[#f2f2f2]"
            onClick={() => openFile('contact')}
          >
            Help
          </button>
        </nav>
      )}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-arduino-border bg-arduino-panel px-[10px]">
        {narrow && (
          <button
            type="button"
            className="flex h-[34px] w-11 flex-col justify-center gap-1 border border-arduino-border bg-transparent px-[11px]"
            aria-label="Open explorer"
            aria-expanded={state.drawerOpen}
            onClick={() => dispatch({ type: 'toggle-drawer' })}
          >
            <span className="h-[1.5px] bg-arduino-text" />
            <span className="h-[1.5px] bg-arduino-text" />
            <span className="h-[1.5px] bg-arduino-text" />
          </button>
        )}
        <button
          type="button"
          className="ide-round-button"
          aria-label="Verify"
          title="Verify"
          onClick={runCompile}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#0d0d0d"
            strokeWidth="2"
          >
            <path d="M3 8.5 L6.3 12 L13 4.5" />
          </svg>
        </button>
        <button
          type="button"
          className="ide-round-button"
          aria-label="Upload"
          title="Upload / contact"
          onClick={() => openFile('contact')}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#0d0d0d"
            strokeWidth="2"
          >
            <path d="M2 8 H12" />
            <path d="M8.5 4 L13 8 L8.5 12" />
          </svg>
        </button>
        <div className="flex h-7 min-w-[210px] max-w-[290px] items-center gap-2 overflow-hidden rounded-[14px] border border-[#3a3a3a] bg-[#1a1a1a] px-[12px] font-arduino-code text-[12px]">
          <span className="size-[6px] shrink-0 rounded-full bg-arduino-teal" aria-hidden="true" />
          <span className="truncate">Software Engineer · Full-Stack</span>
        </div>
        <span
          className={`truncate font-arduino-code text-[11px] ${state.compile === 'success' ? 'text-[#6a9955]' : 'text-arduino-muted'}`}
          role="status"
        >
          {state.compile === 'compiling'
            ? 'Compiling...'
            : state.compile === 'success'
              ? 'Success · 0 errors'
              : ''}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          className="flex size-[30px] shrink-0 items-center justify-center bg-transparent"
          aria-label="Serial monitor"
          title="Serial monitor"
          onClick={() => dispatch({ type: 'toggle-serial' })}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 18 18"
            fill="none"
            stroke={state.serialOpen ? '#00979c' : '#858585'}
            strokeWidth="1.3"
          >
            <rect x="2.5" y="3.5" width="13" height="11" />
            <path d="M5 7.5 H8 M5 10.5 H11" />
          </svg>
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        <ActivityBar
          active={state.active}
          onOpen={openFile}
          onExplorer={() => dispatch({ type: 'toggle-drawer' })}
        />
        {(!narrow || state.drawerOpen) && (
          <FileExplorer
            files={fileEntries}
            active={state.active}
            narrow={narrow}
            onOpen={openFile}
          />
        )}
        {narrow && state.drawerOpen && (
          <button
            type="button"
            className="absolute inset-x-0 bottom-0 top-[74px] z-50 bg-black/55"
            aria-label="Close explorer"
            onClick={() => dispatch({ type: 'close-drawer' })}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-[30px] shrink-0 overflow-x-auto border-b border-arduino-border bg-arduino-panel">
            {state.tabs.map((id) => {
              const file = fileEntries.find((entry) => entry.id === id)!;
              const active = state.active === id;
              return (
                <div
                  key={id}
                  className={`flex shrink-0 items-center gap-2 border-r border-arduino-border px-[7px] pl-[11px] font-arduino-code text-[12px] ${active ? 'bg-arduino-bg text-[#f2f2f2]' : 'bg-arduino-panel text-arduino-muted'}`}
                >
                  <button
                    type="button"
                    className="h-[29px] bg-transparent p-0"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => selectTab(id)}
                  >
                    {file.name}
                  </button>
                  <button
                    type="button"
                    className="bg-transparent px-[3px] py-[2px] leading-none text-[#6b6b6b] hover:text-arduino-text"
                    aria-label={`Close ${file.name} tab`}
                    onClick={() => dispatch({ type: 'close-tab', id })}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
          <main ref={contentRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="max-w-[980px] px-[30px] pb-11 pt-[26px] max-[899px]:px-4 max-[899px]:pb-9 max-[899px]:pt-5">
              <PortfolioSection
                id={state.active}
                onOpen={openFile}
                onOpenSecRename={onOpenSecRename}
              />
            </div>
          </main>
        </div>
        {width >= 1024 && <InfoPanel info={sectionInfo[state.active]} />}
      </div>

      <SerialMonitor
        lines={state.serial}
        open={state.serialOpen}
        onToggle={() => dispatch({ type: 'toggle-serial' })}
      />
      <footer className="flex h-6 shrink-0 items-center justify-end gap-4 border-t border-arduino-border bg-arduino-panel px-3 font-arduino-code text-[11px] text-arduino-muted">
        <span>Ln {sourceLineNumber[state.active]}, Col 18</span>
        <span>UTF-8</span>
        <span>C++</span>
        <span className="inline-flex items-center gap-[6px] text-arduino-text">
          <span className="size-[6px] rounded-full bg-arduino-teal" />
          Available for opportunities
        </span>
      </footer>
    </div>
  );
}
