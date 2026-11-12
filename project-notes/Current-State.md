---
tags: [portfolio, architecture]
---

# Current state

Updated from the source on 2026-11-12. See [[Decisions]] for constraints and [[Next-Steps]] for pending ideas.

## Visitor experience

1. The visitor starts looking into Angelo's room.
2. Entering the computer setup approaches the desk.
3. Entering the landscape monitor approaches the screen.
4. A Windows-style desktop contains **Portfolio** and **AutoRename** shortcuts. The Arduino-style portfolio opens by default.
5. Minimizing a window keeps it mounted and preserves its state; closing it resets that app. Taskbar indicators distinguish running and active apps.
6. The AutoRename project entry in the Arduino portfolio opens a guided mobile demo. Visitors can try a single fictional document or a batch of three fictional documents, review suggested names, and simulate saving copies individually.
7. The monitor desktop includes a simulated Windows taskbar and Start menu for the Portfolio and AutoRename apps. Taskbar indicators, minimize/restore behavior, outside-click dismissal, Escape, and Windows-key menu toggling are handled by the room shell; Lighthouse is not exposed as a runnable app.

The Lighthouse project entry now presents a recruiter-facing system architecture overview: React/TypeScript web app, Portal API, PostgreSQL/object storage, AI extraction with retrieval context, and an LLM assistant with streaming chat. Internal decision and orchestration layers are intentionally omitted from the public portfolio view.
The AutoRename and Room Portfolio project entries now include compact, technology-based architecture overviews. AutoRename shows Compose Multiplatform/Kotlin, ViewModel/StateFlow, Android ContentResolver with on-device OCR, company matching and SEC filename rules, coroutines with batch coordination, and safe export. The portfolio shows React/TypeScript/Vite, camera pose and projection math, CSS transforms with responsive interaction, the persistent iframe runtime, and embedded React demos. Each relationship is labeled with the responsibility or data flow it represents.

Pointer movement drives the desktop approach and departure. Touch/keyboard controls provide alternate entry. Escape backs out through the views. Reduced-motion preference bypasses the camera animation. Phones have a larger reading view; in portrait it rotates to landscape proportions, then returns to a wide reading view when the phone is turned.

### Reliability and recruiter access (2026-11-12)

- The room invitation now uses white type and a compact dark shadow so its section label, title, and instruction remain readable over the grey floor. Motion prompts and mobile Back controls use the shared Arduino teal, white, and dark-shell palette; the Back control has a dark translucent surface so it remains legible over both the dark portfolio and light AutoRename demo.
- Monitor shortcuts use one shared logical icon box and label cell for Portfolio and AutoRename, while taskbar icons use a smaller shared box that follows desktop taskbar proportions. Asset artwork cannot change either layout's dimensions.
- Phone motion distinguishes permission, calibration, active, denied, unavailable, and off states. Browsers that expose orientation without a permission gesture begin calibration automatically; browsers that require consent retain the explicit enable control. Motion becomes active only after usable orientation samples arrive, and a three-second no-data timeout returns visitors to the touch fallback.
- Device orientation uses the current screen rotation, shortest-angle deltas, a two-degree neutral zone, and explicit **Recenter** and **Turn off** controls. Touch movement stops competing with the sensor while motion is calibrating or active.
- Portrait portfolio scrolling chooses the nearest visible scrollable ancestor under the visitor's finger. The fallback considers visible scroll area as well as scroll range. Its short glide is based on recent swipe velocity.
- Minimized apps remain mounted. Restoring Portfolio or AutoRename from the taskbar preserves the current section, scroll position, and demo state; closing still starts a fresh app session.
- Start menu focus enters the first item when opened. Arrow keys, Home, End, and Escape work within the menu, and Escape returns focus to Start. The taskbar remains visible on touch-sized screens.
- The desktop wallpaper begins loading after the room image is ready so it does not compete with the initial room image. The deployed page now includes canonical, favicon, Open Graph, Twitter card, robots, and sitemap metadata.
- GitHub Actions runs the existing project checks and production build for pushes to `main` and pull requests.
- Browser verification covered desktop minimize/restore state, the unchanged calibrated polygon, Start-menu focus, 390 × 844 expanded reading bounds, simulated portrait scrolling with momentum, and simulated orientation events. Real sensor behavior still requires physical Android/iOS testing.

### Loading and mobile continuity (2026-11-09)

