import type { ReactNode, RefObject } from 'react';

type PortraitCvViewerProps = {
  cvUrl: string;
  active: boolean;
  windowRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  mobileBackButton?: ReactNode;
};

export default function PortraitCvViewer({
  cvUrl,
  active,
  windowRef,
  onClose,
  mobileBackButton,
}: PortraitCvViewerProps) {
  return (
    <section
      ref={windowRef}
      tabIndex={-1}
      className="portrait-cv-window"
      aria-label="Angelo Palpalatoc CV viewer"
      aria-hidden={!active}
      inert={!active}
    >
      <header className="portrait-cv-toolbar">
        <div className="portrait-cv-file">
          <span className="portrait-cv-dot" aria-hidden="true" />
          <span className="portrait-cv-filename">Angelo-Palpalatoc-CV.pdf</span>
        </div>
        <div className="portrait-cv-actions">
          <a
            className="portrait-cv-action"
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            title="Open PDF in a new tab"
          >
            PDF
          </a>
          <a
            className="portrait-cv-download"
            href={cvUrl}
            download="Angelo-Palpalatoc-CV.pdf"
            title="Download Angelo Palpalatoc CV PDF"
          >
            Download
          </a>
          <button
            className="portrait-cv-close"
            type="button"
            onClick={onClose}
            aria-label="Return to desk"
            title="Return to desk (Esc)"
          >
            ×
          </button>
          {mobileBackButton}
        </div>
      </header>

      <div className="portrait-cv-scroll" tabIndex={active ? 0 : -1} aria-label="CV document">
        <article className="portrait-cv-sheet">
          <header className="cv-doc-header">
            <h1>ANGELO C. PALPALATOC</h1>
            <div className="cv-doc-meta">Santa Maria, Bulacan, Philippines</div>
            <div className="cv-doc-meta">
              <a href="mailto:palpalatocangelo@gmail.com">palpalatocangelo@gmail.com</a>
              <span> | </span>
              <a
                href="https://www.linkedin.com/in/angelo-palpalatoc-66baa8329/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn Profile
              </a>
              <span> | </span>
              <a href="https://github.com/Angelo-Palpalatoc" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span> | </span>
              <a href="https://angelo-palpalatoc.vercel.app/" target="_blank" rel="noreferrer">
                Portfolio
              </a>
            </div>
          </header>

          <section className="cv-doc-section">
            <h2>Summary</h2>
            <p>
              Full-Stack &amp; Front-End Software Engineer with hands-on experience building
              responsive, production-ready web and mobile applications using React, TypeScript,
              JavaScript, Tailwind CSS, Python, and FastAPI. Proven track record of owning front-end
              implementation—including real-time chat and document-processing platforms—while
              supporting API and PostgreSQL integrations and leveraging AI-assisted workflows to
              accelerate delivery. Skilled in component-driven architecture, performance
              optimization, and cross-browser compatibility within Agile/Scrum environments using
              Jira, Git, and Bitbucket.
            </p>
          </section>

          <section className="cv-doc-section">
            <h2>Education</h2>
            <div className="cv-doc-entry">
              <div className="cv-doc-row">
                <span className="cv-doc-org">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</span>
                <span className="cv-doc-date">Santa Maria, Bulacan</span>
              </div>
              <div className="cv-doc-row">
                <span className="cv-doc-role">Bachelor of Science in Computer Engineering</span>
                <span className="cv-doc-date">2021 – 2025</span>
              </div>
              <ul>
                <li>Cum Laude</li>
                <li>Champion at Arduino Crafting (Robotics) | 2025</li>
                <li>1st Place at Arduino Crafting (Robotics) | 2024</li>
              </ul>
            </div>
          </section>

          <section className="cv-doc-section">
            <h2>Experience</h2>
            <div className="cv-doc-entry">
              <div className="cv-doc-row">
                <span className="cv-doc-org">ALLY PUBLIC ADJUSTING</span>
                <span className="cv-doc-date">January – August 2026</span>
              </div>
              <div className="cv-doc-role">Software Engineering (Freelance)</div>
              <ul>
                <li>
                  Owned and shipped responsive React &amp; TypeScript frontend views (10+ workspace
                  pages, 19 custom data hooks, and Jotai global state) for a real-time chat and
                  insurance claims document workspace.
                </li>
                <li>
                  Built end-to-end user workflows including multi-claim switching, multi-channel
                  file &amp; ZIP archive uploads, 30-day soft-delete recovery, per-claim Action
                  Plans, and an editable Letter Builder auto-filled from extracted claim data.
                </li>
                <li>
                  Contributed across FastAPI Portal API routes, SQLAlchemy PostgreSQL models, and
                  async data helpers while optimizing reusable components and asset handling for
                  fast load times.
                </li>
                <li>
                  Utilized AI-assisted programming tools alongside disciplined self-reviews and
                  testing before commits to accelerate delivery while maintaining code quality.
                </li>
              </ul>
            </div>

            <div className="cv-doc-entry">
              <div className="cv-doc-row">
                <span className="cv-doc-org">HOOLI SOFTWARE</span>
                <span className="cv-doc-date">August – October 2024</span>
              </div>
              <div className="cv-doc-role">Software Engineer Intern (US-Based)</div>
              <ul>
                <li>
                  Developed a responsive web application using React and TypeScript and transformed
                  Figma UI/UX designs into functional, visually consistent interfaces across
                  devices.
                </li>
                <li>
                  Collaborated in an agile team environment, using Git for version control and
                  participating in sprint planning and code reviews.
                </li>
              </ul>
            </div>

            <div className="cv-doc-entry">
              <div className="cv-doc-row">
                <span className="cv-doc-org">HOOLI SOFTWARE</span>
                <span className="cv-doc-date">August – September 2023</span>
              </div>
              <div className="cv-doc-role">Software Engineer Intern (US-Based)</div>
              <ul>
                <li>
                  Completed a 1-month intensive training program, building foundational skills in
                  the company’s tech stack (React, TypeScript, HTML, CSS), and resolved minor to
                  moderate design implementation issues.
                </li>
                <li>
                  Collaborated with senior developers, receiving guidance and feedback to improve
                  coding practices and project workflow.
                </li>
              </ul>
            </div>
          </section>

          <section className="cv-doc-section">
            <h2>Key Projects</h2>
            <div className="cv-doc-entry">
              <div className="cv-doc-row">
                <span className="cv-doc-org">INTERACTIVE 3D ROOM PORTFOLIO (Web App)</span>
                <span className="cv-doc-date">November 2026</span>
              </div>
              <div className="cv-doc-role">Solo Developer</div>
              <ul>
                <li>
                  Designed and engineered an interactive room-to-monitor portfolio using React,
                  TypeScript, Tailwind CSS, Vite, and projective CSS transforms with cursor-driven
                  camera transitions.
                </li>
                <li>
                  Implemented multi-input navigation supporting hover, touch, optional phone
                  orientation controls, keyboard shortcuts, and reduced-motion accessibility.
                </li>
                <li>
                  Built a simulated Windows desktop, interactive Arduino-inspired IDE showcase,
                  embedded mobile app demo, and Vitest-verified state management.
                </li>
              </ul>
            </div>

            <div className="cv-doc-entry">
              <div className="cv-doc-row">
                <span className="cv-doc-org">SEC RENAMER (Mobile App)</span>
                <span className="cv-doc-date">October 2026</span>
              </div>
              <div className="cv-doc-role">Solo Developer</div>
              <ul>
                <li>
                  Engineered an offline-first Android application with Kotlin &amp; Compose
                  Multiplatform to organize and rename sensitive SEC corporate documents locally
                  with privacy by design.
                </li>
                <li>
                  Integrated on-device ML Kit OCR, company-list matching, and SEC filename rules
                  across single-file and batch workflows, exporting non-destructive verified copies
                  without cloud dependencies.
                </li>
                <li>
                  Verified extraction and export logic with 17 automated test suites and 30
                  synthetic document fixtures covering duplicate handling and edge cases.
                </li>
              </ul>
            </div>

            <div className="cv-doc-entry">
              <div className="cv-doc-row">
                <span className="cv-doc-org">LIGHTHOUSE (Web App)</span>
                <span className="cv-doc-date">January – August 2026</span>
              </div>
              <div className="cv-doc-role">Full-Stack &amp; AI Workflow Engineer</div>
              <ul>
                <li>
                  Contributed 156 commits to a Generative AI insurance claims workspace powered by
                  an LLM assistant and RAG (Retrieval-Augmented Generation) to deliver accurate,
                  source-grounded outputs tied directly to uploaded documents while minimizing
                  hallucinations.
                </li>
                <li>
                  Owned responsive claim workspace UI, real-time streaming chat feedback, explicit
                  document processing states, and ZIP archive handling while collaborating across
                  FastAPI endpoints and PostgreSQL models.
                </li>
                <li>
                  Worked within an 8-service architecture distinguishing machine-extracted
                  suggestions from verified claim facts for reliable, evidence-driven workflows.
                </li>
              </ul>
            </div>
          </section>

          <section className="cv-doc-section">
            <h2>Skills &amp; Certifications</h2>
            <div className="cv-doc-skills">
              <div className="cv-doc-skills-label">Technical:</div>
              <div className="cv-doc-skills-body">
                <p>
                  <strong>Languages:</strong> HTML5, CSS3, JavaScript (ES6+), TypeScript, Python,
                  Kotlin
                </p>
                <p>
                  <strong>Frontend:</strong> React, Redux, Jotai, Tailwind CSS, Compose
                  Multiplatform
                </p>
                <p>
                  <strong>Backend:</strong> FastAPI, REST API design, Server-Sent Events
                </p>
                <p>
                  <strong>Data:</strong> PostgreSQL, Relational data modeling
                </p>
                <p>
                  <strong>AI / Documents:</strong> AI document-extraction integration, Streaming
                  chat, ML Kit OCR
                </p>
                <p>
                  <strong>Tools:</strong> Git, GitHub, Bitbucket, NPM, Vite, Vitest, Docker, Figma,
                  Jira
                </p>
                <p>
                  <strong>Performance:</strong> Code splitting, Lazy loading, Asset and page-load
                  optimization
                </p>
              </div>

              <div className="cv-doc-skills-label">Soft Skills:</div>
              <div className="cv-doc-skills-body">
                Communication &amp; Collaboration, Problem-Solving &amp; Analytical Thinking,
                Creativity, Systematic Thinking, Time Management, Resourcefulness, Attention to
                Detail, Adaptability &amp; Continuous Learning
              </div>

              <div className="cv-doc-skills-label">Certifications:</div>
              <div className="cv-doc-skills-body">
                Passed ISC2 Cybersecurity, Civil Service Eligible
              </div>
            </div>
          </section>

          <section className="cv-doc-section">
            <h2>Character Reference</h2>
            <p>Available upon request.</p>
          </section>
        </article>
      </div>
    </section>
  );
}
