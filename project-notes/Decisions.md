---
tags: [portfolio, decisions]
---
# Decisions

Related: [[Home]], [[Current-State]], [[Next-Steps]]. These summarize the user's confirmed direction; they are not new feature approvals.

## Experience

- Keep the visitor's point of view in the room: **room → computer setup/desk → monitor**.
- Keep the portfolio inside the landscape monitor, with working scrolling.
- The Arduino-style portfolio is the actual portfolio. The separate web portfolio was removed.
- Keep the desktop wallpaper and an app that can close and reopen. Open the Arduino portfolio by default.
- Use the supplied ACP icon with **Portfolio** below it, like a desktop shortcut.
- Keep one portfolio iframe when switching phone reading size; keep app state while resizing, and reset it on close/reopen.
- Serve lossless WebP versions of the room, wallpaper, and icon; preserve the original image dimensions and decoded pixels.
- Keep the existing Lighthouse project content unchanged. Its interactive demo remains withdrawn because it is company property.
- Add AutoRename as a separate project with a guided mobile UI demo. Use fictional data and a prepared result; do not access visitor files or the camera.
- Henry Heffernan's portfolio is the reference for the immersive interaction. Refer to his code when changing that experience: https://github.com/henryjeff/portfolio-website.

## Ownership and scope

- Claude Design continues the actual Arduino portfolio app's design/content.
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

## Tooling setup

Graphify is a local code map, with model extraction disabled. Obsidian stores Markdown notes and the exported graph. Neither is a runtime dependency of the public portfolio. See [[Tooling]].
