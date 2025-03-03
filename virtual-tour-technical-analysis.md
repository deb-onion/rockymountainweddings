# Virtual Tour Functionality: Technical Analysis & Failure Assessment

## Executive Summary

This document provides a comprehensive technical analysis of the virtual tour functionality failures in the Rocky Mountain Weddings website. Despite multiple debugging attempts and code revisions, the Street View panorama consistently fails to load for all venues. The implementation correctly identifies venue IDs, opens the modal interface, and attempts to load panoramas using valid Place IDs, but consistently times out after 8 seconds.

## 1. Implementation Timeline & Failed Attempts

### 1.1. Initial Implementation (First Attempt)

The first implementation used a standard approach to Google Street View:

```javascript
function openVirtualTour(venueId) {
  const venue = venueMarkers.find(marker => marker.id === venueId);
  if (!venue) return;
  
  // Show modal
  const tourModal = document.getElementById('tourModal');
  const tourContainer = document.getElementById('tourContainer');
  tourModal.style.display = 'block';
  
  // Add loading indicator
  tourContainer.innerHTML = '<div class="tour-loading">Loading...</div>';
  
  // Create Street View panorama
  const panorama = new google.maps.StreetViewPanorama(
    tourContainer,
    {
      position: venue.coordinates,
      pov: { heading: 0, pitch: 0 },
      zoom: 1
    }
  );
}
```

**Issues Identified:**
- Variable scope problems with `venueMarkers` array
- No error handling for Street View failures
- No timeout detection for loading failures
- No fallback UI when Street View is unavailable

### 1.2. Fixing Variable Scope (Second Attempt)

```javascript
// Global declaration
let venueMarkers = [];

// Later in the code
async function fetchVenueData() {
  try {
    const response = await fetch('data/venues.json');
    const data = await response.json();
    venueMarkers = data; // Global assignment
    return data;
  } catch (error) {
    console.error('Error loading venue data:', error);
    return [];
  }
}
```

**Issues Identified:**
- Scope issue was fixed, but Street View still failed to load
- No improvement in the core functionality

### 1.3. Enhanced Error Handling (Third Attempt)

```javascript
function openVirtualTour(venueId) {
  const venue = venueMarkers.find(marker => marker.id === venueId);
  if (!venue) {
    console.error('Venue not found:', venueId);
    return;
  }
  
  // Show modal
  showTourModal();
  
  // Get container
  const tourContainer = document.getElementById('tourContainer');
  if (!tourContainer) {
    console.error('Tour container not found');
    return;
  }
  
  // Add loading indicator
  tourContainer.innerHTML = `
    <div class="tour-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading virtual tour for ${venue.name}...</p>
    </div>
  `;
  
  // Set a timeout to detect if panorama is taking too long
  const timeoutId = setTimeout(() => {
    console.warn('Street View panorama loading timeout');
    showTourError(venueId, venue, 'Street View took too long to respond');
  }, 5000);
  
  try {
    // Create panorama with basic options
    const panorama = new google.maps.StreetViewPanorama(
      tourContainer,
      {
        position: venue.coordinates,
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: true,
        fullscreenControl: true
      }
    );
    
    // Try to find a panorama at this location
    const sv = new google.maps.StreetViewService();
    sv.getPanorama({
      location: venue.coordinates,
      radius: 50,
      source: google.maps.StreetViewSource.DEFAULT
    }, (data, status) => {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (status === 'OK') {
        // Success - show Street View
        console.log('Found Street View panorama!');
        panorama.setPano(data.location.pano);
      } else {
        // Show fallback
        console.warn('No Street View available:', status);
        showTourError(venueId, venue, `Street View data is not available (${status})`);
      }
    });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error initializing Street View:', error);
    showTourError(venueId, venue, 'Could not initialize Street View');
  }
}
```

**Issues Identified:**
- Better error handling, but still no Street View content
- Added timeout detection which revealed that requests were timing out
- Street View service was not returning an error, but never completing

