---
tags: [portfolio, migration, baseline]
status: recorded
updated: 2026-11-20
---

# Arduino portfolio baseline

Related: [[Arduino-Portfolio-React-Migration]], [[Current-State]].

## Capture environment

- Source: `public/arduino-portfolio.html`, loaded directly from Vite and also through the room shell.
- Integrated browser desktop viewport: 1119 × 630 CSS pixels. Browser tooling constrained a requested 1365 × 768 viewport to this visible area.
- Narrow portrait viewport: 291 × 630 CSS pixels after the same browser constraint.
- Short landscape viewport: 844 × 390 CSS pixels.
- The existing export is the visual and content authority. No editorial or design changes are part of this migration.

## Screenshots

- [Room with projected monitor](./migration-room-baseline.png)
- [Boot wordmark](./migration-baseline/boot.png)
- [Main IDE view](./migration-baseline/main.png)
- [About](./migration-baseline/about.png)
- [Skills](./migration-baseline/skills.png)
- [Experience](./migration-baseline/experience.png)
- [Contact](./migration-baseline/contact.png)
- [Lighthouse](./migration-baseline/lighthouse.png)
- [Sec Rename](./migration-baseline/sec-rename.png)
- [Room Portfolio](./migration-baseline/room-portfolio.png)
- [Serial Monitor expanded](./migration-baseline/serial-expanded.png)
- [Compile in progress](./migration-baseline/compile-progress.png)
- [Compile success](./migration-baseline/compile-success.png)
- [Narrow portrait](./migration-baseline/phone-portrait.png)
- [Narrow explorer drawer](./migration-baseline/phone-drawer.png)
- [Short landscape](./migration-baseline/phone-landscape.png)

## Visible content contract

Explorer order: `main.ino`, `about.ino`, `skills.ino`, `experience.ino`, `contact.ino`, then expanded `projects` containing `lighthouse.ino`, `autorenamer.ino`, and `portfolio.ino`. The visible explorer filename `autorenamer.ino` is part of the approved baseline even though the project is named Sec Rename elsewhere.

- Main: code-style introduction, full-stack headline and summary, three practice labels, project button, email, eight technology chips.
- About: personal story, education, project journey, and interests.
- Skills: seven production skill groups, working-knowledge list, and practice/how-I-work content.
- Experience: three roles with dates and bullets.
- Contact: email, GitHub, LinkedIn, and availability.
- Lighthouse: work-project description, role and technology overview, public architecture, outcomes, and technology chips. Preserve its current disclosure level.
- Sec Rename: personal-project overview, offline/privacy emphasis, single and batch workflows, public architecture, and demo launch.
- Room Portfolio: personal-project overview, room-to-screen interaction, inspiration, architecture, learnings, and stack.

Each selected file updates the Info panel's section name, technology chips, metadata and status-bar line number. The panel is shown at viewport widths of at least 1024 CSS pixels. The panel includes contact links.

## Interaction contract

- Initial state: boot loading; `main` active; only `main` tab open; explorer closed on narrow widths; Serial Monitor collapsed; no compile message.
- Boot: four loading labels appear at 290 ms intervals, followed by a 350 ms delay and the wordmark. `[ RUN PORTFOLIO ]` closes the overlay; `[ VIEW GITHUB ]` opens the GitHub profile.
- Layout: narrow mode below 900 px; explorer is a 250 px drawer there and a 226 px persistent panel otherwise. Info panel appears at 1024 px or wider. Content layouts also change at 620, 760, 900, and 1180 px in their respective sections.
- Explorer navigation: opening a file activates it, adds a tab if absent, closes the narrow drawer, and appends a timestamped Serial Monitor entry. Folder header is not a file.
- Tabs: selecting an existing tab does not add another. Closing the active tab activates the last remaining tab. Closing the final tab restores `main`.
- Toolbar Verify: shows `Compiling...`, logs the action, then after 800 ms shows `Success · 0 errors` and logs zero errors/warnings. The temporary toolbar message clears after about 3 seconds.
- Upload opens Contact. The Serial Monitor button and divider toggle the collapsed panel. Log history is capped at 40 entries.
- Sec Rename demo: the exported document sends a same-origin `open-autorenamer-demo` message to its parent; the room shell opens the separate demo window.
- The room shell owns app-window minimize/restore/close, phone reading expansion, keyboard navigation, camera and screen projection. Its iframe wrapper observes `#dc-root > *` for readiness and supplies a retry state. These become direct React integration responsibilities at cutover.
- Maintain smooth vertical scrolling in content and explorer. The current portrait phone expansion uses a rotated landscape reading surface; retain this behavior during parity testing.

## Acceptance

Compare the replacement against these screenshots, source copy, and interactions. The user's full desktop and S23 Ultra Brave checks remain part of the final cutover gate. The baseline captures do not approve a redesign.
