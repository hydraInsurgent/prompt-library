# plib setup - adds the 'plib' command to your PowerShell profile
# Run once: powershell -ExecutionPolicy Bypass -File setup.ps1

$PlibHome = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$PlibCli = Join-Path (Join-Path $PlibHome "cli") "plib.js"

# Verify the CLI exists
if (-not (Test-Path $PlibCli)) {
    Write-Host "Error: Could not find cli/plib.js at $PlibCli" -ForegroundColor Red
    exit 1
}

# Ensure PowerShell profile exists
if (-not (Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force | Out-Null
    Write-Host "Created PowerShell profile at $PROFILE" -ForegroundColor DarkGray
}

# Check if already installed
$profileContent = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
if ($profileContent -and $profileContent.Contains("# plib - Prompt Library CLI")) {
    Write-Host "plib is already in your PowerShell profile." -ForegroundColor Yellow
    Write-Host "To reinstall, remove the plib block from $PROFILE and run again." -ForegroundColor DarkGray
    exit 0
}

# Add the plib function to the profile
$block = @"

# plib - Prompt Library CLI
function plib {
    `$env:PLIB_HOME = "$PlibHome"
    node "$PlibCli" @args
}
"@

Add-Content -Path $PROFILE -Value $block

Write-Host ""
Write-Host "plib installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "  PLIB_HOME = $PlibHome" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Reload your shell:  . `$PROFILE" -ForegroundColor Cyan
Write-Host "  Then run:           plib list" -ForegroundColor Cyan
Write-Host ""