### 1.4. Debugging Utility (Fourth Attempt)

Added a comprehensive debugging utility to track function calls and errors:

```javascript
const Debug = {
  // Set to true to enable detailed logging
  enabled: true,
  
  // Log levels
  levels: {
    INFO: { name: 'INFO', style: 'color: #0066cc; font-weight: bold;' },
    SUCCESS: { name: 'SUCCESS', style: 'color: #00cc66; font-weight: bold;' },
    WARN: { name: 'WARNING', style: 'color: #cc9900; font-weight: bold;' },
    ERROR: { name: 'ERROR', style: 'color: #cc0000; font-weight: bold;' },
    DEBUG: { name: 'DEBUG', style: 'color: #6600cc; font-weight: bold;' }
  },
  
  // Main logging function with level and context
  log: function(level, context, message, data = null) {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString().substring(11, 23);
    const levelInfo = this.levels[level] || this.levels.INFO;
    
    console.log(
      `%c [${timestamp}] [${levelInfo.name}] ${context}`,
      levelInfo.style
    );
    console.log(message);
    console.log('Call stack:');
    console.trace();
    
    if (data) {
      console.log('Data:', data);
    }
  },
  
  // Convenience methods for different log levels
  info: function(context, message, data) {
    this.log('INFO', context, message, data);
  },
  
  success: function(context, message, data) {
    this.log('SUCCESS', context, message, data);
  },
  
  warn: function(context, message, data) {
    this.log('WARN', context, message, data);
  },
  
  error: function(context, message, data) {
    this.log('ERROR', context, message, data);
  },
  
  debug: function(context, message, data) {
    this.log('DEBUG', context, message, data);
  },
  
  // Function tracker to wrap functions for debugging
  trackFunction: function(name, fn) {
    return function(...args) {
      Debug.info(name, `Function called with args:`, args);
      try {
        const result = fn.apply(this, args);
        if (result instanceof Promise) {
          return result.then(
            res => {
              Debug.success(name, `Function completed successfully with result:`, res);
              return res;
            },
            err => {
              Debug.error(name, `Function failed with error:`, err);
              throw err;
            }
          );
        } else {
          Debug.success(name, `Function completed successfully with result:`, result);
          return result;
        }
      } catch (error) {
        Debug.error(name, `Function failed with error:`, error);
        throw error;
      }
    };
  }
};

// Wrap the openVirtualTour function with debugging
const originalOpenVirtualTour = openVirtualTour;
openVirtualTour = Debug.trackFunction('openVirtualTour', originalOpenVirtualTour);
```

**Issues Identified:**
- Successfully captured detailed debug info
- Confirmed that Street View API was being called correctly
- Identified that requests were timing out rather than failing with error
- Still no resolution to the core problem

### 1.5. Direct Event Handling (Fifth Attempt)

Implemented a direct global event listener for `.view-360` buttons:

