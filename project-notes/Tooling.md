---
tags: [portfolio, tooling]
---
# Graphify and Obsidian

Related: [[Home]], [[Current-State]], [[Decisions]].

## Installed

- **Graphify 0.9.104** (`graphifyy` on PyPI), in `.tools/graphify-venv` with Python 3.12.
- Official Graphify Codex skill in `.codex/skills/graphify`.
- **Obsidian 1.15.0**, installed for the current Windows user.
- This vault is the `project-notes` folder inside the portfolio repository.

All commands below run from the repository root. The local wrapper means you do not need a global `graphify` command or an activated Python environment.

## Refresh the graph and Obsidian map

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Refresh-CodeMap.ps1
```

This scans supported code, generates a report and HTML graph, then exports linked notes and a canvas into `project-notes/Code-Map`. It uses `--code-only`, `--no-label`, and `GRAPHIFY_BACKEND=none`; no model API is required. No watcher or Git hook runs in the background.

Curated notes are outside `Code-Map` and are preserved during refresh. Generated outputs and the local environment are ignored by Git. Curated notes, setup scripts, and vault preferences may be committed with the project.

## Ask about the code

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Graphify.ps1 query monitor
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Graphify.ps1 explain 'monitorProjection()'
```

In a new Codex turn, you can also request: **Use Graphify to explain the monitor projection.** Project guidance points the assistant at the local commands.

The graph is an aid to navigation. CSS is not indexed by this extractor. The exported Arduino app, image assets, APK, dependencies, notes, and tooling are excluded using `.graphifyignore`. Verify findings against source.

## View it

- In Obsidian, open [[Home]], then [[Code-Map/graph.canvas|the canvas]].
- Use the left **Graph view** icon to see linked Markdown notes.
- For Graphify's separate browser visualization, open `graphify-out/graph.html` from the repository.
- To reopen the vault, launch Obsidian and select **project-notes**. If needed, choose **Open folder as vault** and select this project's `project-notes` folder.

No Obsidian account, Sync, Publish, or community plugin is configured. Notes are local files; back them up or commit curated notes as desired.

## Recreate the Graphify environment on another machine

With Python 3.12 and uv installed:

```powershell
uv venv .tools/graphify-venv --python 3.12
uv pip install --python .tools/graphify-venv/Scripts/python.exe graphifyy==0.9.104
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Refresh-CodeMap.ps1
```

These commands are for recreating the ignored local environment; they are not necessary for normal use on this machine.

## Finalization checks

```powershell
npm.cmd run check
npm.cmd run build
```

`check` runs TypeScript, Knip's unused-code/dependency checks, and Prettier's formatting check. Run `npm.cmd run format` to format the maintained source and project configuration. The formatting commands intentionally exclude the Claude-owned Arduino HTML export.

Knip is scoped to maintained source under `src`; it does not prove that dynamic public files or CSS selectors are unused. Those need manual review. The cleanup stylesheet was compared against pre-cleanup computed styles in ten desktop/phone states.

Live images are under `src/assets`. Historical originals are preserved locally in `.archive`, excluded from Git, analysis, and formatting. VS Code hides that folder and generated folders using project settings. Preserve/back up the archive separately if you need it on another machine.

Open-source development tools: [Knip](https://github.com/webpro-nl/knip) and [Prettier](https://github.com/prettier/prettier).

Official references: [Graphify](https://github.com/Graphify-Labs/graphify), [CLI](https://docs.graphify.com/open-source/configuration/cli), [Obsidian](https://obsidian.md/).
