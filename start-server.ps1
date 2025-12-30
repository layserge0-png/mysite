<#
  start-server.ps1
  Lance le serveur Node en arrière-plan (Windows PowerShell)
  Usage: .\start-server.ps1
#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

$serverFile = Join-Path $scriptDir 'deepseek_javascript_20251230_f590fb.js'
if (-not (Test-Path $serverFile)) {
    Write-Error "Fichier serveur introuvable: $serverFile"
    exit 1
}

Write-Host "Démarrage du serveur : $serverFile"
Start-Process -FilePath (Get-Command node).Source -ArgumentList $serverFile -NoNewWindow
Write-Host "Serveur lancé en arrière-plan. Vérifie http://localhost:3000"
