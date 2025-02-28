# Script to quickly open essential project files
# Usage: .\scripts\open-file.ps1 [file-type]
# Examples:
#   .\scripts\open-file.ps1 index    (opens index.html)
#   .\scripts\open-file.ps1 package  (opens package.json)
#   .\scripts\open-file.ps1 style    (opens main style file)

param(
    [Parameter(Mandatory=$true)]
    [string]$FileType
)

$projectPath = "D:\work\rockymountainweddings"
Set-Location $projectPath

switch ($FileType.ToLower()) {
    "index" { code "$projectPath\src\index.html" }
    "about" { code "$projectPath\src\about.html" }
    "blog" { code "$projectPath\src\blog.html" }
    "contact" { code "$projectPath\src\contact.html" }
    "package" { code "$projectPath\package.json" }
    "style" { code "$projectPath\src\styles\main.css" }
    "script" { code "$projectPath\src\js\main.js" }
    default { 
        Write-Host "Unknown file type: $FileType" -ForegroundColor Red 
        Write-Host "Available options: index, about, blog, contact, package, style, script" -ForegroundColor Yellow
    }
} 