import {
  lighthouseArchitecture,
  lighthouseStack,
  roomPortfolioArchitecture,
  roomPortfolioStack,
  secRenameArchitecture,
  secRenameStack,
} from '../portfolio.data';
import { Architecture, Eyebrow, PairCards, ProjectHeading, TechChips } from './SectionPieces';

export function LighthouseProject() {
  return (
    <>
      <ProjectHeading
        file="lighthouse.ino"
        name="Lighthouse"
        category="WORK PROJECT"
        work
        description="Insurance claims workspace combining document processing, evidence review, and guided next steps."
      />
      <PairCards
        items={[
          {
            title: 'PROBLEM',
            text: 'Insurance claims processing runs on documents. Adjusters manually read, sort, and extract information from large volumes of claim paperwork — slow, repetitive, and error-prone.',
          },
          {
            title: 'SOLUTION',
            text: "A claims and document processing platform that ingests documents, extracts relevant information, and surfaces it through an interface built around the adjuster's actual workflow.",
          },
        ]}
      />
      <div className="mb-9">
        <Eyebrow>MY CONTRIBUTION</Eyebrow>
        <p className="mb-[14px] max-w-[760px] text-pretty text-[16px] leading-[1.7]">
          I owned the frontend UI/UX and contributed across the stack, building a clear, responsive
          experience for claim workflows. My work spans real-time chat, document-processing
          feedback, API and data integration, and PostgreSQL operations.
        </p>
        <ul className="list-disc pl-[18px] text-[15.5px] leading-[1.9]">
          <li>
            Owned the responsive React and TypeScript interface, with a focus on clear navigation
            and efficient user flows
          </li>
          <li>
            Implemented streaming chat responses and clear document status feedback for processing,
            completion, and failure
          </li>
          <li>
            Worked with AI-powered document extraction and helped connect its results to the claim
            experience
          </li>
          <li>
            Worked with Python and FastAPI services, and used PostgreSQL to read and write
            application data and create tables
          </li>
        </ul>
      </div>
      <div className="mb-9 grid grid-cols-[1fr_300px] items-start gap-8 max-[1179px]:grid-cols-1">
        <div>
          <Eyebrow>ENGINEERING CHALLENGES</Eyebrow>
          <div className="flex flex-col gap-5">
            {[
              {
                title: 'Designing for clear claim workflows',
                text: 'I focused on helping users move through claim tasks without losing context. I learned the workflow and shaped the responsive interface around clear navigation and practical task sequences.',
              },
              {
                title: 'Real-time interaction and status feedback',
                text: 'I implemented streamed chat responses and color-coded document states so users can tell whether work is still processing, succeeded, or failed. I also optimized components and loading behavior to keep the experience responsive and lightweight.',
              },
              {
                title: 'Full-stack work with AI-assisted processing',
                text: 'Alongside frontend ownership, I worked with FastAPI data flows and PostgreSQL tables and contributed to system-architecture discussions. I learned how the AI document-processing pipeline extracts information and helped present those results in the frontend; the platform distinguishes extracted suggestions from verified claim facts.',
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
      <TechChips items={lighthouseStack} />
    </>
  );
}

export function SecRenameProject({ onOpenDemo }: { onOpenDemo?: () => void }) {
  return (
    <div className="max-w-[940px]">
      <ProjectHeading
        file="autorenamer.ino"
        name="AutoRename"
        category="PERSONAL PROJECT"
        description="An offline-first Android app that helps organize sensitive documents with on-device OCR and guided renaming."
      />
      <PairCards
        items={[
          {
            title: 'WORKFLOW',
            text: 'Users can scan or select a document, review the suggested name, and organize files one at a time or in a batch.',
          },
          {
            title: 'PRIVACY BY DESIGN',
            text: "Document recognition and naming run on-device, so the workflow can work offline and keep files on the user's device.",
          },
        ]}
      />
      <Architecture nodes={secRenameArchitecture} />
      <div className="mb-7 border border-arduino-border bg-arduino-panel p-6">
        <Eyebrow>GUIDED DEMO</Eyebrow>
        <p className="mb-[18px] max-w-[760px] text-pretty text-[15.5px] leading-[1.7]">
          Try the mobile interface with fictional sample documents. The demo shows single-file and
          batch flows using prepared results; it does not access visitor files or the camera.
        </p>
        <button type="button" className="ide-primary-button !px-5" onClick={onOpenDemo}>
          [ OPEN AUTORENAME DEMO ]
        </button>
      </div>
      <TechChips items={secRenameStack} />
    </div>
  );
}

export function RoomPortfolioProject() {
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
            text: 'The visitor moves from the room, to the desk, and finally into the monitor. Cursor position guides the camera while hover, keyboard, touch, and reduced-motion behavior keep the journey accessible.',
          },
          {
            title: 'REFERENCE-DRIVEN DESIGN',
            text: "Henry Heffernan's portfolio inspired the immersive direction. I studied the interaction, then created my own room, monitor projection, Arduino-style portfolio, and desktop app experience.",
          },
        ]}
      />
      <Architecture nodes={roomPortfolioArchitecture} />
      <div className="mb-7 border border-arduino-border bg-arduino-panel p-6">
        <Eyebrow>WHAT I LEARNED</Eyebrow>
        <p className="max-w-[800px] text-pretty text-[15.5px] leading-[1.7]">
          Building this experience taught me how cursor movement, camera angles, perspective,
          projective screen alignment, and transition timing work together. It gave me experience
          close to game interaction design while strengthening my habit of researching strong
          references and turning them into an original solution.
        </p>
      </div>
      <TechChips items={roomPortfolioStack} />
    </div>
  );
}
