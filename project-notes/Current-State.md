---
tags: [portfolio, architecture]
---
# Current state

Updated from the source on 2026-11-10. See [[Decisions]] for constraints and [[Next-Steps]] for pending ideas.

## Visitor experience

1. The visitor starts looking into Angelo's room.
2. Entering the computer setup approaches the desk.
3. Entering the landscape monitor approaches the screen.
4. A Windows-style desktop contains **Portfolio** and **AutoRename** shortcuts. The Arduino-style portfolio opens by default.
5. Closing a window returns to the desktop; either shortcut can open its app.
6. The AutoRename project entry in the Arduino portfolio opens a guided mobile demo. Visitors can try a single fictional document or a batch of three fictional documents, review suggested names, and simulate saving copies individually.

Pointer movement drives the desktop approach and departure. Touch/keyboard controls provide alternate entry. Escape backs out through the views. Reduced-motion preference bypasses the camera animation. Phones have a larger reading view; in portrait it rotates to landscape proportions, then returns to a wide reading view when the phone is turned.

### Loading and mobile continuity (2026-11-09)

- The three live images use lossless WebP, reducing their combined file size from 6,136,874 bytes to 3,222,032 bytes (47.5%). Dimensions and all decoded RGBA bytes match the original PNGs. Originals remain locally in `.archive/source-assets/`.
- Room and wallpaper loads show quiet pending/error feedback with retry controls. The portfolio wrapper checks HTTP status and waits for the exported `#dc-root` to mount before revealing the iframe. Portfolio content in the export remains unchanged; its Serial Monitor now starts collapsed.
- A load still pending after 15 seconds offers retry; it may still finish normally. No automatic reload loop is used.
- On phones, entering the monitor opens the existing app directly in the full-screen reading view; no separate control strip or orientation prompt takes space. In portrait, the app rotates to landscape proportions, and turning the phone sideways keeps the expanded state and restores the regular wide layout. Touch drags in portrait use the dominant finger axis to control the portfolio content scroller, with a short ease-out glide; landscape uses native touch scrolling.
- A compact, upright **Back** control is anchored to the expanded app's top-right corner with a transparent fill, so it follows the app when the portrait reading canvas rotates. AutoRename returns to the Arduino portfolio, then Back returns to the desk. At the desk, a touch-friendly **Back to room** control completes the route. The Arduino iframe remains mounted during its full-screen reading view, preserving its active section and scroll position.
- The boot screen no longer shows a **Skip** button, so it cannot overlap the phone Back control; the boot sequence continues automatically.
- The Arduino IDE Serial Monitor starts collapsed; users can still open it from the IDE toolbar.
- Phone expansion temporarily flattens the surrounding CSS layers so the app can fill the available viewport. Normal monitor calibration and projection are retained and restored on return, including a resize beyond the phone breakpoint.
- Browser checks covered failed-request retry, monitor fit, shared-document/scroll continuity, phone reading rotation at 390 × 844 and 844 × 390, simulated portrait touch scrolling, and return navigation to desk and room. Physical phones and Safari remain to be checked.

Responsive check 2026-11-11: touch-sized landscape viewports now remove the desktop 450px minimum scene height, preventing page overflow below short phone screens. Verified 320 × 568, 390 × 844, and 844 × 390 expanded reading views with the app and Back control inside the viewport.

### Transition behavior (updated 2026-11-08)

- Camera zoom and desk tilt share one animation loop. Desk parallax uses elapsed time so its response remains consistent across display refresh rates.
- Desk parallax intensity is 1.3 times the original: pan up to ±28.6/±16.9 scene pixels (horizontal/vertical), and tilt up to ±4.16°/±3.12° (left-right/up-down). Cursor smoothing is unchanged.
- Automatic exits wait for camera arrival, then allow a 150 ms desk grace period or 110 ms monitor grace period, with a 10 px boundary margin. Returning inside cancels the pending exit.
- On camera arrival, hover is rechecked for a stationary mouse. Keyboard and explicit click/touch entry remain stable until deliberate mouse movement resumes.
- The animation loop stops when the camera and parallax settle, and resumes for movement or a new camera target.
- Reduced motion snaps the camera and disables desk tilt. Escape still returns through expanded reading view, monitor, desk, and room.

Browser checks covered controlled 60/144 Hz animation, boundary cancellation, idle loop completion, keyboard focus, and phone controls at 390 px and 320 px widths. These are functional checks, not a physical-device performance benchmark. Monitor calibration and Arduino portfolio content were preserved.

## Source map

| Resource | Responsibility |
| --- | --- |
| [App.tsx](../src/App.tsx) | Camera state, room/desk/screen views, app window, focus, mobile controls |
| [LoadingState.tsx](../src/LoadingState.tsx) | Image loading state and reusable loading/retry notice |
| [PortfolioFrame.tsx](../src/PortfolioFrame.tsx) | Persistent iframe, export readiness, recovery, and embedded keyboard events |
| [AutoRenameDemo.tsx](../src/AutoRenameDemo.tsx) | Guided, UI-only mobile app demo with fictional single and batch samples |
| [styles.css](../src/styles.css) | Scene geometry, calibrated screen corners, desktop/window styling, responsive layout |
| [monitorProjection.ts](../src/monitorProjection.ts) | Projective transform from the shared rectangle to four screen corners |
| [main.tsx](../src/main.tsx) | React entry point |
| [assets](../src/assets/) | Live room photograph and desktop wallpaper |
| [Arduino export](../public/arduino-portfolio.html) | Actual portfolio content; owned by Claude Design |
| [package.json](../package.json) | React, TypeScript, Vite, development/build commands |

The wallpaper, shortcut, and app share a projected monitor surface. Preserve that common coordinate system when adjusting alignment.

The shared surface is laid out at 1280 logical pixels wide, with height derived from the physical screen's aspect ratio, before projection. This avoids enlarging a tiny desktop raster in close-up. The projection still targets the same calibrated physical corners. The extra desk perspective layer is removed once its tilt returns to zero.

## Run locally

```powershell
npm.cmd run dev
```

Vite normally serves `http://127.0.0.1:5173/`. To type-check and build:

```powershell
npm.cmd run build
```

The root README describes the active folder structure and commands. Historical screenshots, uploaded references, the original export, the APK, and the superseded milestone are preserved locally under `.archive/`, outside the active source tree and ignored by Git. Generated folders are hidden in the project Explorer; Obsidian still reads its generated code map normally.

Cleanup consolidated the stylesheet, removed unused screen-scaling state, and organized live images under `src/assets`. The Arduino export's portfolio content remains Claude Design-owned; the Serial Monitor's default open/closed state is configured in that export. Knip checks unused source/dependencies, and Prettier handles formatting; see [[Tooling]].
