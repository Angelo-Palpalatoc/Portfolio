---
tags: [portfolio, planning]
---
# Next steps

Related: [[Current-State]], [[Decisions]], [[Tooling]].

## Awaiting direction

- Continue the Arduino portfolio's actual content/design in Claude Design. Integrate a new export only when the user supplies or requests it.
- Decide what the portrait monitor should show. A CV, project showcase, and AutoRenamer demo were discussed; no final content choice is recorded here.
- Decide how to showcase Sec-AutoRenamer. The APK exists locally; a video or browser recreation was discussed. No mobile demo has been implemented as part of this tooling setup.

## Verification when revisiting the outer UI

- Check the calibrated monitor fit at the user's actual viewport.
- Check room/desk/monitor entry and exit, keyboard focus, reduced motion, and phone reading controls after relevant changes.
- Test on physical phones and Safari; browser viewport checks do not replace device testing.
- Recheck loading/retry and phone reading continuity when integrating a new Claude export. The readiness adapter currently expects its `#dc-root` mount.
- Run the existing build after application changes.

Do not treat this list as authorization to implement new features.
