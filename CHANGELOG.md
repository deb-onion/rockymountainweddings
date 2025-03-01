# Rocky Mountain Weddings - Changelog

## Version 2.1.0 - 2025-03-01

### Changes
- Updated venue listings with correct order and locations for all regions. Replaced Mapbox with Google Maps API for better map functionality.


## Version 2.0.5 - 2025-03-01

### Changes
- Fixed update logic


## Version 2.0.4 - 2025-03-01

### Map Improvements
- Fixed Mapbox display issues by updating container dimensions and library version
- Updated Mapbox access token with proper public token
- Fixed venue map container ID
- Updated wedding venue markers with correct listings and locations

### Media Updates
- Optimized map-related images for faster loading
- Updated venue marker thumbnails for better visual consistency

## Version 2.0.3 - 2025-02-28

### Venues Page Enhancements
- Enhanced venues page with improved CSS
- Added interactive map markers
- Improved SEO with structured data
- Enhanced interactive map with venue markers
- Improved accessibility

### Media Updates
- Added 8 new venue images with optimized thumbnails
- Updated 2 video previews for venue tours

## Version 2.0.2 - 2025-02-28

### Content Updates
- Updated Venues section
- Synchronized navigation across all pages
- Updated Homepage with test images
- Fixed Instagram links across the website

### Media Updates
- Added 5 new homepage test images
- Updated 1 video element
- Added 2 video preview elements

## Version 2.0.1 - 2025-02-27
- Updated service-intro.jpg image

### Media Updates
- Replaced service-intro.jpg with higher quality version
- Optimized image for web display

## Version 2.0.0 - Major Redesign - 2025-02-26

### Major Website Overhaul
- Complete website redesign with enhanced UI/UX and responsive layouts
- Added interactive map for venue exploration
- Implemented dynamic pricing calculator for services
- Created interactive timeline for company history
- Added team member video introductions
- Optimized for lead generation with strategic CTA placement
- Improved performance and accessibility

### Deployment Changes
- Migrated from Netlify to Cloudflare Pages
- Added Cloudflare configuration files (_headers, _redirects, _workers.js, pages.json)
- Fixed Cloudflare Pages deployment configuration
- Aligned Cloudflare configuration with actual project structure
- Updated config files to point to the 'src' directory
- Changed build output directory to root
- Updated both cloudflare.toml and pages.json configuration
- Added build script for future complex deployments

## Version 1.1.0 - June 10, 2024

### Venues Page Enhancements

#### Map Improvements
- **Enhanced Interactive 3D Map**:
  - Added custom venue markers with venue images
  - Implemented color-coded borders for different regions (Banff, Canmore, Lake Louise, etc.)
  - Added rich information popups with images, descriptions, capacity, and price range
  - Implemented smooth transitions between different regions
  - Added region-specific map styling (bearing, pitch, accent colors)

#### SEO Enhancements
- **Structured Data Improvements**:
  - Updated Schema.org JSON-LD data to include all venues
  - Added complete address information with proper geographical coordinates
  - Improved structured data for better search engine visibility
  - Added geographic coordinates for each venue

#### Mobile Experience
- **Mobile Optimizations**:
  - Responsive map adjustments for different screen sizes
  - Touch-friendly interactions for mobile users
  - Improved popup handling on touch devices

#### Accessibility
- **Accessibility Improvements**:
  - Added proper ARIA labels for map elements
  - Implemented keyboard navigation for the interactive map
  - Enhanced screen reader support

#### JavaScript Updates
- **Code Structure Improvements**:
  - Reorganized venue data with complete location information
  - Updated venues.js with proper coordinates and region data
  - Optimized filtering functionality for better performance

### General Updates
- Updated script paths in venues.html to use the proper js/ directory
- Created js directory for better organization of JavaScript files

## Version 1.0.0 - Initial Launch - 2025-02-26

- First public release of the Rocky Mountain Weddings website
- Basic venue listings and information
- Initial map implementation
- Basic pages: Home, Services, Venues, About, Portfolio
- Responsive design implementation 

