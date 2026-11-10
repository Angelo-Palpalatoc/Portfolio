$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$wrapper = Join-Path $PSScriptRoot 'Graphify.ps1'
$vaultMap = Join-Path $projectRoot 'project-notes/Code-Map'

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $wrapper extract . --code-only --max-workers 2
if ($LASTEXITCODE -ne 0) { throw 'Graphify extraction failed; the Obsidian export was not refreshed.' }

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $wrapper cluster-only . --no-label
if ($LASTEXITCODE -ne 0) { throw 'Graphify clustering/report generation failed.' }

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $wrapper export obsidian --dir $vaultMap
if ($LASTEXITCODE -ne 0) { throw 'Graphify completed, but the Obsidian export failed.' }

# Obsidian Canvas file links are relative to the vault root, not the canvas file.
# Graphify exports a standalone vault; adapt its canvas for this nested folder.
$canvasPath = Join-Path $vaultMap 'graph.canvas'
$canvas = Get-Content -LiteralPath $canvasPath -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($node in $canvas.nodes) {
    if ($node.type -eq 'file' -and $node.file -notlike 'Code-Map/*') {
        $node.file = 'Code-Map/' + $node.file
    }
}
[System.IO.File]::WriteAllText($canvasPath, ($canvas | ConvertTo-Json -Depth 100), [System.Text.UTF8Encoding]::new($false))

Write-Host 'Code map refreshed. Open project-notes in Obsidian, then Code-Map.'
