import { portfolioLinks } from '../portfolio.data';
import { useCopyToClipboard } from '../useCopyToClipboard';
import { CodePreview } from './SectionPieces';

const lines = [
  <span className="text-[#6a9955]">// contact.ino</span>,
  '',
  <>
    <span className="text-[#569cd6]">if</span> (interested_in_working_together) {'{'}
  </>,
  <>
    {'    '}
    <span className="text-[#dcdcaa]">contact</span>(
    <span className="text-[#ce9178]">"palpalatocangelo@gmail.com"</span>);
  </>,
  '}',
];

export function ContactSection() {
  const { copied, copy } = useCopyToClipboard(portfolioLinks.emailAddress);

  return (
    <div className="max-w-[720px]">
      <CodePreview lines={lines} />
      <h2 className="mb-[10px] mt-8 text-[30px] font-bold tracking-[-0.02em] text-[#f2f2f2]">
        Let's talk
      </h2>
      <p className="mb-[26px] text-[16.5px] leading-[1.7]">
        Available for opportunities — full-stack, front-end heavy, or API and data integration work.
        Based in Santa Maria, Bulacan, Philippines.
      </p>
      <div className="flex flex-wrap gap-3">
        <a href={portfolioLinks.email} className="ide-primary-button !h-[46px]">
          [ EMAIL ME ]
        </a>
        <button
          type="button"
          onClick={copy}
          className="ide-secondary-button !h-[46px]"
          aria-live="polite"
        >
          {copied ? '[ ✓ EMAIL COPIED ]' : '[ COPY EMAIL ]'}
        </button>
        <a
          href={portfolioLinks.cv}
          target="_blank"
          rel="noreferrer"
          className="ide-secondary-button !h-[46px]"
        >
          [ DOWNLOAD CV ]
        </a>
        <a
          href={portfolioLinks.linkedin}
          target="_blank"
          rel="noreferrer"
          className="ide-secondary-button !h-[46px]"
        >
          [ LINKEDIN ]
        </a>
        <a
          href={portfolioLinks.github}
          target="_blank"
          rel="noreferrer"
          className="ide-secondary-button !h-[46px]"
        >
          [ GITHUB ]
        </a>
      </div>
    </div>
  );
}
