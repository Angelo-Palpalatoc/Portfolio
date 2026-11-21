---
tags: [portfolio, decisions]
---

# Decisions

Related: [[Home]], [[Current-State]], [[Next-Steps]]. These summarize the user's confirmed direction; they are not new feature approvals.

## Experience

- Keep the visitor's point of view grounded in the room: **mobile starts at `room` → `desk` → monitor** (where the 3:4 room photo fills portrait screens naturally), while **desktop starts directly at the full-bleed `desk` view** (both monitors immediately visible with zero side pillarbox bars, staying at the desk on exit).
- Keep the portfolio inside the landscape monitor, with working scrolling.
- The Arduino-style portfolio is the actual portfolio. The separate web portfolio was removed.
- Keep the desktop wallpaper and an app that can close and reopen. Open the Arduino portfolio by default.
- Use the supplied ACP icon with **Portfolio** below it, like a desktop shortcut.
- Keep one React portfolio instance when switching phone reading size; preserve app state while resizing or minimizing, and reset it on close/reopen. On portrait phones, entering the monitor presents the app sideways in landscape proportions; turning the phone to landscape restores a conventional wide reading view.
- Phone motion is optional. Confirm actual sensor readings before treating it as active, provide touch fallback plus recenter/off controls, and respect reduced-motion preference.
- Start phone motion automatically when the browser exposes orientation readings without a permission gesture. Show the enable control only when the browser requires explicit consent; the browser's permission decision cannot be bypassed.
- Use Arduino teal (`#00979C`), white, and black/dark neutrals for new room-shell UI components.
- Serve lossless WebP versions of the room, wallpaper, and icon; preserve the original image dimensions and decoded pixels.
- Keep the existing Lighthouse project content unchanged. Its interactive demo remains withdrawn because it is company property.
- Add Sec Renamer as a separate project with a guided mobile UI demo. Use fictional data and a prepared result; do not access visitor files or the camera.
- Henry Heffernan's portfolio is the reference for the immersive interaction. Refer to his code when changing that experience: https://github.com/henryjeff/portfolio-website.
- Use a 280 ms monitor exit grace period and 180 ms desk exit grace period so pointer movement across the irregular projected edges does not trigger premature exits. Preserve the existing 10 px boundary margin and re-entry cancellation.
- Use the portrait monitor as a second zoomable display (`view = 'portrait'`) using the same `monitorProjection` math and spring camera as the main monitor. At the desk view, a short hover dwell (~220 ms) or click zooms directly into an in-monitor vector CV viewer (`src/PortraitCvViewer.tsx`) with scroll, clickable links, Open PDF, and Download PDF (`public/Angelo-Palpalatoc-CV.pdf`); moving outside or pressing Escape glides back to the desk, and phones expand it upright.
- Keep the Room View entry immersive (no Skip button or `/?direct=1` bypass); communicate Angelo's identity, role, stack, and dual-monitor layout cleanly in the room caption.

## Ownership and scope

- Preserve the approved Claude Design portfolio content and visual direction while maintaining the active implementation in readable React, TypeScript, and Tailwind source.
- Work here focuses on surrounding UI/UX unless the user explicitly asks for app content changes.
- Do not alter unrelated behavior or styling.

## Monitor fit

The physical screen is not a perfect rectangle in the room photograph. The desktop and app use a shared four-corner projection, based on the screen's CSS polygon.

Current calibration, verified 2026-11-08:

```css
polygon(0.3% 1.7%, 100.4% 0, 100.7% 98.7%, 0.2% 98.7%)
```

Order: top-left, top-right, bottom-right, bottom-left. Values describe points relative to the screen element, not browser pixel dimensions.

The user tuned these corners through several visual reviews. Preserve them unless asked to recalibrate. The single authoritative polygon is now in the `.monitor-screen` rule in `src/styles.css`; legacy duplicates were consolidated during cleanup on 2026-11-09.

Portrait monitor calibration (verified from user reference on 2026-11-20 in `.portrait-monitor`, `src/styles.css`):

```css
left: 36.82%;
top: 46%;
width: 8.34%;
height: 11.42%;
clip-path: polygon(0% 0%, 99% 1.8%, 100% 96%, 0.6% 100%);
```

## Tooling setup

Graphify is a local code map, with model extraction disabled. Obsidian stores Markdown notes and the exported graph. Neither is a runtime dependency of the public portfolio. See [[Tooling]].
