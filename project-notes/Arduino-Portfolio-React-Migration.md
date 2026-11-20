---
tags: [portfolio, migration, react, typescript, tailwind, milestone]
status: in-progress
updated: 2026-11-20
---

# Arduino portfolio React migration

Related: [[Home]], [[Current-State]], [[Decisions]], [[Next-Steps]], [[Tooling]].

## Objective

Rebuild the Arduino IDE portfolio currently packed inside `public/arduino-portfolio.html` as readable React, TypeScript, and Tailwind source while preserving its approved appearance, content, interaction model, mobile behavior, and connection to the room shell.

The migration is an implementation change, not a redesign. The packed export remains the working fallback until the replacement passes the cutover gate.

## Why this migration matters

- Recruiters can inspect real components, typed models, state transitions, responsive behavior, and accessibility work.
- Portfolio content becomes editable without modifying a generated single-file export.
- The Arduino IDE interface becomes testable and easier to maintain.
- Tailwind is used as an implementation tool through the official Vite plugin, with the existing Arduino visual language expressed as shared tokens.

## Confirmed boundaries

- Preserve the room, desk, monitor projection, calibrated screen corners, taskbar, app-window behavior, and Sec Rename demo.
- Preserve the current Arduino IDE visual design and portfolio content during migration.
- Preserve the default collapsed Serial Monitor, boot sequence, explorer navigation, tabs, compile feedback, responsive drawer, information panel, and project launch behavior.
- Keep the existing export available as a fallback until the user approves the replacement.
- Do not remove `public/arduino-portfolio.html` during the build-out milestones.
- Do not change portfolio copy merely to simplify the migration.

## Target architecture

```text
src/
  portfolio/
    ArduinoPortfolio.tsx
    portfolio.types.ts
    portfolio.data.ts
    portfolio.reducer.ts
    PortfolioContext.tsx
    components/
      IdeMenuBar.tsx
      IdeToolbar.tsx
      ActivityBar.tsx
      FileExplorer.tsx
      EditorTabs.tsx
      EditorWorkspace.tsx
      InfoPanel.tsx
      SerialMonitor.tsx
      StatusBar.tsx
      BootScreen.tsx
    sections/
      MainSection.tsx
      AboutSection.tsx
      SkillsSection.tsx
      ExperienceSection.tsx
      ContactSection.tsx
      LighthouseProject.tsx
      SecRenameProject.tsx
      PortfolioProject.tsx
```

The room shell continues to own app windows, minimize/restore/close behavior, phone expansion, camera movement, and the Sec Rename demo. The new `ArduinoPortfolio` owns only the IDE-style portfolio surface and exposes callbacks such as `onOpenSecRename` to the shell.

## Progress dashboard

Status values: `Not started`, `In progress`, `Blocked`, `Ready for review`, `Done`.

| Milestone | Status | Completion evidence |
| --- | --- | --- |
| M0 — Baseline and parity contract | Done | [[Arduino-Portfolio-Baseline]] and screenshot set |
| M1 — Tailwind and migration foundation | Done | Official Vite plugin, isolated preview, check and build pass |
| M2 — Typed content and state model | Done | Typed data/reducer plus 5 passing Vitest checks |
| M3 — Arduino IDE shell parity | Done | Desktop main/about comparisons and integrated monitor review |
| M4 — Portfolio sections and projects | Done | All 8 explorer views render from typed React data |
| M5 — Interaction and room-shell integration | Done | Navigation, compile, Sec Rename, minimize/restore, close/reopen verified |
| M6 — Responsive and accessible behavior | Ready for review | Automated viewport, keyboard, reduced-motion, and rotated-scroll checks pass; physical devices remain |
| M7 — Cutover, cleanup, and documentation | Ready for deployment | Visual approval, React cutover, cleanup, checks, build, docs, and code map complete |

## Milestones

### M0 — Baseline and parity contract

Completed 2026-11-20. Evidence and acceptance details: [[Arduino-Portfolio-Baseline]]. The integrated browser's usable desktop viewport measured 1119 × 630; the phone baselines measured 291 × 630 portrait and 844 × 390 landscape. The final comparison will also use Angelo's usual full desktop viewport.

Purpose: make the existing experience measurable before rebuilding it.

- [x] Capture reference screenshots for the initial boot, main page, explorer, open tabs, each portfolio section, project pages, collapsed/expanded Serial Monitor, and compile states.
- [x] Capture desktop, short landscape phone, portrait phone reading view, and narrow drawer behavior.
- [x] Inventory visible content, navigation files, technology tags, metadata, architecture nodes, experience entries, and links from the export.
- [x] Record interaction behavior: boot timing, drawer breakpoint, information-panel breakpoint, tab rules, focus behavior, scrolling, serial logging, and Sec Rename launch message.
- [x] Record the current room-shell integration contract from `PortfolioFrame` and `App`.
- [x] Establish repeatable browser comparison viewports; obtain Angelo's full desktop comparison during the final parity gate.

