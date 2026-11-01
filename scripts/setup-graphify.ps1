$ErrorActionPreference = 'Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
        throw 'Install uv first: https://docs.astral.sh/uv/getting-started/installation/'
    }
    if (-not (Test-Path '.tools/graphify/Scripts/python.exe')) {
        uv venv .tools/graphify --python python --cache-dir .tools/uv-cache
        if ($LASTEXITCODE -ne 0) { throw 'Could not create Graphify environment.' }
    }
    uv pip install --python .tools/graphify/Scripts/python.exe --cache-dir .tools/uv-cache 'graphifyy==0.9.100'
    if ($LASTEXITCODE -ne 0) { throw 'Could not install Graphify.' }
    Write-Host 'Ready: npm run graph:build, then npm run graph:query -- "App"'
} finally {
    Pop-Location
}
