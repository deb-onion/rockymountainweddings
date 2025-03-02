# Rocky Mountain Weddings - Project Structure and Workflow

## Project Overview

Rocky Mountain Weddings is a website for wedding services featuring dynamic content management, virtual tour capabilities, and automated media management. The site showcases wedding venues throughout the Rocky Mountains while providing users with immersive virtual tour experiences and media-rich content.

## Repository Structure

```
rockymountainweddings/
├── src/                           # Source files for the website
│   ├── assets/                    # Media assets
│   │   ├── images/                # Website images (tracked automatically)
│   │   │   ├── about/             # About page images
│   │   │   ├── case-studies/      # Case studies images
│   │   │   ├── homepage-featured/ # Featured content images
│   │   │   ├── homepage-hero/     # Hero banner images
│   │   │   ├── icons/             # UI and functional icons
│   │   │   ├── portfolio/         # Portfolio showcase images
│   │   │   ├── services-intro/    # Service introduction images
│   │   │   ├── team/              # Team member photos
│   │   │   ├── testimonials/      # Customer testimonial images
│   │   │   ├── venues-intro/      # Venue introduction images
│   │   │   ├── venues-regions/    # Regional venue images
│   │   │   └── virtual-tours/     # Virtual tour panoramas
│   │   └── videos/                # Website videos
│   ├── scripts/                   # Frontend JavaScript files
│   │   ├── about.js               # About page functionality
│   │   ├── main.js                # Main site functionality
│   │   ├── media-manager.js       # Dynamic media handling
│   │   ├── portfolio.js           # Portfolio page functionality
│   │   ├── services.js            # Services page functionality
│   │   └── venues.js              # Venues page with virtual tour functionality
│   ├── styles/                    # CSS stylesheets
│   │   ├── about.css              # About page styles
│   │   ├── blog.css               # Blog page styles
│   │   ├── contact.css            # Contact page styles
│   │   ├── main.css               # Main site styles
│   │   ├── portfolio.css          # Portfolio page styles
│   │   ├── services.css           # Services page styles
│   │   └── venues.css             # Venues page styles
│   ├── about.html                 # About page
│   ├── blog.html                  # Blog page
│   ├── contact.html               # Contact page
│   ├── index.html                 # Homepage
│   ├── portfolio.html             # Portfolio page
│   ├── services.html              # Services page
│   └── venues.html                # Wedding venues listing page
├── scripts/                       # Helper scripts for development
│   ├── log-media-changes.ps1      # Tracks changes to media files
│   ├── open-file.ps1              # Helper for opening project files
│   ├── open-terminal.ps1          # Opens terminal in project directory
│   ├── run-command.ps1            # Helper for running shell commands
│   ├── start-project.ps1          # Project initialization script
│   ├── update-version.ps1         # Version handling script
│   └── watch-media.ps1            # Media watch service script
├── .vscode/                       # VS Code configuration
├── update-site.ps1                # Deployment script
├── update-version.ps1             # Version management script
├── watch-media.bat                # Batch file for media watching
├── dev-server.bat                 # Local development server
├── CHANGELOG.md                   # Detailed change history
├── version_history.txt            # Automatically updated version log
├── deployment-instructions.txt    # Guide for deploying changes
├── pages.json                     # Cloudflare Pages configuration
├── cloudflare.toml                # Cloudflare configuration
├── package.json                   # Node.js dependencies
├── package-lock.json              # Locked Node.js dependencies

```

## Key Components

### Frontend

- **HTML Pages**: Static pages providing the structure for the website
- **CSS Styles**: Responsive design with mobile-specific optimizations
- **JavaScript**: Dynamic functionality including:
  - Virtual tour implementation
  - Google Maps integration
  - Image galleries
  - Mobile-specific optimizations

### Infrastructure

- **Version Control**: Git and GitHub for source code management
- **Hosting**: Cloudflare Pages for static site hosting
- **CI/CD**: Automatic deployments triggered by GitHub pushes

## Development Workflow

### 1. Local Development

1. Make changes to files in the `src/` directory
2. Test locally using the development server:
   ```
   .\dev-server.bat
   ```
3. For media updates, use the media watching script:
   ```
   .\watch-media.bat
   ```

### 2. Version Management

The project uses semantic versioning (MAJOR.MINOR.PATCH):

- **Major**: Breaking changes (e.g., v2.0.0)
- **Minor**: New features, backward compatible (e.g., v2.1.0)
- **Patch**: Bug fixes, backward compatible (e.g., v2.1.1)

Version updates are handled automatically by the `update-version.ps1` script.

### 3. Deployment Process

To deploy changes to the live site:

1. Run the update script with a description of changes:
   ```powershell
   .\update-site.ps1 -Description "Description of changes" -VersionType "patch"
   ```

2. The script will:
   - Update version numbers
   - Commit changes to Git
   - Push to GitHub
   - Trigger automatic deployment on Cloudflare Pages

3. Monitor deployment on Cloudflare Pages dashboard

### 4. Rollback Process

If issues occur with a deployment:

