import {
  lighthouseArchitecture,
  lighthouseMetrics,
  lighthouseStack,
  lighthouseTradeoffs,
  portfolioLinks,
  roomPortfolioArchitecture,
  roomPortfolioStack,
  roomPortfolioTradeoffs,
  secRenameArchitecture,
  secRenamerMetrics,
  secRenamerTradeoffs,
  secRenameStack,
} from '../portfolio.data';
import type { SectionId } from '../portfolio.types';
import {
  Architecture,
  Eyebrow,
  MetricStrip,
  PairCards,
  ProjectHeading,
  ProjectPager,
  TechChips,
  TradeoffCards,
} from './SectionPieces';

export function LighthouseProject({ onOpen }: { onOpen?: (id: SectionId) => void }) {
  return (
    <>
      <ProjectHeading
        file="lighthouse.ino"
        name="Lighthouse"
        category="WORK PROJECT"
        work
        description="Generative AI insurance claims workspace powered by LLM assistance and RAG to deliver accurate, document-grounded outputs tied directly to uploaded claim files — minimizing hallucinations."
      />
      <MetricStrip items={lighthouseMetrics} />
      <PairCards
        items={[
          {
            title: 'PROBLEM',
            text: 'Insurance claims processing runs on dense paperwork. Adjusters manually read, sort, and verify large volumes of claim documents — slow, repetitive, and error-prone — while generic LLM chat without document grounding risks inaccurate or hallucinated answers.',
          },
          {
            title: 'SOLUTION',
            text: "A Generative AI claims workspace that ingests uploaded documents, indexes them for Retrieval-Augmented Generation (RAG), and powers a streaming LLM assistant that answers strictly from grounded claim evidence while guiding the adjuster's next steps.",
          },
        ]}
      />
      <div className="mb-9">
        <Eyebrow>MY CONTRIBUTION</Eyebrow>
        <p className="mb-[14px] max-w-[760px] text-pretty text-[16px] leading-[1.7]">
          I owned the frontend UI/UX across 10+ workspace views and contributed across the FastAPI
          and PostgreSQL layers, shipping 156 commits for claim management, RAG-grounded Generative
          AI chat, and document-processing workflows.
        </p>
        <ul className="list-disc pl-[18px] text-[15.5px] leading-[1.9]">
          <li>
            Owned responsive React, TypeScript, and Jotai interfaces across 10 feature modules and
            19 custom hooks — including the Claim Workspace, Multi-Claim List, Documents Manager,
            Action Plan, and Recently Deleted recovery views
          </li>
          <li>
            Implemented streamed chat responses, color-coded document processing states, and
            multi-channel uploads with ZIP archive ingestion (displayed as an archive in chat and
            unpacked per file in Documents)
          </li>
          <li>
            Built the interactive per-claim Action Plan and an editable Letter Builder with tone
            controls, extracted claim-field auto-fill, and pre-download confirmation
          </li>
          <li>
            Contributed across 26 FastAPI Portal API, SQLAlchemy PostgreSQL model, and async helper
            files while working within an 8-service architecture (Portal API, decision engine,
            orchestrator, and specialized extraction/chat workers)
          </li>
        </ul>
      </div>
      <div className="mb-9 grid grid-cols-[1fr_300px] items-start gap-8 max-[1179px]:grid-cols-1">
        <div>
          <Eyebrow>ENGINEERING CHALLENGES</Eyebrow>
          <div className="flex flex-col gap-5">
            {[
              {
                title: 'Designing for clear multi-claim workflows',
                text: 'Adjusters switch between active claims, documents, and next steps constantly. I structured global Jotai claim state, soft-delete recovery (30-day retention + restore/purge), and persistent claim context so users never lose track of which file belongs to which claim.',
              },
              {
                title: 'Real-time interaction and status feedback',
                text: 'I implemented streamed chat responses and explicit processing, completion, and failure indicators so users can see extraction progress in real time, while optimizing reusable components and asset handling to keep the workspace responsive.',
              },
              {
                title: 'Full-stack work with AI-assisted processing',
                text: 'Alongside frontend ownership, I connected FastAPI endpoints and PostgreSQL models to the UI and studied the end-to-end 8-service pipeline — where document extraction produces machine-extracted suggestions kept distinct from verified claim facts.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-arduino-border bg-arduino-panel p-5">
                <div className="mb-2 text-[15.5px] font-semibold text-[#f2f2f2]">{item.title}</div>
                <p className="text-pretty text-[15px] leading-[1.7]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <Architecture nodes={lighthouseArchitecture} />
      </div>
      <TradeoffCards items={lighthouseTradeoffs} />
      <div className="mb-8 border border-arduino-border bg-arduino-panel px-5 py-4 font-arduino-code text-[12px] text-arduino-muted">
        Repository &amp; live demo: <span className="text-[#d19a66]">Private (NDA)</span> — public
        overview only; proprietary rules and internal datasets are intentionally omitted.
      </div>
      <TechChips items={lighthouseStack} />
      <ProjectPager next={{ id: 'autorename', name: 'Sec Renamer' }} onOpen={onOpen} />
    </>
  );
}

export function SecRenameProject({
  onOpenDemo,
  onOpen,
}: {
  onOpenDemo?: () => void;
  onOpen?: (id: SectionId) => void;
}) {
  return (
    <div className="max-w-[940px]">
      <ProjectHeading
        file="sec_renamer.ino"
        name="Sec Renamer"
        category="PERSONAL PROJECT"
        description="An offline-first Android app that helps organize sensitive SEC corporate documents with on-device OCR and guided renaming."
      />
      <MetricStrip items={secRenamerMetrics} label="SCOPE & VALIDATION" />
      <PairCards
        items={[
          {
            title: 'WORKFLOW',
            text: 'Users can scan or select a document, review the OCR-suggested company name, and export verified copies one at a time or in a batch.',
          },
          {
            title: 'PRIVACY BY DESIGN',
            text: 'Document recognition, company matching, and SEC filename rules run entirely on-device, keeping sensitive files offline and preserving every original scan.',
          },
        ]}
      />
      <Architecture nodes={secRenameArchitecture} />
      <TradeoffCards items={secRenamerTradeoffs} />
      <div className="mb-7 border border-arduino-border bg-arduino-panel p-6">
        <Eyebrow>GUIDED DEMO &amp; SOURCE</Eyebrow>
        <p className="mb-[18px] max-w-[760px] text-pretty text-[15.5px] leading-[1.7]">
          Try the mobile interface with fictional sample documents. The demo shows single-file and
          batch flows using prepared results; it does not access visitor files or the camera.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="ide-primary-button !px-5" onClick={onOpenDemo}>
            [ OPEN SEC RENAMER DEMO ]
          </button>
          <a
            href={portfolioLinks.secRenamerRepo}
            target="_blank"
            rel="noreferrer"
            className="ide-secondary-button !px-5"
          >
            [ VIEW ON GITHUB ↗ ]
          </a>
        </div>
      </div>
      <TechChips items={secRenameStack} />
      <ProjectPager
        prev={{ id: 'lighthouse', name: 'Lighthouse' }}
        next={{ id: 'portfolio', name: 'Room Portfolio' }}
        onOpen={onOpen}
      />
    </div>
  );
}

export function RoomPortfolioProject({ onOpen }: { onOpen?: (id: SectionId) => void }) {
  return (
    <div className="max-w-[940px]">
      <ProjectHeading
        file="portfolio.ino"
        name="Room Portfolio"
        category="PERSONAL PROJECT"
        description="An interactive portfolio that turns my real room and computer setup into a guided, cursor-driven experience."
      />
      <PairCards
        items={[
          {
            title: 'ROOM TO SCREEN',
            text: 'The visitor moves from the room, to the desk, and finally into the monitor — with my Arduino IDE portfolio on the main screen and my CV on the portrait display. Hover, keyboard, touch, and reduced-motion behavior keep the journey accessible.',
          },
          {
            title: 'REFERENCE-DRIVEN DESIGN',
            text: "Henry Heffernan's portfolio inspired the immersive direction. I studied the interaction, then created my own room, monitor projection, Arduino-style portfolio, and desktop app experience.",
          },
        ]}
      />
      <Architecture nodes={roomPortfolioArchitecture} />
      <TradeoffCards items={roomPortfolioTradeoffs} />
      <div className="mb-7 border border-arduino-border bg-arduino-panel p-6">
        <Eyebrow>WHAT I LEARNED &amp; SOURCE</Eyebrow>
        <p className="mb-[18px] max-w-[800px] text-pretty text-[15.5px] leading-[1.7]">
          Building this experience taught me how cursor movement, camera angles, perspective,
          projective screen alignment, and transition timing work together. It gave me experience
          close to game interaction design while strengthening my habit of researching strong
          references and turning them into an original solution.
        </p>
        <a
          href={portfolioLinks.portfolioRepo}
          target="_blank"
          rel="noreferrer"
          className="ide-secondary-button !px-5"
        >
          [ VIEW ON GITHUB ↗ ]
        </a>
      </div>
      <TechChips items={roomPortfolioStack} />
      <ProjectPager prev={{ id: 'autorename', name: 'Sec Renamer' }} onOpen={onOpen} />
    </div>
  );
}
