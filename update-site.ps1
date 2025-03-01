# Rocky Mountain Weddings - Site Update Script
# This script updates the version history files and commits changes to GitHub

# Get the description from the user
param (
    [Parameter(Mandatory=$true)]
    [string]$Description,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("major", "minor", "patch", "auto")]
    [string]$VersionType = "auto"
)

Write-Host "Updating site with description: $Description"
Write-Host "Version type: $VersionType"

# Use the new update-version script to handle versioning
if ($VersionType -eq "auto") {
    $NewVersion = ./update-version.ps1 -CommitMessage $Description -AutoDetect
} else {
    $NewVersion = ./update-version.ps1 -CommitMessage $Description -VersionType $VersionType
}

Write-Host "Updated to version $NewVersion"

# Git commands to commit and push
git add .
git commit -m "$Description (v$NewVersion)"
git push

Write-Host "Changes committed and pushed to GitHub"
Write-Host "Your Cloudflare Pages site will update automatically" 