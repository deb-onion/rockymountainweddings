# Rocky Mountain Weddings - Version Management

This document explains how version management works for the Rocky Mountain Weddings website.

## Version Files

The project maintains multiple version-related files, each with a specific purpose:

1. **CHANGELOG.md** - The master changelog that provides comprehensive documentation of all changes, organized by version.
2. **version_history.txt** - A simplified version history with basic entries for each update.
3. **media-updates.log** - Automatically tracks media asset changes (images, videos, etc.).

## Semantic Versioning

We follow [Semantic Versioning](https://semver.org/) principles:

- **Major version** (X.0.0): Breaking changes, significant redesigns, major feature overhauls
- **Minor version** (X.Y.0): New features without breaking existing functionality
- **Patch version** (X.Y.Z): Bug fixes, small updates, content changes

## How to Update the Site

To update the site with proper version tracking, use the `update-site.ps1` script:

```powershell
.\update-site.ps1 -Description "Your change description" -VersionType "[major|minor|patch|auto]"
```

### Parameters:

- **Description** (Required): A clear description of what changed
- **VersionType** (Optional): The type of version update
  - `major`: For significant changes (e.g., complete redesigns)
  - `minor`: For new features
  - `patch`: For bug fixes and small updates
  - `auto` (Default): Automatically detects version type based on commit message

### Examples:

```powershell
# Major update (3.0.0)
.\update-site.ps1 -Description "Complete website redesign with new color scheme" -VersionType "major"

# Minor update (2.1.0)
.\update-site.ps1 -Description "Added new venue filtering feature" -VersionType "minor"

# Patch update (2.0.1)
.\update-site.ps1 -Description "Fixed broken links in footer" -VersionType "patch"

# Auto-detect version type
.\update-site.ps1 -Description "Fixed Mapbox token issue"
```

## Automatic Version Detection

The auto-detection determines version type based on keywords in your description:

- **Major**: Contains "BREAKING CHANGE", "MAJOR", "redesign", "complete overhaul"
- **Minor**: Contains "feat", "feature", "add", "new", "enhance"
- **Patch**: Any other description (default for fixes, updates, etc.)

## Under the Hood

The system uses:
1. `update-version.ps1` - Script that updates both changelog files with proper versioning
2. `update-site.ps1` - Script that calls the version updater, commits changes, and deploys the site

This ensures consistent documentation across all version-tracking files. 