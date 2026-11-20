---
tags: [portfolio, planning, improvements]
status: proposed
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
- Keep **Sec Rename / AutoRename** demo UI-only with fictional data (no visitor file or camera access).
- Keep `npm run check`, `npm run test`, and `npm run build` passing after every phase.

## Progress dashboard

Status values: `Not started`, `In progress`, `Blocked`, `Ready for review`, `Done`.

| Phase | Status | Focus |
| --- | --- | --- |
| Phase 1 — Quick wins (consistency, copy, links, assets) | Not started | Fix naming/copy mismatches, add repo links and copy-email, optimize PNGs to WebP |
| Phase 2 — Recruiter conversion & frictionless access | Not started | Resume PDF CTA, room name/role + Skip shortcut, direct URL mode, project navigation |
| Phase 3 — Case study depth, visuals & social preview | Not started | Metrics/trade-offs, timeline clarity, project screenshots, 1200×630 OG preview card |

---

## Phase 1 — Quick wins (consistency, copy, links, assets)

Target files: `src/portfolio/portfolio.data.ts`, `src/portfolio/sections/MainSection.tsx`, `src/portfolio/sections/AboutSection.tsx`, `src/portfolio/sections/ProjectSections.tsx`, `src/portfolio/sections/ContactSection.tsx`, `src/portfolio/components/InfoPanel.tsx`, `src/App.tsx`, `src/assets/`.

- [ ] **Unify project naming** (`Sec Rename` vs. `AutoRename` vs. `autorenamer.ino`): pick one canonical name and align the desktop shortcut, Start menu, window title, explorer filename (if approved), project heading, demo CTA button, and About card.
- [ ] **Update Room Portfolio stack** in `src/portfolio/portfolio.data.ts` (`roomPortfolioStack` and `sectionInfo.portfolio`) to include **Tailwind CSS** and **Vitest** alongside React, TypeScript, Vite, and Projective transforms.
- [ ] **Fix small copy and metadata polish issues:**
  - Replace `"RESPONSIVE WEBSITE"` in `src/portfolio/sections/MainSection.tsx` with sharper wording (e.g., `"RESPONSIVE WEB & MOBILE"` or `"INTERACTIVE UI / UX"`).
  - Fix punctuation in `src/portfolio/sections/AboutSection.tsx` (*"...HTML, CSS, JavaScript, React, and TypeScript, and grew..."*).
  - Change Lighthouse metadata `links: 'none yet'` in `src/portfolio/portfolio.data.ts` to `'Private (NDA)'`.
  - Fix truncated `palpalatocangelo@` metadata display in `src/portfolio/portfolio.data.ts` / `InfoPanel.tsx`.
- [ ] **Add verifiable repository links** on project pages (e.g., GitHub link for Room Portfolio, and for Sec Rename / AutoRename if public).
- [ ] **Add 1-click "Copy email" button** with brief copied confirmation in `ContactSection.tsx` (and optionally `InfoPanel.tsx`).
- [ ] **Optimize remaining heavy PNG assets:**
  - Convert `src/assets/BackgroundDesktop.png` (~3.6 MB) and `src/assets/portrait-monitor-explorer.png` (~1.39 MB) to WebP while preserving dimensions and visual alignment.
  - Remove the unused `src/assets/desktop-background.webp` file.
  - Keep originals in local `.archive/source-assets/` if needed.

---

## Phase 2 — Recruiter conversion & frictionless access

Target files: `src/App.tsx`, `src/styles.css`, `src/portfolio/ArduinoPortfolio.tsx`, `src/portfolio/sections/MainSection.tsx`, `src/portfolio/sections/ProjectSections.tsx`, `src/portfolio/sections/ContactSection.tsx`, `src/portfolio/components/InfoPanel.tsx`, `public/`.

- [ ] **Add Resume / CV PDF download:**
  - Place the latest PDF resume in `public/` (e.g., `public/Angelo-Palpalatoc-Resume.pdf`).
  - Add `[ DOWNLOAD CV ]` buttons in `MainSection.tsx`, `ContactSection.tsx`, and `InfoPanel.tsx` (opens in new tab or downloads cleanly).
