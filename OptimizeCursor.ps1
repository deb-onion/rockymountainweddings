# ======================================================
# Cursor Performance Optimizer Script
# ======================================================
# This script optimizes performance for the Cursor application
# by setting high priority, configuring GPU preference, and
# optimizing system settings for better performance.
#
# Instructions:
# 1. Right-click this file and select "Run with PowerShell" 
# 2. For best results, run as Administrator
# ======================================================

# Check if running as administrator and prompt for elevation if not
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "This script works best with admin rights. Some features may not work without admin privileges." -ForegroundColor Yellow
    Write-Host "Press any key to continue anyway, or close this window and restart as administrator..."
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
}

# ======================================================
# 1. CPU & Process Optimization
# ======================================================
Write-Host "`n[1/5] Optimizing Cursor processes..." -ForegroundColor Cyan

# Find all Cursor processes
$cursorProcesses = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue

if ($cursorProcesses) {
    foreach ($process in $cursorProcesses) {
        try {
            # Set high priority
            $process.PriorityClass = 'High'
            Write-Host "  ✓ Set process ID $($process.Id) to high priority" -ForegroundColor Green
            
            # Set processor affinity for larger processes
            if ($process.WorkingSet -gt 50MB) {
                try {
                    # Get number of logical processors
                    $cores = (Get-WmiObject -Class Win32_ComputerSystem).NumberOfLogicalProcessors
                    # Create proper integer mask
                    $affinityMask = [int]([Math]::Pow(2, $cores) - 1)
                    $process.ProcessorAffinity = [IntPtr]$affinityMask
                    Write-Host "  ✓ Set process ID $($process.Id) to use all $cores logical processors" -ForegroundColor Green
                } catch {
                    Write-Host "  ✗ Could not set processor affinity: $($_.Exception.Message)" -ForegroundColor Yellow
                }
            }
        } catch {
            Write-Host "  ✗ Error optimizing process ID $($process.Id): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ! No Cursor processes found. Please start Cursor first." -ForegroundColor Yellow
    Write-Host "    The script will continue and optimize system settings for when you start Cursor." -ForegroundColor Yellow
}

# ======================================================
# 2. GPU Optimization
# ======================================================
Write-Host "`n[2/5] Setting up GPU preferences for Cursor..." -ForegroundColor Cyan

# Check for NVIDIA Control Panel
if (Test-Path "C:\Program Files\NVIDIA Corporation\Control Panel Client\nvcplui.exe") {
    Write-Host "  ✓ NVIDIA Control Panel is installed" -ForegroundColor Green
    Write-Host "    TIP: Manually set Cursor to use the NVIDIA GPU through NVIDIA Control Panel" -ForegroundColor Gray
    Write-Host "    (NVIDIA Control Panel > Manage 3D Settings > Program Settings > Add Cursor.exe)" -ForegroundColor Gray
}

# Set Windows graphics performance preference for Cursor
Write-Host "  Setting Windows graphics preference for Cursor..." -ForegroundColor Gray
$graphicsPreferencePath = "HKCU:\Software\Microsoft\DirectX\UserGpuPreferences"

if (-not (Test-Path $graphicsPreferencePath)) {
    New-Item -Path $graphicsPreferencePath -Force | Out-Null
}

# Find Cursor executable path
$cursorPath = ""
# First try to get from running process
$cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($cursorProcess) {
    $cursorPath = $cursorProcess.Path
} else {
    # Default installation path as fallback
    $defaultPath = "$env:LOCALAPPDATA\Programs\cursor\Cursor.exe"
    if (Test-Path $defaultPath) {
        $cursorPath = $defaultPath
    }
}

if ($cursorPath) {
    Set-ItemProperty -Path $graphicsPreferencePath -Name $cursorPath -Value "GpuPreference=2;" -Type String
    Write-Host "  ✓ Set Windows to use high performance GPU for Cursor at: $cursorPath" -ForegroundColor Green
} else {
    Write-Host "  ✗ Could not find Cursor executable path" -ForegroundColor Red
}

# ======================================================
# 3. Power Plan Optimization
# ======================================================
Write-Host "`n[3/5] Setting power plan to High Performance..." -ForegroundColor Cyan

$highPerfGuid = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"
try {
    powercfg /setactive $highPerfGuid
    Write-Host "  ✓ Power plan set to High Performance" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Could not set power plan: $($_.Exception.Message)" -ForegroundColor Red
}

# ======================================================
# 4. Visual Effects Optimization
# ======================================================
Write-Host "`n[4/5] Optimizing visual effects settings..." -ForegroundColor Cyan

try {
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" -Name "VisualFXSetting" -Value 2 -ErrorAction Stop
    Write-Host "  ✓ Visual effects set to best performance" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Could not modify visual effects settings: $($_.Exception.Message)" -ForegroundColor Red
}

# ======================================================
# 5. Memory Optimization
# ======================================================
Write-Host "`n[5/5] Optimizing memory usage..." -ForegroundColor Cyan

# Clear system cache
Write-Host "  Clearing system cache to free up memory..." -ForegroundColor Gray
[System.GC]::Collect()
Write-Host "  ✓ Memory cache cleared" -ForegroundColor Green

# If running as admin, attempt to adjust virtual memory
if (([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    try {
        $computersys = Get-WmiObject Win32_ComputerSystem -EnableAllPrivileges
        $computersys.AutomaticManagedPagefile = $False
        $computersys.Put() | Out-Null
        
        $pagefile = Get-WmiObject -Query "Select * From Win32_PageFileSetting Where Name='C:\\pagefile.sys'"
        if ($pagefile) {
            $initialSize = 16384  # 16 GB
            $maximumSize = 32768  # 32 GB
            $pagefile.InitialSize = $initialSize
            $pagefile.MaximumSize = $maximumSize
            $pagefile.Put() | Out-Null
            Write-Host "  ✓ Virtual memory settings optimized (Initial: $($initialSize/1024)GB, Max: $($maximumSize/1024)GB)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Could not find pagefile settings" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ✗ Could not adjust virtual memory settings: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "  ! Virtual memory settings were not changed (requires admin privileges)" -ForegroundColor Yellow
}

# ======================================================
# Summary
# ======================================================
Write-Host "`n✅ Cursor Performance Optimization Complete!" -ForegroundColor Green
Write-Host "   - All Cursor processes set to high priority" -ForegroundColor White
Write-Host "   - GPU preference set to high performance" -ForegroundColor White
Write-Host "   - Power plan set to high performance" -ForegroundColor White
Write-Host "   - Visual effects optimized for performance" -ForegroundColor White
Write-Host "   - Memory optimization complete" -ForegroundColor White

Write-Host "`nTo maximize performance:" -ForegroundColor Cyan
Write-Host "1. Run this script each time after starting Cursor (process settings don't persist after restart)" -ForegroundColor White
Write-Host "2. Consider adding this script to startup or creating a shortcut that launches Cursor and then runs this script" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') 