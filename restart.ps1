# =============================================
# Wouchify - Restart Frontend & Backend Servers
# =============================================

Write-Host "`n Stopping all running Node processes..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Write-Host "All Node processes stopped." -ForegroundColor Green

# Start MongoDB (if not running)
Write-Host "`n Starting MongoDB..." -ForegroundColor Yellow
Start-Process -FilePath "mongod" -WindowStyle Hidden -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend in a new terminal window
Write-Host "`n Starting Backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 1

# Start Frontend in a new terminal window
Write-Host "Starting Frontend server..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; npm run dev" -WindowStyle Normal

Write-Host "`nBoth servers are restarting in new windows!" -ForegroundColor Green
Write-Host "  Backend  -> http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Frontend -> http://localhost:5173`n" -ForegroundColor Magenta
