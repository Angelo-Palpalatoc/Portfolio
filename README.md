# Angelo's room portfolio

An interactive room → desk → monitor experience built with React, TypeScript, and Vite. The landscape monitor contains a desktop and an Arduino-style portfolio app that opens by default. The portrait monitor remains decorative.

The surrounding experience takes inspiration from [Henry Heffernan's portfolio](https://github.com/henryjeff/portfolio-website). Claude Design owns the embedded portfolio content.

## Start locally

Use Node.js 22.12 or later and npm. From the project root:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the URL printed by Vite, normally http://127.0.0.1:5173/.

## Commands

| Command                    | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `npm.cmd run dev`          | Start the local development server                      |
| `npm.cmd run check`        | Check types, unused source/dependencies, and formatting |
| `npm.cmd run build`        | Type-check and generate the static site in `dist/`      |
| `npm.cmd run preview`      | Preview the generated build locally                     |
| `npm.cmd run format`       | Format maintained source and project configuration      |
| `npm.cmd run check:unused` | Run Knip's unused-code/dependency check                 |

Publish the contents of `dist/` when a static deployment is requested.

## Active project structure

```text
src/
  assets/               Room photograph and desktop wallpaper
  App.tsx               Camera, view navigation, app shell, focus, and phone controls
  LoadingState.tsx      Image loading, slow-load feedback, and retry UI
  PortfolioFrame.tsx    Persistent portfolio iframe, readiness, recovery, and keyboard events
  monitorProjection.ts  Four-corner desktop-to-monitor mapping
  styles.css            Organized styles for the surrounding experience
  main.tsx              React entry point
  vite-env.d.ts         Vite asset types
public/
  arduino-portfolio.html  Embedded portfolio export, owned by Claude Design
  portfolio-logo.webp    Supplied ACP app icon, losslessly encoded
project-notes/           Obsidian notebook: current state, decisions, and tooling
scripts/                 Local Graphify query and refresh commands
.vscode/                 Preview, build, and check tasks; Explorer preferences
```

Project configuration lives in the root: [package.json](./package.json), [tsconfig.json](./tsconfig.json), [knip.json](./knip.json), and [.prettierrc.json](./.prettierrc.json). [AGENTS.md](./AGENTS.md) records editing constraints for coding assistants.

## Experience and editing boundaries

- Move into the computer setup to approach the desk, then into the monitor to use the portfolio. Buttons support click, touch, and keyboard entry.
- Escape returns through the expanded phone view, monitor, desk, and room.
- The portfolio window can minimize, maximize, close, and reopen from the Portfolio shortcut. Minimize keeps the app mounted; close resets it.
- Phones enter a full-screen reading view from the monitor. Phone orientation changes keep the same iframe and app session, while closing and reopening starts a fresh session.
- The room, wallpaper, and logo use lossless WebP with unchanged dimensions and pixels. Their original PNGs are preserved locally in `.archive/source-assets/`.
- Room and portfolio loading failures have retry controls. Loads still pending after 15 seconds offer a retry without cancelling the original request.
- Desk parallax is **30% above its original intensity**. Optional phone motion starts automatically where the browser permits it, requests a tap only where browser consent is required, confirms sensor readings before activation, and provides recenter, off, and touch fallback controls. Reduced motion disables the animated camera approach and desk tilt.
- The shared desktop is rendered at **1280 logical pixels wide** before projection to preserve sharpness.
- The monitor's calibrated polygon lives in one `.monitor-screen` rule in [styles.css](./src/styles.css). Preserve it unless a fit adjustment is requested.
- Leave [the Arduino export](./public/arduino-portfolio.html) unchanged unless explicitly requested. Formatting commands exclude it.

## Project knowledge and code map

Start with [project-notes/Home.md](./project-notes/Home.md), or open `project-notes` as an Obsidian vault.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Graphify.ps1 query monitor
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Refresh-CodeMap.ps1
```

Graphify uses local code-only extraction; no model API is configured. Generated graph notes live in `project-notes/Code-Map`. See [Tooling.md](./project-notes/Tooling.md) for setup and limitations.

## Generated files and local originals

Dependencies, build output, Graphify output, and its local Python environment are generated and ignored by Git. Project Explorer settings hide these folders so the active source stays easy to navigate.

Original uploads, earlier comparison screenshots, the original design export, the superseded milestone, and the Sec-AutoRenamer APK are preserved locally in [.archive/](./.archive/README.md). They are not imported by the website, formatted, or included in Git. Back up that archive separately if those originals need to travel to another machine. The public AutoRename showcase uses only fictional, predefined data.

## Cleanup tools

- [Knip](https://github.com/webpro-nl/knip) checks unused TypeScript files, exports, and dependencies.
- [Prettier](https://github.com/prettier/prettier) keeps maintained source and configuration consistently formatted.

Knip is scoped to `src`. Dynamic public files and CSS still require manual review. No auto-delete or auto-fix command is part of the checks.
