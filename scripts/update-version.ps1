# Rocky Mountain Weddings - Automated Version Update Script
# This script automates the entire version update process:
# 1. Updates version number in package.json
# 2. Updates version_history.txt
# 3. Updates update-log.txt
# 4. Optionally commits changes to Git

param (
    [Parameter(Mandatory=$true)]
    [string]$Description,

    [Parameter(Mandatory=$false)]
    [ValidatePattern('^\d+\.\d+\.\d+$')]
    [string]$Version = "",

    [Parameter(Mandatory=$false)]
    [switch]$Major,

    [Parameter(Mandatory=$false)]
    [switch]$Minor,

    [Parameter(Mandatory=$false)]
    [switch]$Patch,

    [Parameter(Mandatory=$false)]
    [switch]$CommitChanges
)

$projectRoot = "D:\work\rockymountainweddings"
$packageJsonPath = "$projectRoot\package.json"
$versionHistoryPath = "$projectRoot\version_history.txt"
$updateLogPath = "$projectRoot\update-log.txt"
$currentDate = Get-Date -Format "yyyy-MM-dd"

# Function to read and parse package.json
function Get-PackageVersion {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    return $packageJson.version
}

# Function to update version in package.json
function Update-PackageVersion {
    param (
        [string]$NewVersion
    )
    
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    $packageJson.version = $NewVersion
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
    
    Write-Host "Updated package.json version to $NewVersion" -ForegroundColor Green
}

# Function to calculate next version
function Get-NextVersion {
    param (
        [string]$CurrentVersion,
        [bool]$IsMajor,
        [bool]$IsMinor,
        [bool]$IsPatch
    )
    
    $versionParts = $CurrentVersion -split '\.'
    $major = [int]$versionParts[0]
    $minor = [int]$versionParts[1]
    $patch = [int]$versionParts[2]
    
    if ($IsMajor) {
        $major++
        $minor = 0
        $patch = 0
    }
    elseif ($IsMinor) {
        $minor++
        $patch = 0
    }
    elseif ($IsPatch) {
        $patch++
    }
    else {
        # Default to patch update if no flag is specified
        $patch++
    }
    
    return "$major.$minor.$patch"
}

# Function to update version history
function Update-VersionHistory {
    param (
        [string]$Version,
        [string]$Description
    )
    
    $historyContent = Get-Content $versionHistoryPath -Raw
    $newEntry = "`n## Version $Version - $currentDate`n- $Description`n"
    
    # Insert the new entry after the first section (title)
    $updatedContent = $historyContent -replace "(?<=# Rocky Mountain Weddings & Events - Version History\r?\n\r?\n)", $newEntry
    $updatedContent | Set-Content $versionHistoryPath
    
    Write-Host "Updated version history for version $Version" -ForegroundColor Green
}

# Function to update the update log
function Update-Log {
    param (
        [string]$Version,
        [string]$Description
    )
    
    $logEntry = "[master] Version $Version - $Description`n"
    $updateLog = Get-Content $updateLogPath -Raw
    $updatedLog = $logEntry + $updateLog
    $updatedLog | Set-Content $updateLogPath
    
    Write-Host "Updated update-log.txt for version $Version" -ForegroundColor Green
}

# Function to commit changes to Git
function Commit-Changes {
    param (
        [string]$Version,
        [string]$Description
    )
    
    Set-Location $projectRoot
    git add package.json $versionHistoryPath $updateLogPath
    git commit -m "Version $Version: $Description"
    git tag -a "v$Version" -m "Version $Version"
    
    Write-Host "Committed changes to Git with tag v$Version" -ForegroundColor Green
}

# Main script execution

# Get current version and determine new version
$currentVersion = Get-PackageVersion

if ([string]::IsNullOrEmpty($Version)) {
    $newVersion = Get-NextVersion -CurrentVersion $currentVersion -IsMajor $Major -IsMinor $Minor -IsPatch $Patch
} else {
    $newVersion = $Version
}

# Confirm the update
Write-Host "Current version: $currentVersion" -ForegroundColor Cyan
Write-Host "New version: $newVersion" -ForegroundColor Cyan
Write-Host "Description: $Description" -ForegroundColor Cyan
$confirmation = Read-Host "Do you want to proceed with this update? (Y/N)"

if ($confirmation -ne "Y" -and $confirmation -ne "y") {
    Write-Host "Update cancelled." -ForegroundColor Red
    exit
}

# Perform all updates
Update-PackageVersion -NewVersion $newVersion
Update-VersionHistory -Version $newVersion -Description $Description
Update-Log -Version $newVersion -Description $Description

# Commit changes if requested
if ($CommitChanges) {
    Commit-Changes -Version $newVersion -Description $Description
}

Write-Host "`nVersion update completed successfully!" -ForegroundColor Green
Write-Host "Version $currentVersion → $newVersion" -ForegroundColor Green 