# Rocky Mountain Weddings - Site Update Script
# This script updates the version history file and commits changes to GitHub

# Get the description from the user
param (
    [Parameter(Mandatory=$true)]
    [string]$Description,
    
    [Parameter(Mandatory=$false)]
    [string]$Version = ""
)

# Get the current date
$CurrentDate = Get-Date -Format "yyyy-MM-dd"

# Check if version was provided, otherwise use "Update"
$VersionHeader = if ($Version) { "## Version $Version" } else { "## Update" }

# Create the new entry text
$NewEntry = @"

$VersionHeader - $CurrentDate
- $Description
"@

# Add the new entry to the version history file, after the header
$VersionHistoryContent = Get-Content "version_history.txt"
$HeaderLine = $VersionHistoryContent[0]
$UpdatedContent = $HeaderLine + "`n" + $NewEntry + "`n" + ($VersionHistoryContent | Select-Object -Skip 1 | Out-String)

# Write the updated content back to the file
$UpdatedContent | Out-File "version_history.txt" -Encoding utf8

# Display feedback
Write-Host "Version history updated with: $Description"

# Git commands to commit and push
git add .
git commit -m "$Description"
git push

Write-Host "Changes committed and pushed to GitHub"
Write-Host "Your Netlify site will update automatically" 