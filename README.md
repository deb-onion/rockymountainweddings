# Rocky Mountain Weddings Website
![Version](https://img.shields.io/badge/version-2.0.4-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## What This Project Is
This is a dynamic wedding service website with automated media management. The site showcases Rocky Mountain Weddings services while featuring a built-in system that automatically tracks and updates media assets.

## Table of Contents
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Development Commands](#development-commands)
- [Automated Version Management](#automated-version-management)
- [How It Works](#how-it-works)
- [Working with AI Assistants](#working-with-ai-assistants)
- [Windows Terminal Integration](#windows-terminal-integration)
- [Deployment](#deployment)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Media Management**: Custom file watching system using Chokidar
- **Development Tools**: Concurrently for running multiple processes
- **Version Control**: Automated versioning with semantic versioning

## Project Structure
- `src/`: Source files
  - `assets/`: Media and backend files
    - `images/`: Website images (automatically tracked)
    - `videos/`: Website videos (automatically tracked) 
    - `log-api.js`: Main API entry point for media tracking
    - `media-updates.log`: Automatically generated log of all media changes
  - `scripts/`: Frontend JavaScript 
  - `styles/`: CSS stylesheets
  - HTML pages (index.html, about.html, venues.html, blog.html, contact.html)
- `scripts/`: Helper PowerShell scripts for development
  - `log-media-changes.ps1`: Automatic media change logger
  - Other helper scripts
- `update-version.ps1`: Script for updating version numbers and logs
- `update-site.ps1`: Main deployment script for pushing updates
- `version_history.txt`: Automatically updated version history
- `CHANGELOG.md`: Master changelog with comprehensive version history
- Other configuration files (package.json, etc.)

## Key Features
- **Dynamic Media Management**: Automatically detects when images or videos are added or modified
- **Logging API**: Tracks website activity and media changes
- **Responsive Design**: Works on mobile and desktop devices
- **SEO Optimized**: Structured for optimal search engine visibility
- **Performance Focused**: Optimized loading times and resource usage
- **Automated Versioning**: Full version control with semantic versioning (Major.Minor.Patch)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Windows with PowerShell 5.0+
- Visual Studio Code (recommended)

### Installation
1. Clone the repository (if applicable) or navigate to the project folder:
   ```
   cd D:\work\rockymountainweddings
   ```

2. Install dependencies:
   ```
   .\scripts\run-command.ps1 "npm install"
   ```

3. Set up your development environment:
   ```
   .\scripts\run-command.ps1 "npm run dev"
   ```

4. Open in your browser:
   ```
   http://localhost:3000
   ```

## Development Commands

### Standard NPM Commands
```
npm start         # Start the API server
npm run watch     # Watch for media file changes
npm run dev       # Run both server and file watcher
npm run update-version   # Run the version update script (requires -Description parameter)
npm run update-patch     # Increment patch version (e.g., 2.0.0 → 2.0.1)
npm run update-minor     # Increment minor version (e.g., 2.0.0 → 2.1.0)
npm run update-major     # Increment major version (e.g., 2.0.0 → 3.0.0)
```

### Helper Scripts
We've created PowerShell scripts to make development easier, especially when working with AI assistants:

#### Open Windows Terminal in Project
```
.\scripts\open-terminal.ps1
```

#### Run Project
```
.\scripts\start-project.ps1  # Same as npm start
```

#### Watch Media Files
```
.\scripts\watch-media.ps1  # Same as npm run watch
```

#### Execute Commands Safely
```
.\scripts\run-command.ps1 "command here"
```
This executes commands in the proper project context, reducing errors.

#### Quick File Access
```
.\scripts\open-file.ps1 [file-type]
```
Opens commonly accessed files:
- `index`, `about`, `blog`, `contact`: HTML pages
- `package`: package.json
- `style`: Main stylesheet
- `script`: Main JavaScript file

## Automated Version Management

The project includes a comprehensive version management system that works with an automated media tracking system. Here's how everything fits together:

### How Our Version System Works

We have two separate but integrated systems:

1. **Automated Media Tracking** - Continuously runs in the background:
   - Automatically watches for any changes to images and videos
   - When media files are added/modified, immediately logs them to `media-updates.log`
   - Runs independently through the file watcher (`npm run watch`)

2. **Version Management and Deployment** - Run manually when deploying updates:
   - Updates version numbers and documentation
   - Commits and deploys all changes, including any media changes that were tracked

### Version Files

The project maintains three log files, each with a specific purpose:

1. **CHANGELOG.md** - The master changelog that provides comprehensive documentation of all changes, including:
   - Feature additions and improvements
   - Bug fixes and optimizations 
   - Deployment and configuration changes
   - Significant media updates and asset changes (high-level summary only)
   
2. **version_history.txt** - A simplified version history with basic entries for each update.

3. **media-updates.log** - Automatically tracks detailed media asset changes (images, videos, etc.), including:
   - Individual file additions and modifications (automatically generated)
   - Timestamp and size information
   - Technical metadata

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/) principles:

- **Major version** (X.0.0): Breaking changes, significant redesigns, major feature overhauls
- **Minor version** (X.Y.0): New features without breaking existing functionality
- **Patch version** (X.Y.Z): Bug fixes, small updates, content changes

### One-Step Site Update

To update and deploy the site with all changes (including media):

```
.\update-site.ps1 -Description "What you changed" -VersionType "[major|minor|patch|auto]"
```

This single command will:
1. Update version numbers in relevant files
2. Add your description to CHANGELOG.md and version_history.txt
3. Commit ALL tracked changes including:
   - Code changes you've made
   - Documentation updates
   - Any media changes that have been automatically logged
4. Push to GitHub and trigger deployment

**Examples:**
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

### Automatic Version Detection

The auto-detection determines version type based on keywords in your description:

- **Major**: Contains "BREAKING CHANGE", "MAJOR", "redesign", "complete overhaul"
- **Minor**: Contains "feat", "feature", "add", "new", "enhance"
- **Patch**: Any other description (default for fixes, updates, etc.)

### Development vs Deployment Commands

We have two sets of commands for different purposes:

#### 1. Development Commands (for local work)
```
npm start         # Start the API server
npm run watch     # Watch for media file changes (runs automatically in background)
npm run dev       # Run both server and file watcher together
```

#### 2. Deployment Command (for publishing changes)
```
.\update-site.ps1 -Description "Your change description" -VersionType "auto"
```

The npm commands in package.json that reference `update-version.ps1` are legacy commands that have been replaced by the more comprehensive `update-site.ps1` script. For all site updates, use `update-site.ps1`.

### What Gets Updated

When media files change:
- Changes are **automatically** logged to `media-updates.log` by the file watcher

When you run update-site.ps1:
1. **CHANGELOG.md** gets a detailed new entry with the current date and version
2. **version_history.txt** gets a simplified entry with the current date and version
3. ALL changes (code, media, etc.) are committed to git with a versioned message
4. The site is automatically deployed

### Log File Locations
- **CHANGELOG.md**: Project root - Master changelog with comprehensive version history
- **version_history.txt**: Project root - Simplified version history with basic entries
- **media-updates.log**: `src/assets/` - Detailed tracking of individual media file changes

## How It Works

### Media Management System
1. The file watcher monitors the `/src/assets/images` and `/src/assets/videos` directories
2. When files are added or changed, `log-media-changes.ps1` is triggered
3. The script logs all changes and updates references
4. Changes are recorded in the media log file

#### Example: Adding a New Image
When you add a new image `wedding-venue.jpg` to `src/assets/images/venues/`:
```javascript
// The system automatically:
// 1. Detects the new file
// 2. Logs the addition with timestamp and file size
// 3. Makes it available via: /assets/images/venues/wedding-venue.jpg
// 4. Records the change in media-updates.log
```

### Development Workflow
1. Run `npm run dev` to start both the server and file watcher
2. Edit files in the `src` directory
3. Media changes are processed automatically
4. View the site through the local server
5. When ready to update the version, run the appropriate update command

## Working with AI Assistants
When working with AI tools:

1. **Share specific code snippets** rather than describing issues
2. Use the helper scripts to run commands: `.\scripts\run-command.ps1 "npm command"`
3. For complex operations, explain what you're trying to accomplish with the media system
4. When updating HTML files, ensure you maintain correct paths to CSS (`styles/`) and JavaScript (`scripts/`) files

### Example AI Interaction
```
User: "I need to add a new section to the homepage that shows upcoming wedding events"

AI: "I'll help you add that section. First, let's open the index.html file:
     .\scripts\open-file.ps1 index
     
     Then, add this code to create the events section... [code snippet]
     
     Finally, to update any dependencies:
     .\scripts\run-command.ps1 "npm install moment --save"
```

## Windows Terminal Integration
VS Code is configured to use Windows Terminal for a better development experience:
- Better terminal rendering
- Multiple tabs and panes
- Command history and search
- Customizable appearance

### Terminal Shortcuts
- **Open New Terminal**: Ctrl+Shift+`
- **Split Terminal**: Ctrl+Shift+5
- **Navigate Between Terminals**: Alt+Arrow Keys

## Deployment
The website is deployed using a simple and effective process:

1. **Build Process**:
   ```
   .\scripts\run-command.ps1 "npm run build"
   ```
   This creates optimized assets in the `dist` folder.

2. **Deployment Options**:
   - Manual FTP upload to hosting provider
   - Automated deployment via webhook (if set up)
   - Direct server copy for local hosting

3. **Production URL**: 
   - Development: http://localhost:3000
   - Production: https://rockymountainweddings.com (example)

## Browser Compatibility
The website is optimized for:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)

## Troubleshooting
- **Media not updating?** Check the console for errors in the file watcher
- **API not responding?** Verify the server is running with `npm start`
- **Dependency issues?** Run `.\scripts\run-command.ps1 "npm install"`
- **Port conflicts?** Check if port 3000 is already in use and modify in config
- **Version update fails?** Make sure you provide a -Description parameter

### Common Error Messages
- `Error: ENOENT: no such file or directory`: Check file paths and ensure they exist
- `Error: listen EADDRINUSE`: Another service is using the required port
- `SyntaxError: Unexpected token`: JavaScript syntax error in your code
- `ParameterBindingException`: Missing required parameter in version update command

Always run commands from the project root: `D:\work\rockymountainweddings`

## Version History
- **2.0.0**: Current version with dynamic media management
- **1.5.0**: Added responsive design and blog section
- **1.0.0**: Initial website launch

## License
This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

© 2025 Rocky Mountain Weddings. All rights reserved. 