Gate: every visible state and required behavior has a reference or written acceptance criterion.

### M1 — Tailwind and migration foundation

Started 2026-11-20. Tailwind's official Vite plugin is the integration target. The legacy iframe remains the active runtime during development.

Completed 2026-11-20. The preview is available at `/portfolio-preview` only in development. Tailwind theme and utilities are imported without global Preflight to protect the calibrated room styles. `npm run check` and `npm run build` pass; the active room remains on the export.

Purpose: add the new implementation path without affecting the live portfolio.

- [x] Install `tailwindcss` and `@tailwindcss/vite` using the official Vite integration.
- [x] Add a Vite configuration with the Tailwind plugin and import Tailwind from the maintained stylesheet.
- [x] Define Arduino tokens for teal, dark surfaces, text hierarchy, borders, and fonts.
- [x] Create the `src/portfolio/` module and a development-only way to render it beside the legacy export.
- [x] Keep the existing iframe as the production/default implementation during migration.
- [x] Confirm that the existing room shell and production build remain unchanged.

Gate: type-check, formatting, unused-code check, and production build pass with the legacy experience still intact.

### M2 — Typed content and state model

Started 2026-11-20. Extracting the public copy and state rules from the readable template inside the existing export.

Purpose: make portfolio content and IDE behavior explicit and inspectable.

- [x] Define TypeScript unions for section IDs, file entries, tabs, boot phases, serial messages, projects, skills, metadata, and architecture nodes.
- [x] Move content into typed data files without rewriting its meaning.
- [x] Implement a reducer for boot, active file, open tabs, drawer, Serial Monitor, compile state, and serial history.
- [x] Model invalid transitions safely, including closing the active tab and restoring the main tab.
- [x] Add focused checks for reducer transitions and content completeness.

Completed 2026-11-20. `portfolio.data.ts`, `portfolio.types.ts`, and `portfolio.reducer.ts` are the maintained model. Vitest covers initial state, navigation, tab restoration, compile feedback, and completeness of Info-panel data.

Gate: all current sections and IDE states can be represented without reading the packed HTML at runtime.

### M3 — Arduino IDE shell parity

Purpose: reproduce the approved IDE frame before migrating detailed content.

- [x] Build the menu bar, toolbar, activity bar, explorer, tabs, editor workspace, information panel, Serial Monitor, status bar, and boot screen as semantic React components.
- [x] Match current dimensions, density, typography, Arduino colors, borders, and hierarchy.
- [x] Add hover, focus-visible, active, selected, collapsed, loading, and disabled states where applicable.
- [x] Preserve useful editor space at short viewport heights.
- [x] Compare the React shell against the M0 screenshots at the agreed desktop viewport.

Completed 2026-11-20. The direct React preview was compared with the export at 1246 × 673, including Main and About, and was also inspected inside the unchanged calibrated monitor projection.

Gate: the shell is visually equivalent enough that differences are implementation details rather than a redesign.

### M4 — Portfolio sections and projects

Purpose: render all recruiter-facing content from typed source.

- [x] Migrate Main, About, Skills, Experience, and Contact.
- [x] Migrate Lighthouse, Sec Rename, and Room Portfolio project pages.
- [x] Rebuild technology-based architecture overviews without exposing additional company-sensitive details.
- [x] Preserve project status, role, technology tags, metadata, and the current wording.
- [x] Preserve readable wrapping and hierarchy for long content.

Completed 2026-11-20. All eight explorer entries render from typed source. The migration preserves the approved public copy rather than expanding Lighthouse or Sec Rename internals.

Gate: every explorer entry and project page from the export is present and content-equivalent.

### M5 — Interaction and room-shell integration

Purpose: replace export-specific communication with typed React integration.

- [x] Implement explorer navigation, tab open/select/close behavior, drawer dismissal, and activity-bar shortcuts.
- [x] Implement Serial Monitor expansion, timestamped messages, compile progress, success feedback, and timer cleanup.
- [x] Expose a typed `onOpenSecRename` callback to the room shell instead of relying on `window.parent.postMessage` in the final integration.
- [x] Preserve state while minimizing/restoring and reset state when the app is closed/reopened.
- [x] Preserve keyboard routing and focus restoration owned by the room shell.
- [x] Integrate the React portfolio behind a reversible implementation switch for comparison.

Completed 2026-11-20. Minimize/restore retains the active Skills view. Close/reopen remounts the portfolio, restarts boot, and returns to `main.ino`. The development query `?reactPortfolio=1` enables room-shell comparison without changing production.

Gate: the React version completes the same user flows as the legacy export without iframe-specific behavior.

### M6 — Responsive and accessible behavior

Purpose: preserve the phone experience and make interaction quality reviewable in source.

