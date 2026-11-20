---
tags: [portfolio, planning, improvements]
status: done
updated: 2026-11-20
---

# Portfolio improvements plan

Related: [[Home]], [[Current-State]], [[Decisions]], [[Next-Steps]], [[Arduino-Portfolio-React-Migration]].

## Objective

Upgrade the recruiter experience, content clarity, case-study depth, and asset performance of the portfolio while keeping its signature **room → desk → monitor → Arduino IDE** identity intact.

## Guardrails

- Preserve the calibrated monitor corners in `src/styles.css` and shared projection in `src/monitorProjection.ts`.
- Preserve the Arduino teal (`#00979C`), white, and dark-neutral shell palette.
- Keep `public/arduino-portfolio.html` untouched (temporary rollback artifact only).
- Respect NDA boundaries on **Lighthouse** (public recruiter overview only; no company-sensitive internals or interactive demo).
- Keep **Sec Renamer** demo UI-only with fictional data (no visitor file or camera access).
- Keep `npm run check`, `npm run test`, and `npm run build` passing after every phase.

## Progress dashboard

Status values: `Not started`, `In progress`, `Blocked`, `Ready for review`, `Done`.

| Phase | Status | Focus |
| --- | --- | --- |
| Phase 1 — Quick wins (consistency, copy, links, assets) | Done | Unified naming (`Sec Renamer`), copy/metadata polish, repo links, copy-email, WebP optimization |
| Phase 2 — Recruiter conversion & frictionless access | Done | Sanitized public CV PDF, interactive Portrait Monitor CV modal, upgraded Room View first impression, Featured Projects, Prev/Next nav, interactive IDE menu |
| Phase 3 — Case study depth, visuals & social preview | Done | Verified NDA-safe Lighthouse GenAI/RAG metrics & trade-offs, Sec Renamer & Room Portfolio trade-offs, synced 2026 timeline, `1200×630` OG preview card |

---

## Phase 1 — Quick wins (consistency, copy, links, assets)

Target files: `src/portfolio/portfolio.data.ts`, `src/portfolio/sections/MainSection.tsx`, `src/portfolio/sections/AboutSection.tsx`, `src/portfolio/sections/ProjectSections.tsx`, `src/portfolio/sections/ContactSection.tsx`, `src/portfolio/components/InfoPanel.tsx`, `src/App.tsx`, `src/assets/`.

- [x] **Unify project naming to `Sec Renamer`** (`projects/sec_renamer.ino`) across desktop shortcut, Start menu, window title, project heading, demo CTA button, demo UI, About card, and docs.
- [x] **Update Room Portfolio stack** in `src/portfolio/portfolio.data.ts` (`roomPortfolioStack` and `sectionInfo.portfolio`) to include **Tailwind CSS** and **Vitest**.
- [x] **Fix small copy and metadata polish issues:**
  - Replaced `"RESPONSIVE WEBSITE"` with `"RESPONSIVE WEB & MOBILE"` in `MainSection.tsx`.
  - Fixed punctuation in `AboutSection.tsx`.
  - Changed Lighthouse metadata `links` to `'Private (NDA)'`.
  - Fixed truncated email metadata display in `portfolio.data.ts` / `InfoPanel.tsx`.
  - Synced Ally Public Adjusting year to `January – August 2026`.
- [x] **Add verifiable repository links** on Sec Renamer and Room Portfolio project pages.
- [x] **Add 1-click "Copy email" button** (shared `useCopyToClipboard` hook) in `ContactSection.tsx` and `InfoPanel.tsx`.
- [x] **Optimize remaining heavy PNG assets:**
  - Converted `BackgroundDesktop.png` (3.6 MB) → `desktop-background.webp` (~250 KB) and replaced `portrait-monitor-explorer.png` (1.39 MB) → `portrait-monitor-cv.webp` (~203 KB).
  - Archived replaced originals in `.archive/source-assets/`.

---

## Phase 2 — Recruiter conversion & frictionless access

Target files: `src/App.tsx`, `src/styles.css`, `src/portfolio/ArduinoPortfolio.tsx`, `src/portfolio/sections/MainSection.tsx`, `src/portfolio/sections/ProjectSections.tsx`, `src/portfolio/sections/ContactSection.tsx`, `src/portfolio/components/InfoPanel.tsx`, `public/`.

