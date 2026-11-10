param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $GraphifyArgs
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$graphifyExe = Join-Path $projectRoot '.tools/graphify-venv/Scripts/graphify.exe'
if (-not (Test-Path -LiteralPath $graphifyExe)) {
    throw 'Graphify is missing. See project-notes/Tooling.md for installation instructions.'
}

# No model/API extraction or automatic skill refresh for this local setup.
$settings = @{
    GRAPHIFY_BACKEND = 'none'
    GRAPHIFY_NO_AUTO_REFRESH = '1'
    PYTHONIOENCODING = 'utf-8'
}
$previous = @{}
foreach ($key in $settings.Keys) {
    $previous[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
    [Environment]::SetEnvironmentVariable($key, $settings[$key], 'Process')
}

Push-Location -LiteralPath $projectRoot
try {
    & $graphifyExe @GraphifyArgs
    $result = $LASTEXITCODE
}
finally {
    Pop-Location
    foreach ($key in $settings.Keys) {
        [Environment]::SetEnvironmentVariable($key, $previous[$key], 'Process')
    }
}
exit $result
