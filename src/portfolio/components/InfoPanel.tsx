import { portfolioLinks } from '../portfolio.data';
import type { SectionInfo } from '../portfolio.types';
import { useCopyToClipboard } from '../useCopyToClipboard';

export function InfoPanel({ info }: { info: SectionInfo }) {
  const { copied, copy } = useCopyToClipboard(portfolioLinks.emailAddress, 1800);

  return (
    <aside className="w-[280px] shrink-0 overflow-y-auto border-l border-arduino-border bg-arduino-panel px-[18px] py-4 font-arduino-code">
      <div className="mb-[14px] text-[11px] tracking-[0.14em] text-arduino-muted">INFO</div>
      <div className="text-[11px] tracking-[0.1em] text-arduino-muted">SECTION</div>
      <div className="mb-5 mt-[6px] text-[13px] text-arduino-teal">{info.section}</div>
      <div className="text-[11px] tracking-[0.1em] text-arduino-muted">IN VIEW</div>
      <div className="mb-5 mt-[10px] flex flex-wrap gap-[6px]">
        {info.tech.map((tech) => (
          <span key={tech} className="border border-arduino-border px-2 py-1 text-[11px]">
            {tech}
          </span>
        ))}
      </div>
      <div className="text-[11px] tracking-[0.1em] text-arduino-muted">METADATA</div>
      <dl className="mt-[10px] flex flex-col gap-2">
        {info.meta.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-[10px] border-b border-[#2a2a2a] pb-2 text-[11.5px]"
          >
            <dt className="shrink-0 text-arduino-muted">{label}</dt>
            <dd className="min-w-0 break-words text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-[26px] flex flex-col gap-[10px] border-t border-arduino-border pt-4 text-[11.5px]">
        <a
          className="text-arduino-teal hover:underline"
          href={portfolioLinks.cv}
          target="_blank"
          rel="noreferrer"
        >
          ↓ Download CV (PDF)
        </a>
        <div className="flex items-center justify-between gap-2">
          <a
            className="min-w-0 truncate text-arduino-muted hover:text-arduino-teal"
            href={portfolioLinks.email}
            title={portfolioLinks.emailAddress}
          >
            ✉ {portfolioLinks.emailAddress}
          </a>
          <button
            type="button"
            onClick={copy}
            className="shrink-0 border border-arduino-border px-[6px] py-[2px] text-[10px] text-arduino-muted hover:border-arduino-teal hover:text-arduino-teal"
            aria-label="Copy email address"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <a
          className="text-arduino-muted hover:text-arduino-teal"
          href={portfolioLinks.github}
          target="_blank"
          rel="noreferrer"
        >
          ↗ github.com/Angelo-Palpalatoc
        </a>
        <a
          className="text-arduino-muted hover:text-arduino-teal"
          href={portfolioLinks.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          ↗ in/angelo-palpalatoc-66baa8329
        </a>
      </div>
    </aside>
  );
}
