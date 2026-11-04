# Milestone 1 — interactive room monitor

## Visitor experience
- Visitors see the supplied room image as the full scene and can enter the landscape monitor by hovering on desktop, tapping on touch screens, or pressing Enter while its screen is focused.
- The camera approaches the monitor and stays there while visitors explore a live Projects window. A visible Back to room control and Escape return to the room.
- The portrait monitor remains part of the photograph for now. Project names and descriptions are explicitly sample content.

## Implementation tasks
- Mount an HTML screen layer inside the landscape monitor's visible display area without covering its physical frame.
- Build with React, TypeScript, and Vite. Keep the screen UI in its own React component and the room camera/interaction logic in another component so the UI can later be mounted in a Three.js scene.
- Scale the room and screen as one surface, maintain focus and keyboard access, and remove camera animation when reduced motion is requested.
- Preview at desktop and phone sizes, including repeat entry and exit.

## Acceptance criteria
- The screen layer remains aligned with the landscape display during approach and retreat, with the frame visible.
- Projects content is legible at desktop and phone sizes, and selecting either sample project changes its details.
- Desktop hover, touch tap, and keyboard Enter enter the monitor; Back to room and Escape leave it repeatedly.
- The view does not drift or retreat while interacting with the Projects window, and reduced motion uses an immediate camera change.
