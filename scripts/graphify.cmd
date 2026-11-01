@echo off
setlocal
cd /d "%~dp0.."
set "PYTHONUTF8=1"
set "GRAPHIFY_NO_AUTO_REFRESH=1"
if not exist ".tools\graphify\Scripts\graphify.exe" (
  echo Graphify is missing. Run: powershell -ExecutionPolicy Bypass -File scripts/setup-graphify.ps1
  exit /b 1
)
".tools\graphify\Scripts\graphify.exe" %*
exit /b %errorlevel%
