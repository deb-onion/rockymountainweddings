param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("major", "minor", "patch")]
    [string]$VersionType = "patch",
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoDetect
)

# Function to determine version type from commit message
function Get-VersionTypeFromCommit {
    param([string]$Message)
    
    if ($Message -match "(BREAKING CHANGE|MAJOR|redesign|complete overhaul)") {
        return "major"
    }
    elseif ($Message -match "(feat|feature|add|new|enhance)") {
        return "minor"
    }
    else {
        return "patch"
    }
}

# Auto-detect version type if enabled
if ($AutoDetect) {
    $VersionType = Get-VersionTypeFromCommit -Message $CommitMessage
    Write-Host "Auto-detected version type: $VersionType based on commit message"
}

# Get current date
$CurrentDate = Get-Date -Format "yyyy-MM-dd"

# Read current version from version_history.txt
$VersionHistoryPath = "version_history.txt"
$VersionHistory = Get-Content $VersionHistoryPath
$CurrentVersionLine = ($VersionHistory | Select-String -Pattern "^## Version \d+\.\d+\.\d+ -" | Select-Object -First 1).Line

if ($CurrentVersionLine) {
    $CurrentVersion = [regex]::Match($CurrentVersionLine, "(\d+\.\d+\.\d+)").Groups[1].Value
    $VersionParts = $CurrentVersion -split "\."
    $Major = [int]$VersionParts[0]
    $Minor = [int]$VersionParts[1]
    $Patch = [int]$VersionParts[2]
} else {
    # Default to 1.0.0 if no version found
    $Major = 1
    $Minor = 0
    $Patch = 0
}

# Increment version based on version type
switch ($VersionType) {
    "major" {
        $Major++
        $Minor = 0
        $Patch = 0
    }
    "minor" {
        $Minor++
        $Patch = 0
    }
    "patch" {
        $Patch++
    }
}

$NewVersion = "$Major.$Minor.$Patch"
Write-Host "Updating from version $CurrentVersion to $NewVersion"

# Update version_history.txt
$NewVersionEntry = "## Version $NewVersion - $CurrentDate`r`n- $CommitMessage`r`n"
$NewContent = $NewVersionEntry + ($VersionHistory -join "`r`n")
Set-Content -Path $VersionHistoryPath -Value $NewContent

# Update CHANGELOG.md
$ChangelogPath = "CHANGELOG.md"
$Changelog = Get-Content $ChangelogPath -Raw
$ChangelogHeader = "# Rocky Mountain Weddings - Changelog"

if ($Changelog -match $ChangelogHeader) {
    $NewSection = "## Version $NewVersion - $CurrentDate`r`n`r`n### Changes`r`n- $CommitMessage`r`n`r`n"
    $NewChangelog = $Changelog -replace "$ChangelogHeader`r`n", "$ChangelogHeader`r`n`r`n$NewSection"
    Set-Content -Path $ChangelogPath -Value $NewChangelog
} else {
    # Create new changelog if it doesn't exist or has incorrect format
    $NewChangelog = "$ChangelogHeader`r`n`r`n## Version $NewVersion - $CurrentDate`r`n`r`n### Changes`r`n- $CommitMessage`r`n"
    Set-Content -Path $ChangelogPath -Value $NewChangelog
}

Write-Host "Version history and changelog updated successfully"

# Return the new version for use in other scripts
return $NewVersion 