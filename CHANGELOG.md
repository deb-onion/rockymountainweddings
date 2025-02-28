# Rocky Mountain Weddings - Changelog

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

## Version 1.0.0 - Initial Launch

- First public release of the Rocky Mountain Weddings website
- Basic venue listings and information
- Initial map implementation 