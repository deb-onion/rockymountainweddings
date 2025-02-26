# Rocky Mountain Weddings - Build Script
# This script prepares files for deployment

Write-Host "Starting build process..."

# If you need to process files before deployment, you can add those steps here
# For example:
# - Minify CSS and JS files
# - Optimize images
# - Generate sitemap
# - etc.

# For now, we'll keep it simple since your static site doesn't need processing
Write-Host "Build completed successfully! Your site is ready for deployment."

# Usage with your update script:
# 1. Run this build script
# 2. Then run the update-site.ps1 script to commit and push changes
# Example: 
# .\build.ps1
# .\update-site.ps1 -Description "Your update description" 