- [x] Verify wide desktop, narrow desktop, 320 × 568, 390 × 844, and 844 × 390 layouts.
- [x] Preserve the portrait-phone landscape reading presentation and smooth content scrolling.
- [x] Confirm the explorer drawer, information panel, Serial Monitor, tabs, and Back control remain reachable in constrained layouts.
- [x] Use semantic buttons and navigation regions with accurate accessible names.
- [x] Verify keyboard navigation, focus visibility, Escape behavior, and sensible focus restoration.
- [x] Respect reduced-motion preferences for boot and compile feedback.
- [x] Check text contrast, touch targets, zoom, long content, and short-height layouts.
- [ ] Test on the user's S23 Ultra in Brave and Chrome before cutover; test iPhone Safari when available.

Ready for review 2026-11-20. Automated checks confirmed full-viewport app bounds in phone portrait and landscape, a top-right Back control in physical landscape, portrait rotated touch scrolling, no document overflow, visible keyboard focus, Escape drawer dismissal, and immediate reduced-motion boot presentation. Physical-device verification remains the only open M6 item.

Gate: desktop and mobile acceptance checks pass, with physical-device limitations documented.

### M7 — Cutover, cleanup, and documentation

Purpose: make the maintainable implementation authoritative only after approval.

- [x] Present side-by-side or repeatable legacy/React comparisons for user approval.
- [x] Replace the iframe runtime with the React component after approval.
- [x] Remove obsolete iframe readiness, mutation-observer, and rotated-scroll workarounds only when the React implementation makes them unnecessary.
- [x] Decide whether to retain the packed export under `.archive/` or keep it temporarily as a rollback artifact.
- [x] Run type-checking, Knip, formatting, production build, and local browser checks.
- [ ] Run the deployment smoke test after the cutover is committed and Vercel deploys it.
- [x] Refresh Graphify and the Obsidian code map after the maintained source structure changes.
- [x] Update [[Current-State]], [[Decisions]], this progress dashboard, and the repository README.

Ready for deployment 2026-11-20. The approved React implementation is now authoritative in the room shell. `PortfolioFrame.tsx` and its iframe message/readiness/touch adapters were removed. The unchanged packed HTML remains temporarily in `public/` as a rollback artifact. Type checking, Knip, formatting, 5 Vitest checks, production build, and the root-page smoke test pass. Vercel verification remains after commit and push.

Gate: the user approves the visual result, all checks pass, Vercel serves the new implementation, and the repository clearly demonstrates React, TypeScript, and Tailwind skills.

## Acceptance matrix

| Area | Required parity |
| --- | --- |
| Visual | Arduino IDE identity, density, typography, teal accent, dark surfaces, section layouts |
| Content | Main, About, Skills, Experience, Contact, Lighthouse, Sec Rename, Room Portfolio |
| Navigation | Explorer, activity bar, tabs, tab closing, drawer, project launch |
| Feedback | Boot sequence, compile progress/success, Serial Monitor logs |
| Continuity | Minimize/restore preserves state; close/reopen resets state |
| Mobile | Landscape reading treatment, smooth scrolling, Back control, constrained-height usability |
| Accessibility | Keyboard access, focus visibility, semantic controls, names, contrast, reduced motion |
| Integration | Sec Rename opens correctly; monitor projection and outer shell remain unchanged |
| Engineering | Strict TypeScript, readable components, typed content, checks and build passing |

## Risks and controls

| Risk | Control |
| --- | --- |
| Visual drift during componentization | M0 screenshots and parity gates before each cutover step |
| Tailwind utilities alter outer room styles | Scope portfolio tokens and components; verify the room after setup |
| Removing the iframe breaks phone scrolling | Keep the export fallback and test direct React scrolling before removal |
| State behavior changes during refactor | Central reducer and focused transition checks |
| Content is accidentally rewritten | Extract typed content verbatim before editorial changes |
| Company-sensitive Lighthouse details expand | Preserve the approved public overview only |
| A large one-shot rewrite becomes difficult to review | Build beside the export and complete one milestone at a time |

## Progress update routine

At the start of a milestone:

1. Change its dashboard status to `In progress`.
2. Record the start date and any assumptions beneath that milestone.
3. Keep changes limited to the milestone's scope.

At the end of a milestone:

1. Run its stated gate.
2. Attach evidence as file links, commands, screenshots, or device results.
3. Record remaining limitations.
4. Change the status to `Ready for review`.
5. Mark it `Done` only after its acceptance gate is satisfied.

## Inputs needed from Angelo

Nothing else is required to begin M0 and M1 planning or implementation. Use these defaults unless Angelo changes them:

- Visual target: match the current Arduino portfolio.
- Content target: preserve the current wording and project information.
- Tailwind approach: official Tailwind Vite plugin.
- Migration approach: parallel React implementation with the export retained as fallback.
- Cutover: requires Angelo's visual approval.

Angelo's help will be needed for final visual comparison at his normal monitor viewport and physical-device checks on the S23 Ultra.

## References

- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [React reducer and context guidance](https://react.dev/learn/scaling-up-with-reducer-and-context)