- [x] **Publish sanitized CV PDF & put it on the Portrait Monitor:**
  - Generated sanitized 2-page `public/Angelo-Palpalatoc-CV.pdf` (phone number and reference email removed; unified to `SEC RENAMER`).
  - Rendered crisp WebP Page 1 preview onto `.portrait-monitor` and wired desk-view click/keyboard modal with Open in New Tab, Download PDF, `inert` background handling, and Escape focus return.
  - Added `[ DOWNLOAD CV ]` links in `MainSection.tsx`, `ContactSection.tsx`, `InfoPanel.tsx`, and IDE `File (CV)` menu.
- [x] **Improve Room View first impression without bypassing immersion:**
  - Surfaced Angelo's name, role, stack, dual-monitor cue, and floor-edge scrim in `.room-caption` (skipped Skip button / `/?direct=1` per Angelo's preference).
- [x] **Improve project discoverability inside the IDE:**
  - Added **Featured Projects** cards on `main.ino` and Prev/Next project navigation across all three project pages.
- [x] **Clean up non-interactive IDE chrome** in `ArduinoPortfolio.tsx`:
  - Removed static `▼` chevron on the role badge and wired `File (CV)`, `View`, `Run`, and `Help` menu actions.

---

## Phase 3 — Case study depth, visuals & social preview

Target files: `src/portfolio/portfolio.data.ts`, `src/portfolio/sections/ProjectSections.tsx`, `src/portfolio/sections/ExperienceSection.tsx`, `index.html`, `public/`.

- [x] **Add verified, NDA-safe Lighthouse metrics, GenAI/RAG framing & engineering trade-offs** (`156` commits, `10+` views, `19` hooks, `26` backend/DB files; Generative AI LLM streaming + RAG grounded in uploaded documents).
- [x] **Strengthen Sec Renamer & Room Portfolio bullets with verified metrics & trade-offs** (`23` Kotlin files, `17` test suites, `30` fixtures, `100%` on-device; CSS projective homography vs WebGL).
- [x] **Clarify Experience timeline in `portfolio.data.ts`:** synced `Jan–Aug 2026`, added `Aug 2026 – Present` (Independent), and labeled Hooli 2023/2024 as `Software Engineer Intern`.
- [x] **Upgrade social sharing card in `index.html`:** generated `1200×630` `public/og-preview.jpg` and wired `og:image` + `twitter:card="summary_large_image"`.
- [ ] **Optional future polish (deferred):** add Android app screenshots inside `sec_renamer.ino` and update LinkedIn slug in `portfolio.data.ts` once customized on LinkedIn.

---

## Decisions recorded (2026-11-20)

1. **Canonical project name:** **Sec Renamer** (`projects/sec_renamer.ino`), linked to `github.com/Angelo-Palpalatoc/AutomaticFileName`.
2. **Portrait monitor CV:** Replaced the static Project Explorer PNG on `.portrait-monitor` with a crisp WebP preview of Page 1 (`src/assets/portrait-monitor-cv.webp`) plus a desk-view CV preview/download modal backed by the sanitized `public/Angelo-Palpalatoc-CV.pdf`, alongside `[ DOWNLOAD CV ]` CTAs in the IDE.
3. **Room View first impression:** Preserved the immersive room entry (no Skip button or `/?direct=1` bypass) while surfacing Angelo's name, role, stack, and dual-monitor cue in `.room-caption`.
4. **Lighthouse metrics & GenAI/RAG framing:** Added verified, NDA-safe scope from Angelo's 156 commits plus clear Generative AI (LLM streaming + RAG grounded in uploaded documents) positioning without exposing client-sensitive internals.
5. **Experience timeline:** Synced `experience.ino` to `January – August 2026` (Ally Public Adjusting), `August 2026 – Present` (Independent), and `Software Engineer Intern` for Hooli Software (2023/2024).

---

## Verification gate (run after each phase)

```powershell
npm.cmd run check
npm.cmd run test
npm.cmd run build
```

Also verify in browser:
- Desktop calibrated monitor alignment remains unchanged.
- Room → desk → monitor transitions, Escape navigation, minimize/restore, and close/reopen still work.
- Phone portrait/landscape reading views and Back controls remain inside the viewport.
- Update [[Current-State]] and [[Decisions]] for any confirmed behavior changes.