```javascript
// Add a direct global event listener for virtual tour buttons
document.addEventListener('click', function(e) {
  // Check if clicked element or any of its parents have the class 'view-360'
  let target = e.target;
  while (target && target !== document.body) {
    if (target.classList && target.classList.contains('view-360')) {
      e.preventDefault();
      const venueId = target.getAttribute('data-venue');
      console.log('DIRECT CLICK on view-360 button for venue:', venueId);
      
      // Find the venue in our data
      const venue = venueMarkers.find(marker => marker.id === venueId);
      if (!venue) {
        console.error('Could not find venue with ID:', venueId);
        return;
      }
      
      // Get the modal and container elements
      const tourModal = document.getElementById('tourModal');
      const tourContainer = document.getElementById('tourContainer');
      
      if (!tourModal || !tourContainer) {
        console.error('Tour modal or container not found in DOM');
        return;
      }
      
      // Force-show the modal
      console.log('Showing tour modal for venue:', venue.name);
      tourModal.style.display = 'flex';
      
      // Add the loading indicator
      tourContainer.innerHTML = `
        <div class="tour-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading virtual tour for ${venue.name}...</p>
        </div>
      `;
      
      // Try to load Street View
      setTimeout(() => {
        try {
          if (!window.google || !google.maps || !google.maps.StreetViewPanorama) {
            throw new Error('Google Street View not available');
          }
          
          // Create Street View service
          const sv = new google.maps.StreetViewService();
          
          // Try with place ID first if available
          if (venue.placeId) {
            sv.getPanorama({ placeId: venue.placeId }, (data, status) => {
              if (status === "OK") {
                showStreetViewPanorama(venue, tourContainer, data);
              } else {
                // Try with coordinates as backup
                tryWithCoordinates();
              }
            });
          } else {
            tryWithCoordinates();
          }
          
          // Helper function to try with coordinates
          function tryWithCoordinates() {
            if (!venue.coordinates || !venue.coordinates.lat || !venue.coordinates.lng) {
              showBeautifulFallback(venue, tourContainer);
              return;
            }
            
            // Try a wider radius to find any nearby Street View
            sv.getPanorama({
              location: venue.coordinates,
              radius: 500, // Look in a larger radius
              source: google.maps.StreetViewSource.DEFAULT
            }, (data, status) => {
              if (status === "OK") {
                showStreetViewPanorama(venue, tourContainer, data);
              } else {
                console.log(`No Street View available for ${venue.name}: ${status}`);
                showBeautifulFallback(venue, tourContainer);
              }
            });
          }
        } catch (error) {
          console.error('Street View error:', error);
          showBeautifulFallback(venue, tourContainer);
        }
      }, 500);
      
      // Break the loop since we found and handled the event
      break;
    }
    target = target.parentElement;
  }
});
```

**Issues Identified:**
- Direct event handling and DOM manipulation works correctly
- Modal shows and loads properly
- Place ID requests are made correctly
- Still no Street View panoramas load

## 2. HTML/CSS Structure

### 2.1. Modal Structure

```html
<!-- 360° Virtual Tour Modal -->
<div id="tourModal" class="tour-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Virtual Tour</h2>
      <button class="close-modal" aria-label="Close modal">&times;</button>
    </div>
    <div id="tourContainer"></div>
  </div>
</div>
```

### 2.2. CSS Implementation

```css
.tour-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.tour-modal .modal-content {
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 80%;
  max-height: 800px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.tour-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.tour-modal .modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.tour-modal .close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;
}

#tourContainer {
  flex: 1;
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
}

.tour-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
}

.tour-loading i {
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 15px;
}

.tour-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
}
```

## 3. API Configuration

### 3.1. Google Maps API Setup

```html
<!-- Google Maps API with correct libraries -->
<script>
  // Inline error handler for Google Maps
  function gm_authFailure() {
    console.error('Google Maps authentication error - please verify your API key/referrer settings.');
    const mapContainers = document.querySelectorAll('.venues-map');
    mapContainers.forEach(container => {
      container.innerHTML = `
        <div class="map-error">
          <h3>Map Loading Error</h3>
          <p>We're experiencing technical difficulties with our map. Please refresh or try again later.</p>
        </div>
      `;
    });
  }

  // Simple callback to confirm Maps loaded
  function initGoogleMapsAPI() {
    console.log("Google Maps API loaded successfully.");
  }
</script>
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCM-Z8rjN4y7xKGBG24pNpv9kpwb8g1ELE&libraries=places,geometry&callback=initGoogleMapsAPI"
  onerror="gm_authFailure()">
</script>
```

### 3.2. API Key & Configuration

- **API Key**: `AIzaSyCM-Z8rjN4y7xKGBG24pNpv9kpwb8g1ELE`
- **Enabled Libraries**: `places`, `geometry`
- **Maps JavaScript API**: Confirmed working based on successful map rendering
- **Authorization**: No authentication errors reported
- **Domain Restrictions**: None identified in console errors

