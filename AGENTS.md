# Portfolio project guidance

## Scope and ownership

- Keep changes limited to the user's current request.
- Claude Design owns the actual Arduino portfolio content in `public/arduino-portfolio.html`. Leave it unchanged unless the user explicitly requests a change there.
- Preserve the manually calibrated monitor corners and shared projection unless the user asks to adjust the fit.
- Project context and decisions are in [project-notes/Home.md](project-notes/Home.md). Check relevant notes, then verify facts against current source.

## Graphify

Graphify 0.9.104 and its official Codex skill are installed locally. The skill is at `.codex/skills/graphify/SKILL.md`. It is also usable when the user requests `/graphify`.

- Use the local PowerShell wrapper, since `graphify` is not installed globally:
  `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Graphify.ps1 query "monitor"`
- For architecture or dependency questions, consult the graph when useful. Confirm findings in source; a missing edge is not proof of no relationship. Ordinary source search remains appropriate.
- The graph deliberately excludes the exported Arduino app, assets, dependencies, generated notes, and tooling. It is not a complete representation of the portfolio. CSS is currently not indexed by the code extractor; inspect it directly.
- Refresh after relevant source changes with:
  `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Refresh-CodeMap.ps1`
- The wrapper disables model/API extraction. Keep the setup code-only unless the user explicitly requests otherwise.
- Generated outputs live in ignored `graphify-out/` and `project-notes/Code-Map/`. Curated notes live outside `Code-Map`; update them when a confirmed decision changes.
- Do not install hooks, start watchers, upload the project, or enable paid model services as part of ordinary graph refreshes.