- [ ] **Lower room entry friction without losing immersion:**
  - Display Angelo's name and role (`Angelo Palpalatoc · Full-Stack Software Engineer`) clearly in the room caption.
  - Add a compact, subtle **"Open Portfolio"** / **"Skip to Portfolio"** button on the room view that jumps straight into the monitor experience (and optionally skips the boot wait).
  - Support a direct URL parameter or route (e.g., `/?direct=1` or `/portfolio`) that renders the Arduino IDE full-screen for resume links and busy recruiters, with a button to explore the 3D room if desired.
- [ ] **Improve project discoverability inside the IDE:**
  - Add compact **Featured Projects** cards on `main.ino` (so visitors immediately see Lighthouse, Sec Rename / AutoRename, and Room Portfolio without hunting in the sidebar).
  - Add subtle `Next project →` navigation links at the bottom of each project file in `ProjectSections.tsx`.
- [ ] **Clean up non-interactive IDE chrome** in `ArduinoPortfolio.tsx`:
  - Either remove the misleading `▼` dropdown chevron on the `Software Engineer · Full-Stack` pill and tone down static menu items, or wire helpful actions (e.g., `File → Download CV`, `Run → Verify`).

---

## Phase 3 — Case study depth, visuals & social preview

Target files: `src/portfolio/portfolio.data.ts`, `src/portfolio/sections/ProjectSections.tsx`, `src/portfolio/sections/ExperienceSection.tsx`, `index.html`, `public/`.

- [ ] **Strengthen Experience & Project bullets with impact and trade-offs:**
  - Add real, verifiable metrics where available (e.g., payload reduction %, component/screen scope, batch size handled, latency or reliability improvements).
  - Document 1–2 concrete engineering trade-offs per project (e.g., why CSS projective homography instead of Three.js/WebGL; why on-device ML Kit OCR instead of cloud OCR; how SSE streaming + document state feedback prevented user confusion in Lighthouse).
- [ ] **Clarify Experience timeline in `portfolio.data.ts`:**
  - Add a current entry or note covering independent engineering work since August 2025 so there is no unexplained gap.
  - Clarify role type for the 2023/2024 Hooli Software periods (e.g., Internship / Training Program) if appropriate.
- [ ] **Add visual proof inside project pages:**
  - Add 1–2 optimized screenshots or schematic visuals in `ProjectSections.tsx` (e.g., Android app screenshots for Sec Rename / AutoRename, room-to-monitor projection visual for Room Portfolio, optional redacted/clean UI schematic for Lighthouse).
- [ ] **Upgrade social sharing card in `index.html`:**
  - Capture a crisp `1200×630` preview image of the room + glowing Arduino monitor (`public/og-preview.png` or `.jpg`).
  - Update `og:image`, `twitter:image`, and switch `twitter:card` to `summary_large_image`.
- [ ] **Update LinkedIn link** in `src/portfolio/portfolio.data.ts` once the custom LinkedIn URL slug is set (e.g., `linkedin.com/in/angelo-palpalatoc`).

---

## Inputs needed from Angelo

Before starting each phase, decide or supply the following:

1. **Canonical project name (Phase 1):** Should the Android OCR app be called **Sec Rename** or **AutoRename** everywhere? (And is there a public GitHub repo URL to link?)
2. **Resume PDF (Phase 2):** Your up-to-date resume PDF to place in `public/`.
3. **Direct recruiter mode preference (Phase 2):** Should the room caption include a **"Skip to Portfolio"** button and/or a `/?direct=1` direct-entry link for resumes?
4. **Metrics & timeline details (Phase 3):**
   - Any real numbers or concrete scope you're comfortable sharing for Lighthouse, Hooli Software, and Sec Rename / AutoRename.
   - How you want Aug 2025 – Present framed on `experience.ino`, and whether the 2023/2024 Hooli stints should be labeled Intern / Trainee.
5. **Project visuals & LinkedIn slug (Phase 3):**
   - Any Android screenshots for Sec Rename / AutoRename (or approve generating clean UI frames from the app).
   - Updated LinkedIn custom URL if you change it from `angelo-palpalatoc-66baa8329`.

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