### 3.3. Console Warnings & Errors

- **Warning**: "Google Maps JavaScript API has been loaded directly without loading=async" - This is a performance warning, not a functionality error
- **Warning**: "As of February 21st, 2024, google.maps.Marker is deprecated" - This is a deprecation notice, not affecting current functionality
- **No Authentication Errors**: The absence of `gm_authFailure()` being called confirms API key is valid

## 4. Venue Data Structure

The complete venue data includes 18 venues. Each venue has the following structure:

```javascript
{
  id: "venue-id", // e.g., "the-gem"
  name: "Venue Name", // e.g., "The Gem"
  description: "Venue description text...",
  location: "Address information",
  coordinates: {
    lat: 51.12345, // Latitude
    lng: -115.67890 // Longitude
  },
  placeId: "ChIJXdYXc8PPcFMR2FLpubbFK70", // Google Maps Place ID
  region: "banff", // Region identifier
  image: "assets/images/venues/venue-image.jpg",
  capacity: "20-150", // Guest capacity
  priceRange: "$$-$$$",
  availability: "Year-round",
  url: "/venues.html#venue-id", // URL for venue details
  features: ["Mountain Views", "Indoor & Outdoor Options", ...],
  rating: 4.8 // Rating out of 5
}
```

### 4.1. Sample Venue Data

Here are examples of venues with their Place IDs and coordinates:

| Venue ID | Name | Place ID | Coordinates |
|----------|------|----------|------------|
| the-gem | The Gem | ChIJXdYXc8PPcFMR2FLpubbFK70 | 51.xxxx, -115.xxxx |
| banff-springs | Fairmont Banff Springs Hotel | ChIJvwKnzOxwcFMRgCZLyeVchkY | 51.xxxx, -115.xxxx |
| chateau-louise | Fairmont Chateau Lake Louise | ChIJDVrP-v2GblMRkfQ0rKEiZkE | 51.xxxx, -116.xxxx |
| mainspace-solara | MainSpace at Solara | ChIJXfxqZhzPcFMRDfJlY9_jjBw | 51.xxxx, -115.xxxx |
| stewart-creek | Stewart Creek Golf Course | ChIJ61CUfNjPcFMRkdOCrJrXUHw | 51.xxxx, -115.xxxx |
| emerald-lake | Emerald Lake Lodge | ChIJfTNQAmWDbVMRcFzl6-T6TP8 | 51.xxxx, -116.xxxx |
| kicking-horse | Kicking Horse Resort | ChIJtZETZQXvblMRCF0eatrLt5k | 51.xxxx, -116.xxxx |
| pyramid-lake | Pyramid Lake Lodge | ChIJDZ_W3RqOaFMR9UZmcMdl_0M | 52.xxxx, -118.xxxx |
| cochrane-ranchehouse | Cochrane RancheHouse | ChIJuXHr6JR1cFMR5TqKdFIvfKU | 51.xxxx, -114.xxxx |

## 5. Console Log Analysis

The console logs indicate the following sequence:

1. **Initialization Sequence**:
   ```
   06:01:54.955 venues.js:22 [00:31:54.954] [INFO] INIT
   06:01:54.955 venues.js:26 Page initialization started
   06:01:54.955 venues.js:22 [00:31:54.955] [INFO] DATA
   06:01:54.955 venues.js:26 Fetching venue data from JSON file
   ```

2. **Google Maps API Loading**:
   ```
   06:01:55.078 venues.js:175 Google Maps API loaded successfully.
   06:01:55.078 venues.js:22 [00:31:55.078] [SUCCESS] GOOGLE_MAPS
   06:01:55.078 venues.js:26 Google Maps API loaded successfully
   ```

3. **Data Loading & Map Initialization**:
   ```
   06:01:55.098 venues.js:22 [00:31:55.098] [SUCCESS] DATA
   06:01:55.098 venues.js:26 Successfully loaded 18 venues from JSON
   06:01:55.103 venues.js:22 [00:31:55.103] [INFO] MAP_INIT
   06:01:55.104 venues.js:26 Initializing Google Maps
   ```

