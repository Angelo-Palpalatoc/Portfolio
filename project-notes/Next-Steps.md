---
tags: [portfolio, planning]
---

# Next steps

Related: [[Current-State]], [[Decisions]], [[Tooling]].

## Awaiting direction

- Continue the Arduino portfolio's actual content/design in Claude Design. Integrate a new export only when the user supplies or requests it.
- Decide what the portrait monitor should show. A CV, project showcase, and AutoRenamer demo were discussed; no final content choice is recorded here.
- Decide whether the current fictional AutoRename single/batch demo needs additional recruiter-facing scenarios. Keep it UI-only and do not access visitor files or cameras.

## Verification when revisiting the outer UI

- Check the calibrated monitor fit at the user's actual viewport.
- Check room/desk/monitor entry and exit, keyboard focus, reduced motion, and phone reading controls after relevant changes.
- Test on physical phones and Safari; browser viewport checks do not replace device testing.
- Verify motion permission, calibration, recentering, rotation-axis mapping, and the no-data fallback on the user's S23 Ultra in Brave and Chrome. Repeat on iPhone Safari when available.
- Recheck loading/retry and phone reading continuity when integrating a new Claude export. The readiness adapter currently expects its `#dc-root` mount.
- Run a production Lighthouse or Web Vitals audit after deployment and optimize only measured bottlenecks. Preserve the lossless close-up monitor assets unless a visual comparison approves responsive alternatives.
- Run the existing build after application changes.

Do not treat this list as authorization to implement new features.
