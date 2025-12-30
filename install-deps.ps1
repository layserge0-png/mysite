<#
  install-deps.ps1
  Usage: .\install-deps.ps1
  Installe les dépendances nécessaires pour exécuter le serveur DeepSeek
#>

# Se positionner dans le dossier du script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "Working directory: $scriptDir"

if (-not (Test-Path package.json)) {
    Write-Host "Aucun package.json trouvé — création d'un package.json par défaut..."
    npm init -y | Out-Null
}

Write-Host "Installation d'Express et CORS..."
npm install express@^5.2.1 cors --no-audit --no-fund

Write-Host "Installation terminée. Pour démarrer le serveur : .\start-server.ps1 ou node .\deepseek_javascript_20251230_f590fb.js"