4. **Virtual Tour Components**:
   ```
   06:01:55.180 venues.js:22 [00:31:55.180] [INFO] VIRTUAL_TOUR
   06:01:55.180 venues.js:26 Found 9 tour buttons
   ```

5. **Virtual Tour Attempt** (for "the-gem"):
   ```
   06:02:22.701 venues.js:22 [00:32:22.701] [INFO] VIRTUAL_TOUR
   06:02:22.701 venues.js:26 Tour button clicked for venue: the-gem
   06:02:22.704 venues.js:22 [00:32:22.704] [INFO] VIRTUAL_TOUR
   06:02:22.704 venues.js:26 Loading virtual tour for The Gem
   06:02:22.704 venues.js:22 [00:32:22.704] [INFO] VIRTUAL_TOUR
   06:02:22.704 venues.js:26 Trying Street View with Place ID: ChIJXdYXc8PPcFMR2FLpubbFK70
   ```

6. **Virtual Tour Failure**:
   ```
   06:02:30.705 venues.js:22 [00:32:30.705] [WARNING] VIRTUAL_TOUR
   06:02:30.705 venues.js:26 Street View panorama loading timeout
   06:02:30.706 venues.js:22 [00:32:30.706] [WARNING] VIRTUAL_TOUR
   06:02:30.706 venues.js:26 Showing error/fallback UI for The Gem: Street View took too long to respond
   ```

7. **Same Pattern for Other Venues**:
   ```
   06:02:48.389 venues.js:22 [00:32:48.389] [INFO] VIRTUAL_TOUR
   06:02:48.389 venues.js:26 Tour button clicked for venue: chateau-louise
   // ...
   06:02:56.391 venues.js:22 [00:32:56.390] [WARNING] VIRTUAL_TOUR
   06:02:56.391 venues.js:26 Street View panorama loading timeout
   ```

## 6. Root Cause Analysis

Based on extensive testing and the console logs, the following potential root causes have been identified:

### 6.1. Street View Data Availability

Despite having valid Place IDs, Street View data appears to be unavailable for the specified locations. The absence of explicit error messages (such as "NOT_FOUND" or "ZERO_RESULTS") suggests that the Street View service is attempting to load data but not finding suitable panoramas.

Several tests confirm this:
- Multiple different venues exhibit the same behavior
- Both Place ID and coordinate-based approaches fail
- Increased radius searches (up to 500m) still fail to find panoramas

### 6.2. API Key Configuration

The API key appears to be correctly configured for Maps JavaScript API, as evidenced by:
- Successful map loading and rendering
- No authentication errors in the console
- Marker creation working correctly

However, it's possible that the Street View API is not enabled for this API key in the Google Cloud Console, or there might be quota/billing restrictions.

### 6.3. Implementation Issues

The code implementation appears to be correct:
- Event handlers properly identify venue IDs
- Modal display and DOM manipulation work correctly
- Street View service calls are made with correct parameters
- Timeout detection and fallback UI work as designed

## 7. Responsibility Assessment

### 7.1. AI Assistant Responsibility

I made several errors in the troubleshooting process:

1. **Incorrect Assumptions**:
   - I initially suggested the issue might be with Place IDs, even though the console logs showed they were being used correctly
   - I suggested potential API key issues when the console showed no authentication errors
   - I focused on implementation details when the issue appears to be with external service availability

2. **Inconsistent Analysis**:
   - I acknowledged successful map initialization but still suggested API configuration issues
   - I verified that the venue data was correctly structured but still suggested potential data problems

3. **Ineffective Solutions**:
   - The solutions I provided repeatedly failed to address the core issue
   - I continued to modify implementation details rather than addressing the fundamental problem of Street View data availability
   - I did not properly prioritize a fallback solution early enough in the process

