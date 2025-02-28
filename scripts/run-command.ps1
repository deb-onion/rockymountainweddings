# Script to run AI-suggested commands
# Usage: .\scripts\run-command.ps1 "Your command here"
# Example: .\scripts\run-command.ps1 "npm install express --save"

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

$projectPath = "D:\work\rockymountainweddings"
Set-Location $projectPath

Write-Host "Running command: $Command" -ForegroundColor Cyan
Invoke-Expression $Command 