1. Identify the last working version in Git history
2. Check out that version:
   ```powershell
   git checkout [commit-hash]
   ```
3. Create a rollback branch:
   ```powershell
   git branch rollback-v[version] [commit-hash]
   git checkout rollback-v[version]
   git push origin rollback-v[version]
   ```
4. Set the rollback branch as the production branch in Cloudflare Pages
5. Update master to match the rollback (recommended):
   ```powershell
   git checkout master
   git reset --hard rollback-v[version]
   git push --force origin master
   ```
6. Reset Cloudflare production branch back to master

## Critical Features

### Virtual Tour And Maps Functionality

The virtual tour functionality is implemented in:
- `src/venues.html`: HTML structure
- `src/scripts/venues.js`: JavaScript implementation
- Uses Google Maps API and custom panorama viewers

### Mobile Display Optimization

Mobile-specific display handled through:
- Responsive CSS in `src/styles/wedding-venue.css`
- Mobile-specific wrappers and z-index management 
- Viewport-specific JavaScript adjustments

## Technical Issues and Rollback Details

### Version 2.9.x Display and Functionality Issues

The site experienced multiple critical issues after deployment of versions beyond 2.7.0, including:

#### 1. Virtual Tour Functionality Failure
- **Symptoms**: The virtual tour buttons were no longer clickable in versions 2.8.0-2.9.1
- **Technical Cause**: 
  - CSS z-index conflicts between the tour modal and other page elements
  - Event listener propagation issues in the tour initialization code
  - Modification of DOM structure that broke event binding paths to tour buttons

#### 2. Mobile Display Problems
- **Symptoms**: White screen areas and blue rectangles appearing on mobile devices
- **Technical Cause**:
  - Insufficient CSS specificity for mobile viewport rules
  - `@media` query conflicts causing style overrides
  - Improper stacking context in the DOM affecting z-index hierarchy

#### 3. Performance Degradation
- **Symptoms**: Significant lag on desktop when scrolling through venue sections
- **Technical Cause**:
  - Non-optimized image loading causing render-blocking operations
  - Layout thrashing due to frequent DOM repaints and reflows
  - Inefficient event handling creating excessive JavaScript operations on scroll

#### 4. Map Visibility in Incognito Mode
- **Symptoms**: Google Maps failed to load or displayed incorrectly in incognito browsing
- **Technical Cause**:
  - Authentication failures when Google Maps API cookies weren't available
  - Ineffective error handling for API authentication failures
  - Missing fallback display options when maps could not initialize

### Venues Page Technical Details

The venues page contains complex interconnected functionality that requires careful maintenance:

#### 1. Critical DOM Structure
```html
<!-- Key structure for venue card clickability -->
<div class="venue-card">
  <div class="venue-details">
    <!-- Content here -->
  </div>
  <div class="venue-actions">
    <button class="tour-button">Virtual Tour</button>
    <!-- Other buttons -->
  </div>
</div>
```

#### 2. JavaScript Event Management
The venues.js file manages event delegation through a complex hierarchy:
- Parent containers capture events and delegate to child elements
- Tour buttons require specific event paths to be maintained
- Modal initialization depends on proper event propagation

#### 3. CSS Stacking Context
Critical CSS rules affecting virtual tour visibility:
```css
/* These z-index values must be maintained properly */
.venue-card { z-index: 10; }
.tour-modal { z-index: 1000; }
.map-container { z-index: 10; }
.modal-overlay { z-index: 999; }
```

#### 4. Google Maps Integration
The map integration has several dependencies:
- API key authentication flow
- DOM elements with specific IDs for map containers
- Error handlers that must properly catch authentication failures
- Initialization sequence that can't be interrupted

### Rollback Process Executed

Due to the severity of the issues, a rollback to version 2.7.0 (commit fc1bc2e) was performed:

1. Previous failed remediation attempts:
   - Attempted rollbacks to versions 2.9.0, 2.8.0, and 2.7.1 still exhibited issues
   - CSS and JavaScript modifications could not resolve the problems within newer versions

2. Successful rollback procedure:
   ```powershell
   # Identified the last known working version
   git checkout fc1bc2e  # Version 2.7.0
   
   # Created a rollback branch
   git branch rollback-v2-7-0 fc1bc2e
   git checkout rollback-v2-7-0
   git push origin rollback-v2-7-0
   
   # Set as production in Cloudflare
   # Changed back to master as primary branch
   git checkout master
   git reset --hard rollback-v2-7-0
   git push --force origin master
   ```

3. Root cause conclusion:
   The version 2.7.0 contains the correct balance of:
   - Properly structured event delegation for virtual tour functionality
   - Working Google Maps initialization with proper error handling

## Best Practices

1. **Incremental Changes**: Make small, targeted modifications that can be easily rolled back
2. **Test Thoroughly**: Always test changes in preview environments before production
3. **Document Working States**: Track stable versions for potential rollbacks
4. **Branch Management**: Use feature branches for development, keep master stable
5. **Clear Commit Messages**: Include details about what was changed and why 