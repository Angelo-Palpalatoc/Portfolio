# Interactive room portfolio — milestone 1

The supplied `MyRoom.png` is the scene. The landscape monitor contains a live React Projects window with clearly labeled sample work. The portrait monitor remains decorative.

## Local preview

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Local URL printed by Vite (normally `http://127.0.0.1:5173/`). Run `npm.cmd run build` to type-check and produce a static build in `dist/`.

The design review's desktop and phone before-and-after images are in [previews/comparison.html](./previews/comparison.html).

Hover over the landscape screen on desktop, tap it on touch screens, or focus it and press Enter. Use **Back to room** or Escape to leave.

## Structure

- `src/App.tsx`: room scene, monitor hotspot, camera approach, focus, and keyboard controls.
- `src/PortfolioDesktop.tsx`: independent Projects application for a future Three.js surface.
- `src/styles.css`: room geometry, overlay, zoom transition, and monitor UI styling.
- `MILESTONE.md`: experience, tasks, and acceptance criteria.