- The three live images use lossless WebP, reducing their combined file size from 6,136,874 bytes to 3,222,032 bytes (47.5%). Dimensions and all decoded RGBA bytes match the original PNGs. Originals remain locally in `.archive/source-assets/`.
- Room and wallpaper loads show quiet pending/error feedback with retry controls. The portfolio wrapper checks HTTP status and waits for the exported `#dc-root` to mount before revealing the iframe. Portfolio content in the export remains unchanged; its Serial Monitor now starts collapsed.
- A load still pending after 15 seconds offers retry; it may still finish normally. No automatic reload loop is used.
- On phones, entering the monitor opens the existing app directly in the full-screen reading view; no separate control strip or orientation prompt takes space. In portrait, the app rotates to landscape proportions, and turning the phone sideways keeps the expanded state and restores the regular wide layout. Touch drags in portrait use the dominant finger axis to control the portfolio content scroller, with a short ease-out glide; landscape uses native touch scrolling.
- AutoRename keeps its mobile demo upright in portrait phone view, using the available viewport without the Arduino portfolio's landscape rotation. Its desktop and landscape layouts remain unchanged.
- A compact, upright **Back** control is anchored to the expanded app's top-right corner with a transparent fill, so it follows the app when the portrait reading canvas rotates. It uses the Arduino teal accent consistently across the Arduino and AutoRename apps so it remains readable on both dark and light surfaces. AutoRename returns to the Arduino portfolio, then Back returns to the desk. At the desk, a touch-friendly **Back to room** control completes the route. The Arduino iframe remains mounted during its full-screen reading view, preserving its active section and scroll position.
- The boot screen no longer shows a **Skip** button, so it cannot overlap the phone Back control; the boot sequence continues automatically.
- The Arduino IDE Serial Monitor starts collapsed; users can still open it from the IDE toolbar.
- Phone expansion temporarily flattens the surrounding CSS layers so the app can fill the available viewport. Normal monitor calibration and projection are retained and restored on return, including a resize beyond the phone breakpoint.
- Browser checks covered failed-request retry, monitor fit, shared-document/scroll continuity, phone reading rotation at 390 × 844 and 844 × 390, simulated portrait touch scrolling, and return navigation to desk and room. Physical phones and Safari remain to be checked.

Responsive check 2026-11-11: touch-sized landscape viewports now remove the desktop 450px minimum scene height, preventing page overflow below short phone screens. Verified 320 × 568, 390 × 844, and 844 × 390 expanded reading views with the app and Back control inside the viewport.

### Transition behavior (updated 2026-11-08)

- Camera zoom and desk tilt share one animation loop. Desk parallax uses elapsed time so its response remains consistent across display refresh rates.
- Room POV tracking now pans up to ±18/±12 scene pixels (horizontal/vertical) for a more noticeable cursor-following camera response without changing the room zoom.
- On supported phones, an optional Device Orientation view maps calibrated beta/gamma tilt to room movement with a 0.8 multiplier, reaching full response after the neutral zone near 18° of tilt. Desk tilt uses a gentler 0.65 multiplier, while touch movement remains the fallback and motion pauses when an app is open.
- Desk parallax intensity is 1.3 times the original: pan up to ±28.6/±16.9 scene pixels (horizontal/vertical), and tilt up to ±4.16°/±3.12° (left-right/up-down). Cursor smoothing is unchanged.
- Automatic exits wait for camera arrival, then allow a 150 ms desk grace period or 110 ms monitor grace period, with a 10 px boundary margin. Returning inside cancels the pending exit.
- On camera arrival, hover is rechecked for a stationary mouse. Keyboard and explicit click/touch entry remain stable until deliberate mouse movement resumes.
- The animation loop stops when the camera and parallax settle, and resumes for movement or a new camera target.
- Reduced motion snaps the camera and disables desk tilt. Escape still returns through expanded reading view, monitor, desk, and room.

Browser checks covered controlled 60/144 Hz animation, boundary cancellation, idle loop completion, keyboard focus, and phone controls at 390 px and 320 px widths. These are functional checks, not a physical-device performance benchmark. Monitor calibration and Arduino portfolio content were preserved.

## Source map

| Resource                                            | Responsibility                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [App.tsx](../src/App.tsx)                           | Camera state, room/desk/screen views, app window, focus, mobile controls             |
| [LoadingState.tsx](../src/LoadingState.tsx)         | Image loading state and reusable loading/retry notice                                |
| [PortfolioFrame.tsx](../src/PortfolioFrame.tsx)     | Persistent iframe, export readiness, recovery, and embedded keyboard events          |
| [AutoRenameDemo.tsx](../src/AutoRenameDemo.tsx)     | Guided, UI-only mobile app demo with fictional single and batch samples              |
| [styles.css](../src/styles.css)                     | Scene geometry, calibrated screen corners, desktop/window styling, responsive layout |
| [monitorProjection.ts](../src/monitorProjection.ts) | Projective transform from the shared rectangle to four screen corners                |
| [main.tsx](../src/main.tsx)                         | React entry point                                                                    |
| [assets](../src/assets/)                            | Live room photograph and desktop wallpaper                                           |
| [Arduino export](../public/arduino-portfolio.html)  | Actual portfolio content; owned by Claude Design                                     |
| [package.json](../package.json)                     | React, TypeScript, Vite, development/build commands                                  |

The wallpaper, shortcut, and app share a projected monitor surface. Preserve that common coordinate system when adjusting alignment.

The shared surface is laid out at 1280 logical pixels wide, with height derived from the physical screen's aspect ratio, before projection. This avoids enlarging a tiny desktop raster in close-up. The projection still targets the same calibrated physical corners. The extra desk perspective layer is removed once its tilt returns to zero.

Pointer exits use short hysteresis delays: 280 ms from the monitor and 180 ms from the desk. Returning inside the active bounds cancels the pending exit.

The portrait monitor now renders a generated static Project Explorer image aligned to the physical vertical display beside the main monitor. It uses the shared Arduino teal, white, and dark-neutral palette and does not alter the main portfolio app.

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
