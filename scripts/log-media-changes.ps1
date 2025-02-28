# Rocky Mountain Weddings - Media Change Logging Script
# This script works with the media update system to log all changes

param (
    [Parameter(Mandatory=$true)]
    [string]$MediaPath,
    
    [Parameter(Mandatory=$false)]
    [string]$ChangeType = "Updated"
)

$projectRoot = "D:\work\rockymountainweddings"
$logFile = "$projectRoot\src\assets\media-updates.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$relativePath = $MediaPath -replace [regex]::Escape($projectRoot), ""

# Ensure log directory exists
$logDir = Split-Path $logFile -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Determine change type if not provided
if ($ChangeType -eq "Updated") {
    $fileExists = Test-Path $MediaPath
    if ($fileExists) {
        $fileInfo = Get-Item $MediaPath
        if ($fileInfo.CreationTime -eq $fileInfo.LastWriteTime) {
            $ChangeType = "Added"
        } else {
            $ChangeType = "Modified"
        }
    } else {
        $ChangeType = "Deleted"
    }
}

# Log the media change
$logEntry = "[$timestamp] $ChangeType" + ": " + "$relativePath"
Add-Content -Path $logFile -Value $logEntry

# If this is an image, log additional information
if ($MediaPath -match "\.(jpg|jpeg|png|gif|webp)$" -and (Test-Path $MediaPath)) {
    $fileSize = (Get-Item $MediaPath).Length
    $fileSizeKB = [math]::Round($fileSize / 1KB, 2)
    
    try {
        # Add image-specific info
        $imageInfo = "    - Size: " + $fileSizeKB + " KB"
        Add-Content -Path $logFile -Value $imageInfo
    } catch {
        # Just log basic info if we can't get image dimensions
        Add-Content -Path $logFile -Value ("    - Error getting image details: " + $_.Exception.Message)
    }
}

# If this is a video, log video-specific information
if ($MediaPath -match "\.(mp4|webm|mov|avi)$" -and (Test-Path $MediaPath)) {
    $fileSize = (Get-Item $MediaPath).Length
    $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
    
    # Add video-specific info
    $videoInfo = "    - Size: " + $fileSizeMB + " MB"
    Add-Content -Path $logFile -Value $videoInfo
}

# Write to console as well
Write-Host ("Media " + $ChangeType + ": " + $relativePath) -ForegroundColor Cyan

# Return success
return $true 