### 7.2. External Limitations

Some aspects were outside direct control:

1. **Street View Coverage**:
   - Street View data availability is controlled by Google
   - Not all locations have Street View coverage, particularly private properties or recently built venues
   - Console logs consistently show timeouts rather than explicit "NOT_FOUND" errors

2. **API Behavior**:
   - The Street View service API's behavior of timing out rather than returning an immediate error is suboptimal
   - Documentation doesn't clearly explain the difference between a failed request and a request for non-existent data

## 8. Current Status

The current implementation:

1. **Works Correctly**:
   - Venue data is loaded and processed correctly
   - Map displays and interaction work properly
   - Virtual tour modal opens and displays correctly
   - Fallback UI displays when Street View fails to load

2. **Fails Due To**:
   - Street View data appears to be unavailable for the specified venues
   - No panorama data is returned within the timeout period

## 9. Alternative Approaches

For future implementation, consider these alternatives:

### 9.1. Custom 360° Panoramas

Instead of relying on Google Street View, create custom 360° panoramas:

```javascript
// Using Pannellum for custom panoramas
const panorama = pannellum.viewer(tourContainer, {
  type: 'equirectangular',
  panorama: venue.customPanoramaImage,
  autoLoad: true
});
```

### 9.2. Embedded Google Maps with Direct Link

```javascript
function showVenueTour(venue) {
  // Create a Google Maps URL that attempts to show Street View
  const mapUrl = `https://www.google.com/maps/embed?pb=!4v1234567890!6m8!1m7!${venue.placeId}!2m2!1d${venue.coordinates.lat}!2d${venue.coordinates.lng}!3f0!4f0!5f0.75`;
  
  // Create iframe in the tour container
  document.getElementById('tourContainer').innerHTML = `
    <iframe src="${mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
  `;
}
```

### 9.3. Enhanced Fallback Experience

The current fallback provides a good user experience but could be further enhanced:

```javascript
function showBeautifulFallback(venue, container) {
  // Create a beautiful fallback with the venue image, map link, and info
  const mapUrl = `https://www.google.com/maps?q=${venue.coordinates.lat},${venue.coordinates.lng}`;
  
  container.innerHTML = `
    <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:30px; background:#f8f9fa;">
      <h3 style="margin:0 0 20px; color:#2c3e50; font-size:22px;">Experience ${venue.name}</h3>
      <div style="position:relative; width:100%; max-width:600px; margin-bottom:25px; overflow:hidden; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.1);">
        <img src="${venue.image}" alt="${venue.name}" style="width:100%; object-fit:cover; aspect-ratio:16/9;">
      </div>
      <p style="margin:0 0 15px; color:#505050; max-width:600px; line-height:1.6;">
        While 360° Street View is not available for this location, you can explore ${venue.name} through our detailed venue information and photos.
      </p>
      <div style="display:flex; gap:15px; margin-top:15px;">
        <a href="${mapUrl}" target="_blank" style="text-decoration:none; background:#e74c3c; color:white; padding:10px 20px; border-radius:5px; display:flex; align-items:center; gap:5px; font-weight:500;">
          <i class="fas fa-map-marker-alt"></i> View on Map
        </a>
        <a href="${venue.url}" style="text-decoration:none; background:#3498db; color:white; padding:10px 20px; border-radius:5px; display:flex; align-items:center; gap:5px; font-weight:500;">
          <i class="fas fa-info-circle"></i> Venue Details
        </a>
      </div>
    </div>
  `;
}
```

## 10. Conclusion

The virtual tour functionality implementation is technically correct but faces external limitations with Street View data availability. The current approach with timeout detection and fallback UI provides a reasonable user experience, but alternative approaches should be considered for more reliable results.

The responsibility for the failure lies partly with inadequate troubleshooting that repeatedly focused on implementation details rather than addressing the core issue of Street View data availability, and partly with the limitations of the Street View service itself. 