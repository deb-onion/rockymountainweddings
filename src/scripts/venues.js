// Debug utility for tracking function execution and errors
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
    
    console.groupCollapsed(
      `%c[${timestamp}] [${levelInfo.name}] ${context}`, 
      levelInfo.style
    );
    console.log(message);
    if (data) console.log(data);
    console.trace('Call stack:');
    console.groupEnd();
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
  
  // Function wrapper for tracking execution
  trackFunction: function(funcName, func) {
    return function(...args) {
      Debug.info(funcName, `Function called with args:`, args.length > 0 ? args : 'no args');
      try {
        const result = func.apply(this, args);
        if (result instanceof Promise) {
          return result
            .then(value => {
              Debug.success(funcName, `Function completed successfully with async result:`, value);
              return value;
            })
            .catch(err => {
              Debug.error(funcName, `Function failed with error:`, err);
              throw err;
            });
        } else {
          Debug.success(funcName, `Function completed successfully with result:`, result);
          return result;
        }
      } catch (err) {
        Debug.error(funcName, `Function failed with error:`, err);
        throw err;
      }
    };
  }
};

// Track Google Maps API loading status
let googleMapsLoaded = false;
let googleMapsCallbacks = [];
let googleMapsRetryAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
let venueMarkers = []; // This will be populated from JSON data instead of hard-coded

// Function to call when Google Maps is ready
function onGoogleMapsReady() {
  Debug.success('GOOGLE_MAPS', 'Google Maps API loaded successfully');
  googleMapsLoaded = true;
  googleMapsRetryAttempts = 0;
  
  // Execute any callbacks waiting for Maps API
  while (googleMapsCallbacks.length > 0) {
    const callback = googleMapsCallbacks.shift();
    try {
      callback();
    } catch (err) {
      Debug.error('GOOGLE_MAPS', 'Error in Maps callback', err);
    }
  }
}

// Function to safely execute code that depends on Google Maps
function whenGoogleMapsReady(callback) {
  if (googleMapsLoaded) {
    callback();
  } else if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
    // Google Maps is available but our flag wasn't set
    googleMapsLoaded = true;
    callback();
  } else {
    googleMapsCallbacks.push(callback);
    
    // If we have retries left, set a timeout to check again
    if (googleMapsRetryAttempts < MAX_RETRY_ATTEMPTS) {
      googleMapsRetryAttempts++;
      setTimeout(() => {
        Debug.info('GOOGLE_MAPS', `Retry attempt ${googleMapsRetryAttempts} for Maps API`);
        if (!googleMapsLoaded && typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
          Debug.success('GOOGLE_MAPS', 'Maps API found on retry');
          onGoogleMapsReady();
        }
      }, 1000 * googleMapsRetryAttempts); // Increase delay with each retry
    }
  }
}

// Fetch venue data from JSON file
async function fetchVenueData() {
  try {
    Debug.info('DATA', 'Fetching venue data from JSON file');
    const response = await fetch('./data/venues.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    venueMarkers = data.venues;
    Debug.success('DATA', `Successfully loaded ${venueMarkers.length} venues from JSON`);
    return venueMarkers;
  } catch (error) {
    Debug.error('DATA', 'Error fetching venue data:', error);
    // Display a user-friendly error in the map container
    const mapContainer = document.getElementById('venuesMap');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="map-error">
          <h3>Data Loading Error</h3>
          <p>We couldn't load the venue data. Please refresh the page or try again later.</p>
          <p>Technical details: ${error.message}</p>
        </div>
      `;
    }
    // Fallback to empty array if fetch fails
    venueMarkers = [];
    throw error;
  }
}

// Main page initialization
document.addEventListener('DOMContentLoaded', async () => {
  Debug.info('INIT', 'Page initialization started');
  
  try {
    // First, fetch venue data
    await fetchVenueData();
    
    // Initialize non-Maps dependent features first
    initVenueGalleries();    // Auto-rotating gallery
    initVenueModal();        // Inquiry form modal
    initRegionFilters();     // Smooth scrolling for region links
    initSmoothScrolling();   // Anchor scrolling
    
    // Initialize Maps-dependent features only when Maps API is ready
    whenGoogleMapsReady(() => {
      initInteractiveMap();    // Google Maps + all venue markers
      initVirtualTours();      // 360 tours
      initVenueComparison();   // Comparison tool
      initVenuePlanner();      // Planner tool
      Debug.success('MAPS_INIT', 'Maps-dependent features initialized');
    });
    
    Debug.success('INIT', 'Page initialization completed successfully');
  } catch (error) {
    Debug.error('INIT', 'Page initialization failed', error);
  }
});

// Override the Maps callback to track loading
window.initGoogleMapsAPI = function() {
  console.log("Google Maps API loaded successfully.");
  onGoogleMapsReady();
};

/* --------------------------------
   1) Initialize Interactive Map
--------------------------------- */
function initInteractiveMap() {
  const mapContainer = document.getElementById('venuesMap');
  if (!mapContainer) {
    Debug.error('MAP_INIT', 'Map container not found (id="venuesMap").');
    return;
  }

  // Check if we have venue data
  if (!venueMarkers || venueMarkers.length === 0) {
    Debug.error('MAP_INIT', 'No venue data available for map.');
    mapContainer.innerHTML = `
      <div class="map-error">
        <h3>Map Data Error</h3>
        <p>We couldn't load venue data for the map. Please refresh or try again later.</p>
      </div>
    `;
    return;
  }

  // Ensure map container has explicit dimensions - critical for mobile
  const containerWidth = mapContainer.offsetWidth;
  const containerHeight = mapContainer.offsetHeight;
  
  if (containerWidth === 0 || containerHeight === 0) {
    Debug.warn('MAP_INIT', 'Map container has zero width/height; explicitly setting dimensions.');
    mapContainer.style.minHeight = '350px'; // Reduced height for mobile
    mapContainer.style.width = '100%';
    
    // Force a layout recalculation
    setTimeout(() => {
      initMapAfterContainerSized(mapContainer);
    }, 100);
  } else {
    initMapAfterContainerSized(mapContainer);
  }
}

// Separate function to initialize map after ensuring container has size
function initMapAfterContainerSized(mapContainer) {
  // Check if Google Maps is loaded
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    Debug.error('MAP_INIT', 'Google Maps API not available.');
    mapContainer.innerHTML = `
      <div class="map-error">
        <h3>Map Loading Error</h3>
        <p>We couldn't load the Google Maps API. Please refresh or try again later.</p>
      </div>
    `;
    return;
  }

  Debug.info('MAP_INIT', 'Initializing Google Maps');

  // Example custom map style
  const mapStyles = [
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{ color: '#dde2e3' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#a9de83' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#a6cbe3' }]
    }
  ];
  
  // Get device type for mobile-specific options
  const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
  
  // Map options with mobile-specific adjustments
  const mapOptions = {
    center: new google.maps.LatLng(51.4, -116.2), // Center on Banff area
    zoom: isMobile ? 7 : 9, // Use a wider zoom on mobile
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    styles: mapStyles,
    mapTypeControl: true, // Enable map type control for all devices
    mapTypeControlOptions: {
      position: isMobile ? 
        google.maps.ControlPosition.TOP_LEFT :
        google.maps.ControlPosition.TOP_RIGHT,
      style: isMobile ? 
        google.maps.MapTypeControlStyle.DROPDOWN_MENU : 
        google.maps.MapTypeControlStyle.HORIZONTAL_BAR
    },
    streetViewControl: true, // Enable Street View for all devices
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    gestureHandling: 'greedy', // Make touch handling more responsive
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    }
  };

  let map;
  try {
    Debug.info('MAP_INIT', 'Creating new Google Map instance');
    map = new google.maps.Map(mapContainer, mapOptions);
    
    // Force a resize after map is created to fix initial blank map issue
    setTimeout(() => {
      Debug.info('MAP_INIT', 'Triggering resize event for map');
      google.maps.event.trigger(map, 'resize');
      // Also set center again to ensure map is positioned correctly
      map.setCenter(mapOptions.center);
    }, 500);
    
    map.addListener('idle', () => {
      Debug.success('MAP_INIT', 'Map rendered successfully');
    });
  } catch (error) {
    Debug.error('MAP_INIT', 'Error initializing map:', error);
    mapContainer.innerHTML = `
      <div class="map-error">
        <h3>Map Loading Error</h3>
        <p>We couldn't load the interactive venue map. Please refresh or try again later.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
    return;
  }

  // Circle marker icon based on region color
  function createMarkerIcon(region) {
    const colors = {
      banff: '#e74c3c',
      canmore: '#3498db',
      'lake-louise': '#2ecc71',
      'emerald-lake': '#27ae60',
      kananaskis: '#f39c12',
      jasper: '#9b59b6',
      golden: '#f1c40f',
      cochrane: '#e67e22'
    };
    const color = colors[region] || '#e74c3c'; // default red
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.9,
      strokeWeight: 2,
      strokeColor: '#fff',
      scale: 10
    };
  }
  
  // Attach markers & info windows
  Debug.info('MAP_INIT', 'Adding venue markers to map');
  venueMarkers.forEach(venue => {
    try {
      const marker = new google.maps.Marker({
        position: venue.coordinates,
        map: map,
        title: venue.name,
        icon: createMarkerIcon(venue.region),
        animation: google.maps.Animation.DROP
      });

      // Info window content
      const infoContent = `
        <div class="venue-info-window">
          <div class="venue-info-header">
            <img src="${venue.image}" alt="${venue.name}">
            <div class="venue-info-name">
              <h3>${venue.name}</h3>
            </div>
          </div>
          <div class="venue-info-content">
            <p>${venue.description}</p>
            <div class="venue-info-detail"><i class="fas fa-map-marker-alt"></i> ${venue.location}</div>
            <div class="venue-info-detail"><i class="fas fa-users"></i> ${venue.capacity}</div>
            <div class="venue-info-detail"><i class="fas fa-dollar-sign"></i> ${venue.priceRange}</div>
            <a href="${venue.url}" class="venue-info-link">View Details</a>
          </div>
        </div>
      `;
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 320
      });

      // On marker click
      marker.addListener('click', () => {
        // Close other open windows
        venueMarkers.forEach(v => {
          if (v.infoWindow && v.infoWindow.getMap()) {
            v.infoWindow.close();
          }
        });
        infoWindow.open(map, marker);
        venue.infoWindow = infoWindow;

        // Bounce animation
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 750);

        // Update map sidebar preview
        updateSidebarPreview(venue);
      });

      // Hover effect
      marker.addListener('mouseover', () => {
        marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        marker.setIcon({ ...createMarkerIcon(venue.region), scale: 12 });
      });
      marker.addListener('mouseout', () => {
        marker.setIcon(createMarkerIcon(venue.region));
      });

      // Store references
      venue.marker = marker;
      venue.infoWindow = infoWindow;
    } catch (e) {
      Debug.error('MAP_INIT', `Error adding marker for venue ${venue.name}:`, e);
    }
  });

  // Filter markers by region
  const regionFilters = document.querySelectorAll('.region-filter');
  regionFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      regionFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedRegion = btn.dataset.region;
      let bounds = new google.maps.LatLngBounds();
      let anyVisible = false;

      venueMarkers.forEach(venue => {
        if (selectedRegion === 'all' || venue.region === selectedRegion) {
          venue.marker.setVisible(true);
          bounds.extend(venue.coordinates);
          anyVisible = true;
          // close open infoWindow if open
          if (venue.infoWindow && venue.infoWindow.getMap()) {
            venue.infoWindow.close();
          }
        } else {
          venue.marker.setVisible(false);
        }
      });

      if (anyVisible) {
        map.fitBounds(bounds);
        google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          if (map.getZoom() > 12) map.setZoom(12);
        });
      } else {
        // fallback if no markers in that region
        map.setCenter({ lat: 51.1645, lng: -115.5708 });
        map.setZoom(8);
      }
    });
  });

  // Sidebar preview
  function updateSidebarPreview(venue) {
    const placeholder = document.querySelector('.venue-preview-placeholder');
    const content = document.querySelector('.venue-preview-content');
    if (!placeholder || !content) return;

    placeholder.style.display = 'none';
    content.style.display = 'block';

    content.innerHTML = `
      <div class="preview-image" style="height:150px; overflow:hidden;">
        <img src="${venue.image}" alt="${venue.name}" style="width:100%; object-fit:cover;">
      </div>
      <div class="preview-title">${venue.name}</div>
      <div class="preview-location">
        <i class="fas fa-map-marker-alt"></i> ${venue.location}
      </div>
      <div class="preview-details">
        <div class="preview-detail"><i class="fas fa-users"></i> ${venue.capacity}</div>
        <div class="preview-detail"><i class="fas fa-dollar-sign"></i> ${venue.priceRange}</div>
      </div>
      <div class="preview-description">${venue.description}</div>
      <div class="preview-features">
        ${venue.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
      </div>
      <div class="preview-actions">
        <a href="${venue.url}" class="btn-outline btn-view-venue">View Details</a>
      </div>
    `;
  }
}

/* ----------------------------------------
   2) Region Filters for Anchor Scrolling
----------------------------------------- */
function initRegionFilters() {
  const regionLinks = document.querySelectorAll('.region-link');
  regionLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        window.scrollTo({
          top: targetEl.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ----------------------------------------
   3) Venue Galleries (Auto-Rotation)
----------------------------------------- */
function initVenueGalleries() {
  const galleries = document.querySelectorAll('.venue-gallery');
  galleries.forEach(gallery => {
    const mainImg = gallery.querySelector('.gallery-main img');
    const thumbs = gallery.querySelectorAll('.gallery-thumbs img');
    let currentIndex = 0;
    let rotationTimer;

    function changeMainImage(index) {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = thumbs[index].src;
        mainImg.alt = thumbs[index].alt;
        mainImg.style.opacity = '1';
        currentIndex = index;
      }, 300);
    }

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        changeMainImage(i);
        clearInterval(rotationTimer);
        startRotation();
      });
    });

    function startRotation() {
      rotationTimer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % thumbs.length;
        changeMainImage(nextIndex);
      }, 4000);
    }
    gallery.addEventListener('mouseenter', () => clearInterval(rotationTimer));
    gallery.addEventListener('mouseleave', () => startRotation());
    startRotation();
  });
}

/* ----------------------------
   4) Venue Inquiry Modal
----------------------------- */
function initVenueModal() {
  const modal = document.getElementById('venueModal');
  if (!modal) return;

  const inquiryBtns = document.querySelectorAll('.btn-venue-inquiry');
  const closeButton = modal.querySelector('.close-modal');
  const venueField = document.getElementById('selectedVenue');

  inquiryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const venueName = btn.getAttribute('data-venue') || '';
      venueField.value = venueName;
      showModal();
    });
  });

  function showModal() {
    modal.classList.add('active');
    setTimeout(() => {
      modal.querySelector('.modal-content').classList.add('modal-animate');
    }, 100);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.querySelector('.modal-content').classList.remove('modal-animate');
    setTimeout(() => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }, 300);
  }

  if (closeButton) closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Venue-specific fields logic
  const form = document.getElementById('venueInquiryForm');
  if (form) {
    venueField.addEventListener('change', updateFormFields);

    function updateFormFields() {
      // Example of adding dynamic fields
      const container = ensureVenueFieldsContainer();
      container.innerHTML = ''; // Clear old fields

      if (venueField.value.includes('Banff Springs')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Preferred Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="">Select location</option>
              <option value="terrace">The Terrace</option>
              <option value="cascade-ballroom">Cascade Ballroom</option>
              <option value="mt-stephen-hall">Mount Stephen Hall</option>
              <option value="conservatory">The Conservatory</option>
            </select>
          </div>
          <div class="form-group">
            <label for="guest-accommodation">Guest Accommodation Package</label>
            <select id="guest-accommodation" name="guest-accommodation">
              <option value="standard">Standard Room Block</option>
              <option value="deluxe">Deluxe Suite Block</option>
              <option value="none">No Accommodation Needed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="catering-preference">Catering Preference</label>
            <select id="catering-preference" name="catering-preference">
              <option value="plated">Plated Dinner</option>
              <option value="buffet">Buffet Style</option>
              <option value="stations">Food Stations</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Sky Bistro')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="gondola-tickets">Gondola Tickets Required</label>
            <input type="number" id="gondola-tickets" name="gondola-tickets" min="10" placeholder="Approximate number of guests">
          </div>
          <div class="form-group">
            <label for="dining-preference">Dining Preference</label>
            <select id="dining-preference" name="dining-preference">
              <option value="set-menu">Set Menu</option>
              <option value="custom">Custom Menu</option>
              <option value="cocktail">Cocktail Style</option>
            </select>
          </div>
          <div class="form-group">
            <label for="time-preference">Preferred Time</label>
            <select id="time-preference" name="time-preference">
              <option value="day">Daytime (Views)</option>
              <option value="sunset">Sunset</option>
              <option value="evening">Evening</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Maple Leaf')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="event-type">Event Type</label>
            <select id="event-type" name="event-type">
              <option value="reception">Reception Only</option>
              <option value="dinner">Dinner Only</option>
              <option value="full">Full Wedding Event</option>
            </select>
          </div>
          <div class="form-group">
            <label for="menu-preference">Menu Preference</label>
            <select id="menu-preference" name="menu-preference">
              <option value="canadian">Canadian Cuisine</option>
              <option value="custom">Custom Menu</option>
              <option value="tasting">Chef's Tasting Menu</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Mt. Norquay')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="cascade-lodge">Cascade Lodge</option>
              <option value="viewpoint">Cliffhouse Viewpoint</option>
              <option value="outdoor-deck">Outdoor Deck</option>
            </select>
          </div>
          <div class="form-group">
            <label for="chairlift-access">Chairlift Access for Guests</label>
            <select id="chairlift-access" name="chairlift-access">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="season">Preferred Season</label>
            <select id="season" name="season">
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Three Bears')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="event-format">Event Format</label>
            <select id="event-format" name="event-format">
              <option value="casual">Casual Standing Reception</option>
              <option value="seated">Seated Dinner</option>
              <option value="mixed">Mixed Format</option>
            </select>
          </div>
          <div class="form-group">
            <label for="brew-tour">Brewery Tour for Guests</label>
            <select id="brew-tour" name="brew-tour">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="beer-selection">Beer Selection Package</label>
            <select id="beer-selection" name="beer-selection">
              <option value="standard">Standard Selection</option>
              <option value="premium">Premium Craft Selection</option>
              <option value="custom">Custom Beer Flight</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Silvertip')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="pavilion">Wedding Pavilion</option>
              <option value="terrace">Mountain View Terrace</option>
              <option value="ballroom">Grand Ballroom</option>
            </select>
          </div>
          <div class="form-group">
            <label for="golf-activity">Golf Activities</label>
            <select id="golf-activity" name="golf-activity">
              <option value="none">None</option>
              <option value="tournament">Pre-Wedding Tournament</option>
              <option value="casual">Casual Tee Times</option>
            </select>
          </div>
          <div class="form-group">
            <label for="decor-package">Decor Package</label>
            <select id="decor-package" name="decor-package">
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="custom">Custom Design</option>
              <option value="none">No Package (Own Decor)</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Emerald Lake')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="point">The Point (Lakeside)</option>
              <option value="patio">Cilantro Patio</option>
              <option value="indoor">Emerald Room</option>
            </select>
          </div>
          <div class="form-group">
            <label for="cabin-accommodations">Cabin Accommodations</label>
            <select id="cabin-accommodations" name="cabin-accommodations">
              <option value="full-buyout">Full Lodge Buyout</option>
              <option value="partial">Partial Lodge Block</option>
              <option value="none">No Accommodation Needed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="canoe-rental">Canoe Rental for Photos</label>
            <select id="canoe-rental" name="canoe-rental">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Kicking Horse')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="eagle-eye">Eagle's Eye Restaurant (Mountain Top)</option>
              <option value="gondola-deck">Gondola Deck</option>
              <option value="base">Base Area</option>
            </select>
          </div>
          <div class="form-group">
            <label for="season">Preferred Season</label>
            <select id="season" name="season">
              <option value="summer">Summer</option>
              <option value="fall">Fall Colors</option>
              <option value="winter">Winter/Ski Season</option>
              <option value="spring">Spring</option>
            </select>
          </div>
          <div class="form-group">
            <label for="gondola-tickets">Gondola Tickets Required</label>
            <input type="number" id="gondola-tickets" name="gondola-tickets" min="10" placeholder="Approximate number of guests">
          </div>
        `;
      } else if (venueField.value.includes('Pyramid Lake')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="island">Private Island</option>
              <option value="lakeside">Lakeside Grounds</option>
              <option value="indoor">Lodge Interior</option>
            </select>
          </div>
          <div class="form-group">
            <label for="season">Preferred Season</label>
            <select id="season" name="season">
              <option value="summer">Summer</option>
              <option value="fall">Fall Colors</option>
              <option value="winter">Winter Wonderland</option>
              <option value="spring">Spring</option>
            </select>
          </div>
          <div class="form-group">
            <label for="accommodation-nights">Accommodation Nights</label>
            <select id="accommodation-nights" name="accommodation-nights">
              <option value="1">1 Night</option>
              <option value="2">2 Nights</option>
              <option value="3">3+ Nights</option>
              <option value="none">No Accommodation</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Cochrane')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="outdoor-terrace">Outdoor Terrace</option>
              <option value="great-hall">Great Hall</option>
              <option value="cochrane-room">Cochrane Room</option>
            </select>
          </div>
          <div class="form-group">
            <label for="catering-preference">Catering Preference</label>
            <select id="catering-preference" name="catering-preference">
              <option value="in-house">In-House Catering</option>
              <option value="external">External Caterer</option>
            </select>
          </div>
          <div class="form-group">
            <label for="bar-service">Bar Service</label>
            <select id="bar-service" name="bar-service">
              <option value="host">Host Bar</option>
              <option value="cash">Cash Bar</option>
              <option value="combo">Combination</option>
            </select>
          </div>
        `;
      } else if (venueField.value.includes('Lake Louise')) {
        container.innerHTML = `
          <div class="form-group">
            <label for="ceremony-location">Preferred Ceremony Location</label>
            <select id="ceremony-location" name="ceremony-location">
              <option value="">Select location</option>
              <option value="lakefront">Lakefront</option>
              <option value="victoria-terrace">Victoria Terrace</option>
              <option value="victoria-ballroom">Victoria Ballroom</option>
            </select>
          </div>
          <div class="form-group">
            <label for="accommodation">Will you need accommodation?</label>
            <select id="accommodation" name="accommodation">
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not-sure">Not Sure Yet</option>
            </select>
          </div>
        `;
      }
      // More venues can be added here if needed
    }

    function ensureVenueFieldsContainer() {
      let container = document.querySelector('.venue-specific-fields');
      if (!container) {
        container = document.createElement('div');
        container.className = 'venue-specific-fields';
        form.querySelector('.form-grid').appendChild(container);
      }
      return container;
    }

    // Form submission & validation
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm()) return;

      const submitBtn = form.querySelector('.btn-submit');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      submitBtn.disabled = true;

      // Simulated submission
      setTimeout(() => {
        showSuccessMessage();
      }, 1500);
    });

    function validateForm() {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      form.querySelectorAll('.error-message').forEach(msg => msg.remove());

      requiredFields.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          const errMsg = document.createElement('span');
          errMsg.className = 'error-message';
          errMsg.textContent = 'This field is required';
          field.parentNode.appendChild(errMsg);
        }
      });

      const emailField = form.querySelector('#email');
      if (emailField && !isValidEmail(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
        const errMsg = document.createElement('span');
        errMsg.className = 'error-message';
        errMsg.textContent = 'Please enter a valid email address';
        emailField.parentNode.appendChild(errMsg);
      }
      return isValid;
    }

    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    function showSuccessMessage() {
      const formGrid = form.querySelector('.form-grid');
      formGrid.style.opacity = '0';
      setTimeout(() => {
        formGrid.innerHTML = `
          <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Thank you for your inquiry!</h3>
            <p>We will contact you within 24 hours to arrange your venue viewing.</p>
            <button type="button" class="btn btn-primary close-success">Close</button>
          </div>
        `;
        formGrid.style.opacity = '1';

        formGrid.querySelector('.close-success').addEventListener('click', () => {
          // close modal
          const closeX = modal.querySelector('.close-modal');
          if (closeX) closeX.click();
        });
      }, 300);
    }
  }
}

/* --------------------------------------
   5) Virtual Tours with 360° Panorama
--------------------------------------- */
function initVirtualTours() {
  try {
    // Get references to modal elements
    const tourModal = document.getElementById('tourModal');
    const tourContainer = document.getElementById('tourContainer');
    const closeButton = tourModal.querySelector('.close-modal');
    
    // Get all virtual tour buttons (improved selector)
    const tourButtons = document.querySelectorAll('.view-360, [data-venue]');
    
    Debug.info('VIRTUAL_TOURS', `Found ${tourButtons.length} tour buttons`);
    
    // Ensure proper elements exist
    if (!tourModal || !tourContainer) {
      Debug.error('VIRTUAL_TOURS', 'Tour modal or container not found');
      return;
    }
    
    // Add touch-friendly class to body when on touchscreen devices
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      document.body.classList.add('touch-device');
    }
    
    // Function to open virtual tour
    function openVirtualTour(venueId) {
      // Show loading indicator
      tourContainer.innerHTML = '<div class="tour-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading virtual tour...</p></div>';
      
      // Show modal
      showTourModal();
      
      console.log(`Opening virtual tour for venue ID: ${venueId}`);
      
      // Find the venue data from our venues array
      const venue = venueMarkers.find(venue => venue.id === venueId);
      
      if (!venue) {
        console.error(`Could not find venue data for ID: ${venueId}`);
        showTourError(venueId, null, 'Could not find venue information.');
        return;
      }
      
      const venueName = venue.name;
      const venueAddress = venue.address || '';
      const venuePlaceId = venue.placeId;
          
      console.log(`Venue Name: ${venueName}, Address: ${venueAddress}, Place ID: ${venuePlaceId}`);
      
      // Update modal title
      tourModal.querySelector('h2').textContent = `${venue ? venue.name : 'Venue'} Virtual Tour`;
      
      // Create tour tabs container for dual-view system
      createTourTabs(venueId, venue);
      
      // Default to showing Street View first
      showStreetView(venueId, venueName, venueAddress, venuePlaceId);
    }
    
    // Create tour tabs for switching between exterior and interior views
    function createTourTabs(venueId, venue) {
      // Create tabs container if it doesn't exist
      if (!tourModal.querySelector('.tour-tabs')) {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tour-tabs';
        tabsContainer.innerHTML = `
          <button class="tab-btn active" data-view="exterior">View Surroundings</button>
          <button class="tab-btn" data-view="interior">View Interior</button>
        `;
        
        // Insert tabs after the header
        const header = tourModal.querySelector('.modal-header');
        header.parentNode.insertBefore(tabsContainer, header.nextSibling);
        
        // Add event listeners to tabs
        tabsContainer.querySelectorAll('.tab-btn').forEach(button => {
          button.addEventListener('click', () => {
            // Toggle active state
            tabsContainer.querySelectorAll('.tab-btn').forEach(btn => 
              btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected view
            const view = button.dataset.view;
            
            if (view === 'exterior') {
              // Use existing openVirtualTour implementation for exterior view
              showTourLoading();
              tryLoadStreetView(venueId, venue);
            } else {
              // Show interior gallery view
              showInteriorView(venueId, venue);
            }
          });
        });
      }
    }
    
    // Show loading indicator
    function showTourLoading() {
      tourContainer.innerHTML = `
        <div class="tour-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading virtual tour...</p>
        </div>
      `;
    }
    
    // Show interior view with gallery of photos
    function showInteriorView(venueId, venue) {
      showTourLoading();
      console.log(`Loading interior view for ${venue ? venue.name : venueId}`);
      
      if (!venue || !venue.placeId) {
        showInteriorUnavailableMessage(venue ? venue.name : 'this venue');
        return;
      }
      
      // Try to get photos from Google Places API
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));
      
      placesService.getDetails({
        placeId: venue.placeId,
        fields: ['name', 'photos', 'geometry', 'formatted_address', 'url']
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.photos && place.photos.length > 0) {
          // Found photos, show gallery
          showPlacePhotoGallery(place);
        } else {
          // No photos found, show fallback
          showBeautifulFallback(venue, tourContainer);
        }
      });
    }
    
    // Show photo gallery for interior view
    function showPlacePhotoGallery(placeDetails) {
      if (!placeDetails.photos || placeDetails.photos.length === 0) {
        showInteriorUnavailableMessage(placeDetails.name);
        return;
      }
      
      console.log(`Showing photo gallery for ${placeDetails.name} with ${placeDetails.photos.length} photos`);
      
      // Create gallery container with main image and thumbnails
      const galleryHtml = `
        <div class="interior-gallery">
          <div class="gallery-main">
            <img src="${placeDetails.photos[0].getUrl({maxWidth: 1200, maxHeight: 800})}" 
                alt="${placeDetails.name} interior">
          </div>
          <div class="gallery-thumbs">
            ${placeDetails.photos.slice(0, 8).map((photo, index) => `
              <img src="${photo.getUrl({maxWidth: 100, maxHeight: 100})}" 
                  alt="Interior view ${index + 1}" 
                  data-index="${index}"
                  class="${index === 0 ? 'active' : ''}">
            `).join('')}
          </div>
          <div class="gallery-controls">
            <button class="gallery-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
            <span class="gallery-count">1 / ${Math.min(placeDetails.photos.length, 8)}</span>
            <button class="gallery-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
          </div>
          <a href="${placeDetails.url}" target="_blank" class="view-on-google">
            View on Google Maps <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      `;
      
      tourContainer.innerHTML = galleryHtml;
      
      // Add event listeners for gallery navigation
      let currentIndex = 0;
      const mainImg = tourContainer.querySelector('.gallery-main img');
      const thumbs = tourContainer.querySelectorAll('.gallery-thumbs img');
      const count = tourContainer.querySelector('.gallery-count');
      
      // Thumbnail click
      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          currentIndex = parseInt(thumb.dataset.index);
          updateGallery();
        });
      });
      
      // Next/prev buttons
      tourContainer.querySelector('.gallery-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % thumbs.length;
        updateGallery();
      });
      
      tourContainer.querySelector('.gallery-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
        updateGallery();
      });
      
      function updateGallery() {
        // Update main image
        mainImg.src = placeDetails.photos[currentIndex].getUrl({maxWidth: 1200, maxHeight: 800});
        
        // Update active thumbnail
        thumbs.forEach((thumb, i) => {
          thumb.classList.toggle('active', i === currentIndex);
        });
        
        // Update counter
        count.textContent = `${currentIndex + 1} / ${thumbs.length}`;
      }
    }
    
    // Show beautiful fallback when no interior photos available
    function showBeautifulFallback(venue, container) {
      // Create a beautiful fallback with venue image and options
      let mapUrl = 'https://www.google.com/maps';
      if (venue && venue.coordinates) {
        mapUrl = `https://www.google.com/maps?q=${venue.coordinates.lat},${venue.coordinates.lng}`;
      } else if (venue && venue.name) {
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}`;
      }
      
      container.innerHTML = `
        <div class="tour-error">
          <h3>Experience ${venue.name}</h3>
          <div class="fallback-image">
            <img src="${venue.image}" alt="${venue.name}">
          </div>
          <p>We have beautiful images of ${venue.name} available in our gallery. Browse our venue details for more information.</p>
          <div>
            <a href="${mapUrl}" target="_blank" class="btn btn-secondary">
              <i class="fas fa-map-marker-alt"></i> View on Map
            </a>
            <a href="${venue.url}" class="btn btn-primary">
              <i class="fas fa-info-circle"></i> Venue Details
            </a>
          </div>
        </div>
      `;
    }
    
    // Show message when interior view is unavailable
    function showInteriorUnavailableMessage(venueName) {
      tourContainer.innerHTML = `
        <div class="tour-error">
          <p>Interior tour for ${venueName} is not currently available.</p>
          <p>We're working with the venue to add interior imagery soon.</p>
          <button class="btn btn-primary switch-to-exterior">View Surroundings Instead</button>
        </div>
      `;
      
      // Add event listener to switch back to exterior view
      tourContainer.querySelector('.switch-to-exterior').addEventListener('click', () => {
        // Switch to exterior tab
        const exteriorTab = tourModal.querySelector('.tab-btn[data-view="exterior"]');
        if (exteriorTab) exteriorTab.click();
      });
    }
    
    // Try to load Street View - connect to existing functionality
    function tryLoadStreetView(venueId, venue) {
      // Reuse the existing implementation by calling directly with venueId
      if (typeof openVirtualTour === 'function' && venueId) {
        openVirtualTour(venueId);
      } else if (venue) {
        // Fallback to showTourError
        showTourError(venueId, venue, 'Could not load Street View');
      }
    }
    
    // Show Street View (exterior/surroundings)
    function showStreetView(venueId, venueName, venueAddress, placeId) {
      // Show loading indicator
      tourContainer.innerHTML = '<div class="tour-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading street view...</p></div>';
      
      console.log(`Showing street view for venue: ${venueName}, Place ID: ${placeId}`);
      
      // First try to use the place ID for direct location
      if (placeId) {
        getPlaceDetailsAndInitializeStreetView(placeId, venueName);
      } else {
        // Use coordinates as fallback
        const venue = venueMarkers.find(v => v.id === venueId);
        if (venue && venue.coordinates) {
          console.log(`Using coordinates for ${venueName}`, venue.coordinates);
          checkStreetViewAndInitialize({
            geometry: {
              location: new google.maps.LatLng(venue.coordinates.lat, venue.coordinates.lng)
            },
            name: venueName,
            formatted_address: venueAddress || "Rocky Mountains, Canada"
          });
        } else {
          // Last resort: try to find venue location using geocoding
          geocodeAddress(venueAddress, venueName);
        }
      }
    }
    
    // Get place details using place ID and initialize Street View
    function getPlaceDetailsAndInitializeStreetView(placeId, venueName) {
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));
      
      placesService.getDetails({
        placeId: placeId,
        fields: ['name', 'geometry', 'formatted_address']
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          console.log(`Successfully retrieved place details for ${venueName}:`, place);
          checkStreetViewAndInitialize(place);
        } else {
          console.error(`Error getting place details for ${venueName}: ${status}`);
          // Fall back to venue marker data
          const venueData = venueMarkers.find(venue => venue.name === venueName);
          if (venueData && venueData.coordinates) {
            console.log(`Using fallback coordinates for ${venueName}`, venueData.coordinates);
            checkStreetViewAndInitialize({
              geometry: {
                location: new google.maps.LatLng(
                  venueData.coordinates.lat, 
                  venueData.coordinates.lng
                )
              },
              name: venueName,
              formatted_address: venueData.address || "Rocky Mountains, Canada"
            });
          } else {
            showTourError(null, {name: venueName}, `We couldn't find ${venueName}'s location. Please try viewing our interactive map for more information.`);
          }
        }
      });
    }
    
    // Check if interior Street View is available
    function checkForInteriorStreetView(placeId, venueName) {
      try {
        const venue = venueMarkers.find(v => v.name === venueName || v.placeId === placeId);
        if (!venue || !venue.coordinates) {
          showInteriorUnavailableMessage(venueName);
          return;
        }
        
        const streetViewService = new google.maps.StreetViewService();
        
        streetViewService.getPanorama({
          location: venue.coordinates,
          radius: 50,
          source: google.maps.StreetViewSource.DEFAULT // This includes indoor panoramas
        }, (data, status) => {
          if (status === "OK") {
            initInteriorStreetView(data, venueName);
          } else {
            // Fallback to beautiful display
            const venue = venueMarkers.find(v => v.name === venueName);
            if (venue) {
              showBeautifulFallback(venue, tourContainer);
            } else {
              showInteriorUnavailableMessage(venueName);
            }
          }
        });
      } catch (error) {
        console.error("Error checking for interior Street View:", error);
        showInteriorUnavailableMessage(venueName);
      }
    }
    
    // Initialize Street View for interiors
    function initInteriorStreetView(data, venueName) {
      try {
        const panorama = new google.maps.StreetViewPanorama(
          tourContainer,
          {
            pano: data.location.pano,
            pov: {
              heading: 0,
              pitch: 0
            },
            zoom: 1,
            addressControl: false,
            linksControl: true,
            panControl: true,
            enableCloseButton: false,
            fullscreenControl: true,
            zoomControl: true,
            visible: true
          }
        );
        
        // Add info panel with proper attribution
        addInfoPanel(venueName, 'interior', 'Google Street View interior tour. ' +
          'Navigate through the venue with the arrow links.');
        
      } catch (error) {
        console.error("Error initializing interior Street View:", error);
        showInteriorUnavailableMessage(venueName);
      }
    }
    
    // Check if Street View is available and initialize
    function checkStreetViewAndInitialize(place) {
      if (!place || !place.geometry || !place.geometry.location) {
        showTourError(null, null, "Could not find venue location data.");
        return;
      }
      
      console.log(`Checking Street View for ${place.name || 'venue'}`);
      
      try {
        const streetViewService = new google.maps.StreetViewService();
        const location = place.geometry.location;
        
        streetViewService.getPanorama({
          location: location,
          radius: 100,
          source: google.maps.StreetViewSource.OUTDOOR
        }, (data, status) => {
          if (status === "OK" && data) {
            console.log("Street View panorama found:", data);
            initStreetViewPanorama(place, data);
          } else {
            console.log("No Street View found, falling back to map view");
            initSimplifiedMapView(place);
          }
        });
      } catch (error) {
        console.error("Error checking for Street View:", error);
        initSimplifiedMapView(place);
      }
    }
    
    function initStreetViewPanorama(place, streetViewData) {
      try {
        // Clear previous content
        tourContainer.innerHTML = '';
        
        const panorama = new google.maps.StreetViewPanorama(
          tourContainer,
          {
            position: streetViewData.location.latLng,
            pov: {
              heading: streetViewData.tiles.centerHeading,
              pitch: 0
            },
            zoom: 1,
            addressControl: false,
            linksControl: true,
            panControl: true,
            enableCloseButton: false,
            fullscreenControl: true,
            visible: true
          }
        );
        
        // Add info panel with proper attribution
        addInfoPanel(place.name, 'exterior', 'Google Street View. You can drag to look around and click arrows to move.');
        
        console.log("Street View panorama initialized");
      } catch (error) {
        console.error("Error initializing Street View:", error);
        initSimplifiedMapView(place);
      }
    }
    
    // Initialize simplified map view when Street View is not available
    function initSimplifiedMapView(place) {
      try {
        // Clear previous content
        tourContainer.innerHTML = '';
        
        const map = new google.maps.Map(
          tourContainer,
          {
            center: place.geometry.location,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.SATELLITE || 'satellite',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true
          }
        );
        
        // Add a marker at the venue location
        new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          title: place.name
        });
        
        // Add info panel with proper attribution
        addInfoPanel(place.name, 'map', 'Satellite map view. Street View is not available for this location.');
        
        console.log("Simplified map view initialized");
      } catch (error) {
        console.error("Error initializing simplified map view:", error);
        showTourError(null, null, "Could not load map view. Please try again later.");
      }
    }
    
    // Geocode address as fallback
    function geocodeAddress(address, venueName) {
      console.log(`Geocoding address: ${address}`);
      
      try {
        // Find venue in our data first
        const venueData = venueMarkers.find(venue => 
          venue.name === venueName || 
          (venue.address && venue.address.includes(address))
        );
        
        if (venueData && venueData.coordinates) {
          console.log(`Found venue coordinates in our data for ${venueName}`, venueData.coordinates);
          const location = {
            geometry: {
              location: new google.maps.LatLng(venueData.coordinates.lat, venueData.coordinates.lng)
            },
            name: venueName,
            formatted_address: venueData.address || address
          };
          checkStreetViewAndInitialize(location);
          return;
        }
        
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
          console.log(`Geocoding response:`, status, results);
          
          if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
            const location = {
              geometry: {
                location: results[0].geometry.location
              },
              name: venueName,
              formatted_address: results[0].formatted_address
            };
            checkStreetViewAndInitialize(location);
          } else {
            console.error(`Geocoding failed for ${address}`);
            showTourError(null, null, `We couldn't find this venue's location. Please try viewing our interactive map for more information.`);
          }
        });
      } catch (error) {
        console.error("Error in Geocoding API call:", error);
        showTourError(null, null, "There was an error finding the venue location. Please try again later.");
      }
    }
    
    // Add info panel to the tour
    function addInfoPanel(venueName, viewType, description = '') {
      // Create info panel element
      const infoPanel = document.createElement('div');
      infoPanel.className = 'tour-info';
      
      if (viewType === 'exterior') {
        infoPanel.innerHTML = `
          <h4>${venueName}</h4>
          <p>Use your mouse or touch to look around the venue surroundings.</p>
          <p>Click on arrows to navigate to nearby areas.</p>
          <p>Click the fullscreen button for the best experience.</p>
        `;
      } else {
        infoPanel.innerHTML = `
          <h4>${venueName}</h4>
          <p>${description || 'Explore the interior of this beautiful venue.'}</p>
          <p>Use your mouse or touch to look around the space.</p>
          <p>Click on hotspots to view different areas.</p>
        `;
      }
      
      // Add to container
      tourContainer.appendChild(infoPanel);
      
      // Add style for the info panel if not already present
      if (!document.querySelector('#tour-info-style')) {
        const style = document.createElement('style');
        style.id = 'tour-info-style';
        style.textContent = `
          .tour-info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px;
            border-radius: 8px;
            max-width: 300px;
            z-index: 100;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          }
          .tour-info h4 {
            margin-top: 0;
            margin-bottom: 8px;
          }
          .tour-info p {
            margin: 5px 0;
          }
          
          .tour-tabs {
            display: flex;
            background: #f8f8f8;
            border-bottom: 1px solid #ddd;
            padding: 0 20px;
          }
          .tour-tabs .tab-btn {
            padding: 12px 20px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-weight: 500;
            color: #555;
          }
          .tour-tabs .tab-btn.active {
            border-bottom-color: #3498db;
            color: #3498db;
          }
          
          .interior-gallery {
            height: 100%;
            display: flex;
            flex-direction: column;
            background: #f8f8f8;
          }
          .gallery-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            overflow: hidden;
          }
          .gallery-main img {
            max-width: 100%;
            max-height: 100%;
            transition: opacity 0.3s;
          }
          .gallery-thumbs {
            display: flex;
            padding: 10px;
            gap: 10px;
            background: #222;
            overflow-x: auto;
          }
          .gallery-thumbs img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border: 2px solid transparent;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.2s;
          }
          .gallery-thumbs img.active {
            border-color: #3498db;
            opacity: 1;
          }
          .gallery-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            gap: 15px;
            background: #333;
            color: white;
          }
          .gallery-controls button {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 5px 10px;
          }
          .gallery-count {
            font-size: 14px;
          }
          .view-on-google {
            padding: 10px;
            text-align: center;
            background: #222;
            color: white;
            text-decoration: none;
            font-size: 14px;
          }
          .view-on-google:hover {
            background: #333;
          }
        `;
        document.head.appendChild(style);
      }
    }
        
    // Add active class to make buttons more visually prominent on mobile
    tourButtons.forEach(button => {
      button.classList.add('virtual-tour-active');
    });
        
    // Set up event listeners for all tour buttons using both click and touch events
    tourButtons.forEach(button => {
      // Remove any existing event listeners
      button.removeEventListener('click', handleVirtualTourButtonClick);
      
      // Add a more reliable event listener
      button.addEventListener('click', handleVirtualTourButtonClick);
      
      // Add touch-specific handling for mobile
      if ('ontouchstart' in window) {
        button.addEventListener('touchstart', function() {
          this.classList.add('touched');
        }, { passive: true });
        
        button.addEventListener('touchend', handleVirtualTourButtonTouchEnd, { passive: false });
      }
    });
    
    function handleVirtualTourButtonClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const venueId = this.dataset.venue || this.getAttribute('data-venue');
      Debug.info('TOUR_BUTTON', `Virtual tour button clicked for venue ID: ${venueId}`);
      
      if (venueId) {
        openVirtualTour(venueId);
      } else {
        Debug.error('TOUR_BUTTON', 'No venue ID specified for tour button');
        showTourError(null, null, 'Could not determine which venue to show.');
      }
    }
    
    function handleVirtualTourButtonTouchEnd(e) {
      e.preventDefault();
      
      const venueId = this.dataset.venue || this.getAttribute('data-venue');
      Debug.info('TOUR_BUTTON', `Virtual tour button touched for venue ID: ${venueId}`);
      
      // Remove the touched class
      this.classList.remove('touched');
      
      if (venueId) {
        openVirtualTour(venueId);
      } else {
        Debug.error('TOUR_BUTTON', 'No venue ID specified for tour button');
        showTourError(null, null, 'Could not determine which venue to show.');
      }
    }
    
    // Set up close button functionality with improved mobile support
    if (closeButton) {
      closeButton.removeEventListener('click', closeTourModal);
      closeButton.addEventListener('click', closeTourModal);
      
      if ('ontouchstart' in window) {
        closeButton.addEventListener('touchend', function(e) {
          e.preventDefault();
          closeTourModal();
        }, { passive: false });
      }
    }
    
    // Close tour modal when clicking outside of it or with ESC key
    tourModal.removeEventListener('click', handleModalBackgroundClick);
    tourModal.addEventListener('click', handleModalBackgroundClick);
    
    function handleModalBackgroundClick(e) {
      // Only close if clicking directly on the background modal element
      if (e.target === tourModal) {
        closeTourModal();
      }
    }
    
    document.removeEventListener('keydown', handleEscapeKeyPress);
    document.addEventListener('keydown', handleEscapeKeyPress);
    
    function handleEscapeKeyPress(e) {
      if (e.key === 'Escape' && tourModal.classList.contains('active')) {
        closeTourModal();
      }
    }
    
    // Function to show modal with mobile-friendly adjustments
    function showTourModal() {
      document.body.classList.add('modal-open');
      tourModal.classList.add('active');
      
      // Use requestAnimationFrame for smoother animation, especially on mobile
      requestAnimationFrame(() => {
        setTimeout(() => {
          tourModal.querySelector('.modal-content').classList.add('modal-animate');
        }, 50);
      });
      
      document.body.style.overflow = 'hidden';
      
      // On mobile, ensure scroll position is maintained
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }
    
    // Close modal with proper mobile cleanup
    function closeTourModal() {
      const modalContent = tourModal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.classList.remove('modal-animate');
      }
      
      // Use a short timeout for the animation to complete
      setTimeout(() => {
        tourModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Restore scroll position on mobile
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        
        // Reset tour container content
        setTimeout(() => {
          if (!tourModal.classList.contains('active')) {
            tourContainer.innerHTML = '';
          }
        }, 300);
      }, 200);
    }
    
    // Function to show error
    function showTourError(venueId, venue = null, errorReason = 'Street View data is not available') {
      let mapUrl = 'https://www.google.com/maps';
      if (venue) {
        if (venue.coordinates && venue.coordinates.lat) {
          const lat = venue.coordinates.lat;
          const lng = venue.coordinates.lng;
          mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=18&layer=c`;
        } else if (venue.name) {
          mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}`;
        }
      } else if (venueId) {
        // Try to find the venue by ID if not provided
        const foundVenue = venueMarkers.find(marker => marker.id === venueId);
        if (foundVenue && foundVenue.coordinates) {
          const lat = foundVenue.coordinates.lat;
          const lng = foundVenue.coordinates.lng;
          mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=18&layer=c`;
        }
      }
      
      console.warn(`Showing error/fallback UI for ${venue ? venue.name : venueId}: ${errorReason}`);
      
      // Display an attractive fallback with venue image and map link
      tourContainer.innerHTML = `
        <div class="tour-error">
          <h3>Virtual Tour Unavailable</h3>
          ${venue && venue.image ? `<img src="${venue.image}" alt="${venue.name}" class="tour-fallback-image">` : ''}
          <p>Street View for <strong>${venue ? venue.name : venueId}</strong> is not available at this moment.</p>
          <p class="error-details"><small>Reason: ${errorReason}</small></p>
          <div class="tour-buttons">
            <a href="${mapUrl}" target="_blank" class="btn btn-primary">
              <i class="fas fa-map-marked-alt"></i> View on Google Maps
            </a>
            ${venue && venue.url ? `
              <button class="btn btn-secondary" id="viewVenueDetails">
                <i class="fas fa-info-circle"></i> View Venue Details
              </button>
            ` : ''}
          </div>
        </div>
      `;
      
      // Add CSS to make the fallback look nicer
      if (!document.querySelector('#tour-error-style')) {
        const style = document.createElement('style');
        style.id = 'tour-error-style';
        style.textContent = `
          .tour-error { text-align: center; padding: 20px; }
          .tour-fallback-image { max-width: 100%; border-radius: 8px; margin: 15px 0; max-height: 300px; object-fit: cover; }
          .tour-buttons { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
          .error-details { color: #777; font-style: italic; margin-bottom: 15px; }
        `;
        document.head.appendChild(style);
      }
      
      // Add event handler for the View Venue Details button
      const viewVenueDetailsBtn = document.getElementById('viewVenueDetails');
      if (viewVenueDetailsBtn && venue && venue.url) {
        viewVenueDetailsBtn.addEventListener('click', () => {
          closeTourModal();
          const venueElement = document.querySelector(venue.url);
          if (venueElement) {
            venueElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.warn(`Could not find element for selector: ${venue.url}`);
            // Fallback to the venues section
            document.querySelector('#banff-venues')?.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    }
    
  } catch (error) {
    Debug.error('VIRTUAL_TOURS', 'Error initializing virtual tours', error);
  }
}

// Add CSS rules for better mobile experience
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Make tour buttons more tappable on mobile */
    .touch-device .view-360 {
      padding: 12px 16px;
      min-height: 44px;
      position: relative;
    }
    
    /* Visual feedback for touched buttons */
    .view-360.touched {
      background-color: #d0a85c !important;
      transform: scale(0.98);
    }
    
    /* Ensure modal is properly sized on mobile */
    @media (max-width: 767px) {
      #tourModal .modal-content {
        width: 95%;
        max-width: 95%;
        height: auto;
        max-height: 90vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Increase size of close button for easier tapping */
      #tourModal .close-modal {
        font-size: 32px;
        padding: 8px;
        right: 10px;
        top: 10px;
      }
      
      /* Improve tour tab buttons on mobile */
      .tour-tabs .tab-btn {
        padding: 12px;
        min-height: 44px;
      }
    }
  `;
  document.head.appendChild(style);
});

/* --------------------------------------
   6) Venue Comparison Tool
--------------------------------------- */
function initVenueComparison() {
  const comparisonTable = document.querySelector('.comparison-table');
  const comparisonPlaceholder = document.querySelector('.comparison-placeholder');
  const venueSelector = document.getElementById('venueSelector');
  const addVenueBtn = document.getElementById('addVenueBtn');
  const resetCompareBtn = document.getElementById('resetCompareBtn');
  if (!comparisonTable || !venueSelector || !addVenueBtn) return;

  // This data matches your "select" <option> values (like 'banff-springs', etc.).
  
  const venueData = {
    'banff-springs': {
      name: 'Fairmont Banff Springs',
      location: 'Banff',
      capacity: '10-800 guests',
      priceRange: '$$$-$$$$',
      priceValue: 4,
      indoorOutdoor: 'Both',
      accommodation: 'On-site (757 rooms)',
      accommodationValue: 5,
      catering: 'In-house only',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#banff-venues',
      image: 'assets/images/venues/banff-springs-main.jpg',
      features: ['Historic Castle', 'Mountain Views', 'Multiple Ceremony Sites', 'Luxury Accommodations'],
      rating: 4.9
    },
    'tunnel-mountain': {
      name: 'Tunnel Mountain Reservoir',
      location: 'Banff',
      capacity: 'Up to 100 guests',
      priceRange: '$-$$',
      priceValue: 1.5,
      indoorOutdoor: 'Outdoor only',
      accommodation: 'Nearby hotels',
      accommodationValue: 2,
      catering: 'External vendors',
      seasonalAvailability: 'May-October',
      viewDetailsLink: '#banff-venues',
      image: 'assets/images/venues/tunnel-mountain-main.jpg',
      features: ['Outdoor Ceremony', 'Mountain Views', 'Natural Setting', 'Photography Paradise'],
      rating: 4.7
    },
    'the-gem': {
      name: 'The Gem',
      location: 'Bighorn No. 8, Alberta',
      capacity: '20-150 guests',
      priceRange: '$$$-$$$$',
      priceValue: 4,
      indoorOutdoor: 'Both',
      accommodation: 'Nearby options',
      accommodationValue: 3,
      catering: 'Preferred vendors',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#banff-venues',
      image: 'assets/images/venues/the-gem-main.jpg',
      features: ['Mountain Views', 'Elegant Setting', 'Intimate Ceremonies', 'Modern Amenities'],
      rating: 4.8
    },
    'sky-bistro': {
      name: 'Sky Bistro, Gondola',
      location: 'Banff, Alberta',
      capacity: '20-200 guests',
      priceRange: '$$$-$$$$',
      priceValue: 4,
      indoorOutdoor: 'Both',
      accommodation: 'Downtown Banff hotels',
      accommodationValue: 3,
      catering: 'In-house only',
      seasonalAvailability: 'Year-round (weather dependent)',
      viewDetailsLink: '#banff-venues',
      image: 'assets/images/venues/sky-bistro-main.jpg',
      features: ['Mountaintop Location', 'Panoramic Views', 'Gondola Access', 'Fine Dining'],
      rating: 4.9
    },
    'maple-leaf': {
      name: 'The Maple Leaf',
      location: 'Banff, Alberta',
      capacity: '10-80 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Indoor',
      accommodation: 'Downtown Banff hotels',
      accommodationValue: 3,
      catering: 'In-house only',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#banff-venues',
      image: 'assets/images/venues/maple-leaf-main.jpg',
      features: ['Downtown Location', 'Fine Dining', 'Intimate Setting', 'Canadian Cuisine'],
      rating: 4.6
    },
    'mt-norquay': {
      name: 'Mt. Norquay',
      location: 'Banff, Alberta',
      capacity: '50-200 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Both',
      accommodation: 'Banff hotels',
      accommodationValue: 3,
      catering: 'In-house',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#banff-venues',
      image: 'assets/images/venues/mt-norquay-main.jpg',
      features: ['Mountain Resort', 'Scenic Views', 'Rustic Lodge', 'Outdoor Ceremonies'],
      rating: 4.7
    },
    'three-bears': {
      name: 'Three Bears Brewery',
      location: 'Banff, Alberta',
      capacity: '30-150 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Indoor',
      accommodation: 'Downtown Banff hotels',
      accommodationValue: 3,
      catering: 'In-house',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#banff-venues',
      image: 'assets/images/venues/three-bears-main.jpg',
      features: ['Brewery Setting', 'Urban Rustic', 'Craft Beer', 'Downtown Location'],
      rating: 4.5
    },
    'mainspace-solara': {
      name: 'Mainspace Solara',
      location: 'Canmore, Alberta',
      capacity: '20-250 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Indoor',
      accommodation: 'On-site condos',
      accommodationValue: 4,
      catering: 'External vendors',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#canmore-venues',
      image: 'assets/images/venues/mainspace-solara-main.jpg',
      features: ['Contemporary Space', 'Flexible Layout', 'Mountain Views', 'Modern Amenities'],
      rating: 4.6
    },
    'stewart-creek': {
      name: 'Stewart Creek Golf Course',
      location: 'Canmore, Alberta',
      capacity: '20-180 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Both',
      accommodation: 'Nearby options',
      accommodationValue: 2,
      catering: 'In-house',
      seasonalAvailability: 'May-October',
      viewDetailsLink: '#canmore-venues',
      image: 'assets/images/venues/stewart-creek-main.jpg',
      features: ['Golf Course', 'Mountain Views', 'Modern Clubhouse', 'Outdoor Terrace'],
      rating: 4.7
    },
    'silvertip': {
      name: 'Silvertip Resort',
      location: 'Canmore, Alberta',
      capacity: '20-250 guests',
      priceRange: '$$$-$$$$',
      priceValue: 4,
      indoorOutdoor: 'Both',
      accommodation: 'Nearby options',
      accommodationValue: 3,
      catering: 'In-house',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#canmore-venues',
      image: 'assets/images/venues/silvertip-main.jpg',
      features: ['Golf Resort', 'Mountain Views', 'Indoor & Outdoor Options', 'Luxury Experience'],
      rating: 4.8
    },
    'malcolm-hotel': {
      name: 'The Malcolm Hotel',
      location: 'Canmore, Alberta',
      capacity: '30-200 guests',
      priceRange: '$$$-$$$$',
      priceValue: 4,
      indoorOutdoor: 'Both',
      accommodation: 'On-site (124 rooms)',
      accommodationValue: 5,
      catering: 'In-house',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#canmore-venues',
      image: 'assets/images/venues/malcolm-hotel-main.jpg',
      features: ['Luxury Hotel', 'Ballroom Setting', 'Scottish Heritage', 'Downtown Location'],
      rating: 4.8
    },
    'creekside-villa': {
      name: 'Creekside Villa',
      location: 'Canmore, Alberta',
      capacity: '10-120 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Both',
      accommodation: 'Limited on-site',
      accommodationValue: 2,
      catering: 'In-house',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#canmore-venues',
      image: 'assets/images/venues/creekside-villa-main.jpg',
      features: ['Boutique Venue', 'Creekside Setting', 'Intimate Atmosphere', 'Mountain Views'],
      rating: 4.7
    },
    'finchys': {
      name: "Finchy's @CanGOLF",
      location: 'Canmore, Alberta',
      capacity: '20-100 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Indoor',
      accommodation: 'Nearby options',
      accommodationValue: 2,
      catering: 'External options',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#canmore-venues',
      image: 'assets/images/venues/finchys-main.jpg',
      features: ['Golf Simulator', 'Casual Setting', 'Unique Experience', 'Entertainment Options'],
      rating: 4.3
    },
    'chateau-louise': {
      name: 'Fairmont Chateau Lake Louise',
      location: 'Lake Louise, Alberta',
      capacity: '10-550 guests',
      priceRange: '$$$-$$$$',
      priceValue: 4.5,
      indoorOutdoor: 'Both',
      accommodation: 'On-site (539 rooms)',
      accommodationValue: 5,
      catering: 'In-house only',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#lake-louise-venues',
      image: 'assets/images/venues/lake-louise-main.jpg',
      features: ['Iconic Location', 'Lakeside Ceremonies', 'Historic Hotel', 'Luxury Experience'],
      rating: 5.0
    },
    'kicking-horse': {
      name: 'Kicking Horse Resort',
      location: 'Golden, British Columbia',
      capacity: '20-200 guests',
      priceRange: '$$$-$$$$',
      priceValue: 3.5,
      indoorOutdoor: 'Both',
      accommodation: 'On-site lodge and condos',
      accommodationValue: 4,
      catering: 'In-house',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#golden-venues',
      image: 'assets/images/venues/kicking-horse-main.jpg',
      features: ['Mountain Resort', 'Panoramic Views', 'Gondola Access', 'Luxury Experience'],
      rating: 4.8
    },
    'hillside-lodge': {
      name: 'Hillside Lodge & Chalets',
      location: 'Golden, British Columbia',
      capacity: '10-60 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Both',
      accommodation: 'On-site chalets',
      accommodationValue: 4,
      catering: 'External vendors',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#golden-venues',
      image: 'assets/images/venues/hillside-lodge-main.jpg',
      features: ['Rustic Lodge', 'Private Chalets', 'Forest Setting', 'Intimate Weddings'],
      rating: 4.6
    },
    'emerald-lake': {
      name: 'Emerald Lake Lodge',
      location: 'Field, British Columbia',
      capacity: '10-88 guests',
      priceRange: '$$$-$$$$',
      priceValue: 4,
      indoorOutdoor: 'Both',
      accommodation: 'On-site cabins',
      accommodationValue: 4.5,
      catering: 'In-house only',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#emerald-lake-venues',
      image: 'assets/images/venues/emerald-lake-main.jpg',
      features: ['Secluded Location', 'Emerald Waters', 'Intimate Setting', 'Mountain Backdrop'],
      rating: 4.9
    },
    'pyramid-lake': {
      name: 'Pyramid Lake Lodge',
      location: 'Jasper, Alberta',
      capacity: '10-120 guests',
      priceRange: '$$$-$$$$',
      priceValue: 3.5,
      indoorOutdoor: 'Both',
      accommodation: 'On-site lodge',
      accommodationValue: 4,
      catering: 'In-house',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#jasper-venues',
      image: 'assets/images/venues/pyramid-lake-main.jpg',
      features: ['Lakeside Setting', 'Private Island', 'Mountain Views', 'Intimate Setting'],
      rating: 4.7
    },
    'maligne-lake': {
      name: 'Maligne Lake Chalet',
      location: 'Jasper, Alberta',
      capacity: '10-80 guests',
      priceRange: '$$$',
      priceValue: 3,
      indoorOutdoor: 'Both',
      accommodation: 'Jasper town accommodations',
      accommodationValue: 2,
      catering: 'Limited in-house options',
      seasonalAvailability: 'May-October',
      viewDetailsLink: '#jasper-venues',
      image: 'assets/images/venues/maligne-lake-main.jpg',
      features: ['Historic Property', 'Lakeside Setting', 'Wilderness Experience', 'Exclusive Use'],
      rating: 4.7
    },
    'cochrane-ranchehouse': {
      name: 'Cochrane RancheHouse',
      location: 'Cochrane, Alberta',
      capacity: '20-320 guests',
      priceRange: '$$-$$$',
      priceValue: 2.5,
      indoorOutdoor: 'Both',
      accommodation: 'Nearby hotels',
      accommodationValue: 2,
      catering: 'In-house and external options',
      seasonalAvailability: 'Year-round',
      viewDetailsLink: '#cochrane-venues',
      image: 'assets/images/venues/cochrane-ranchehouse-main.jpg',
      features: ['Mountain Views', 'Rustic Elegance', 'Indoor & Outdoor Options', 'Historical Setting'],
      rating: 4.6
    }
    // Add more for each <option> in the <select>...
  };

  let comparedVenues = [];

  const comparisonCards = document.createElement('div');
  comparisonCards.className = 'comparison-cards';
  comparisonTable.appendChild(comparisonCards);
  
  // Dynamically populate the venue selector dropdown with all venues grouped by region
  function populateVenueSelector() {
    // Group venues by region for the dropdown
    const venues = {};
    
    // Extract region information from venueMarkers
    venueMarkers.forEach(marker => {
      const region = marker.region;
      if (!venues[region]) {
        venues[region] = [];
      }
      venues[region].push({
        id: marker.id,
        name: marker.name
      });
    });
    
    // Build the dropdown with optgroups for each region
    let options = '<option value="">Select a venue to compare</option>';
    
    // Define the order for regions display
    const regionOrder = ['banff', 'canmore', 'lake-louise', 'emerald-lake', 'golden', 'jasper', 'cochrane'];
    const regionNames = {
      'banff': 'Banff',
      'canmore': 'Canmore',
      'lake-louise': 'Lake Louise',
      'emerald-lake': 'Emerald Lake',
      'golden': 'Golden, BC',
      'jasper': 'Jasper',
      'cochrane': 'Cochrane'
    };
    
    regionOrder.forEach(region => {
      if (venues[region] && venues[region].length > 0) {
        options += `<optgroup label="${regionNames[region]}">`;
        venues[region].forEach(venue => {
          // Only add option if it exists in venueData
          if (venueData[venue.id]) {
            options += `<option value="${venue.id}">${venue.name}</option>`;
          }
        });
        options += '</optgroup>';
      }
    });
    
    venueSelector.innerHTML = options;
  }
  
  // Initialize the dropdown
  populateVenueSelector();

  addVenueBtn.addEventListener('click', () => {
    const selected = venueSelector.value;
    if (!selected) {
      showToast('Please select a venue to compare', 'warning');
      return;
    }
    if (comparedVenues.length >= 3) {
      showToast('You can compare up to 3 venues. Remove one first.', 'warning');
      return;
    }
    if (comparedVenues.includes(selected)) {
      showToast('This venue is already being compared.', 'info');
      return;
    }
    comparedVenues.push(selected);
    updateComparisonCards();
    showToast(`${venueData[selected]?.name || 'Venue'} added to comparison`, 'success');
  });

  if (resetCompareBtn) {
    resetCompareBtn.addEventListener('click', () => {
      comparedVenues = [];
      comparisonTable.style.display = 'none';
      comparisonPlaceholder.style.display = 'block';
      showToast('Comparison reset.', 'info');
    });
  }

  function updateComparisonCards() {
    comparisonTable.style.display = 'block';
    comparisonPlaceholder.style.display = 'none';
    comparisonCards.innerHTML = '';

    comparedVenues.forEach(vid => {
      const v = venueData[vid];
      if (!v) return;
      const card = document.createElement('div');
      card.className = 'comparison-card';
      card.innerHTML = `
        <div class="card-header">
          <div class="card-image">
            <img src="${v.image}" alt="${v.name}">
          </div>
          <h3>${v.name}</h3>
          <div class="venue-rating">
            ${generateStarRating(v.rating)}
            <span class="rating-value">${v.rating}</span>
          </div>
          <p class="venue-location"><i class="fas fa-map-marker-alt"></i> ${v.location}</p>
        </div>
        <div class="comparison-features">
          <div class="feature">
            <span class="feature-name">Capacity</span>
            <span class="feature-value">${v.capacity}</span>
          </div>
          <div class="feature">
            <span class="feature-name">Price Range</span>
            <span class="feature-value">
              ${v.priceRange}
              ${generatePriceIndicator(v.priceValue)}
            </span>
          </div>
          <div class="feature">
            <span class="feature-name">Indoor/Outdoor</span>
            <span class="feature-value">${v.indoorOutdoor}</span>
          </div>
          <div class="feature">
            <span class="feature-name">Accommodation</span>
            <span class="feature-value">
              ${v.accommodation}
              ${generateAccommodationIndicator(v.accommodationValue)}
            </span>
          </div>
          <div class="feature">
            <span class="feature-name">Catering</span>
            <span class="feature-value">${v.catering}</span>
          </div>
          <div class="feature">
            <span class="feature-name">Availability</span>
            <span class="feature-value">${v.seasonalAvailability}</span>
          </div>
          <div class="feature">
            <span class="feature-name">Features</span>
            <div class="feature-tags">
              ${v.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="card-actions">
          <a href="${v.viewDetailsLink}" class="btn btn-secondary">View Details</a>
          <button class="btn btn-outline remove-venue" data-venue="${vid}">Remove</button>
        </div>
      `;
      comparisonCards.appendChild(card);
    });

    document.querySelectorAll('.remove-venue').forEach(btn => {
      btn.addEventListener('click', () => {
        const removeId = btn.dataset.venue;
        const idx = comparedVenues.indexOf(removeId);
        if (idx > -1) {
          comparedVenues.splice(idx, 1);
          updateComparisonCards();
          showToast(`${venueData[removeId]?.name || 'Venue'} removed.`, 'info');
          if (comparedVenues.length === 0) {
            comparisonTable.style.display = 'none';
            comparisonPlaceholder.style.display = 'block';
          }
        }
      });
    });

    highlightDifferences();
  }

  function highlightDifferences() {
    if (comparedVenues.length > 1) {
      const cards = document.querySelectorAll('.comparison-card');
      const features = ['capacity', 'priceRange', 'indoorOutdoor', 'accommodation', 'catering', 'seasonalAvailability'];
      
      features.forEach(feature => {
        // Find elements containing the feature name without using :contains selector
        const featureElems = [];
        document.querySelectorAll('.feature-name').forEach(elem => {
          if (elem.textContent.includes(feature.charAt(0).toUpperCase() + feature.slice(1))) {
            featureElems.push(elem);
          }
        });
        
        if (featureElems.length > 0) {
          const values = [];
          featureElems.forEach(elem => {
            const valueElem = elem.nextElementSibling;
            if (valueElem) values.push(valueElem.textContent.trim());
          });
          
          const allSame = values.every(value => value === values[0]);
          if (!allSame) {
            featureElems.forEach(elem => {
              const row = elem.closest('.feature');
              if (row) row.classList.add('highlight-diff');
            });
          }
        }
      });
      
      // Also highlight overall ratings if they differ significantly
      const ratingElems = document.querySelectorAll('.rating-value');
      if (ratingElems.length > 1) {
        const ratings = Array.from(ratingElems).map(elem => parseFloat(elem.textContent));
        const maxDiff = Math.max(...ratings) - Math.min(...ratings);
        if (maxDiff >= 0.5) { // Highlight if difference is 0.5+ stars
          ratingElems.forEach(elem => {
            elem.closest('.venue-rating')?.classList.add('highlight-diff');
          });
        }
      }
    }
  }

  function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
    return stars;
  }

  function generatePriceIndicator(value) {
    let indicator = '<div class="price-indicator">';
    for (let i = 0; i < 5; i++) {
      indicator += `<span class="price-dot${i < value ? ' active' : ''}"></span>`;
    }
    indicator += '</div>';
    return indicator;
  }

  function generateAccommodationIndicator(value) {
    let indicator = '<div class="accommodation-indicator">';
    for (let i = 0; i < 5; i++) {
      indicator += `<i class="${i < value ? 'fas' : 'far'} fa-bed${i < value ? ' active' : ''}"></i>`;
    }
    indicator += '</div>';
    return indicator;
  }

  // Toast notifications
  function showToast(msg, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);

      // Basic styles for toast if needed
      const style = document.createElement('style');
      style.textContent = `
        .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; }
        .toast { padding: 12px 20px; margin-bottom: 10px; border-radius: 5px; color: #fff; font-size: 16px;
                 box-shadow: 0 4px 8px rgba(0,0,0,.1); display: flex; align-items: center; justify-content: space-between; 
                 opacity: 0; transform: translateY(20px); animation: toast-in 0.3s ease forwards; }
        .toast.success { background-color: #4caf50; }
        .toast.warning { background-color: #ff9800; }
        .toast.error   { background-color: #f44336; }
        .toast.info    { background-color: #2196f3; }
        .toast-close { background: none; border: none; color: white; cursor: pointer; font-size: 18px; margin-left: 10px; }
        @keyframes toast-in { to { opacity: 1; transform: translateY(0); } } }
        @keyframes toast-out { to { opacity: 0; transform: translateY(-20px); } } }
      `;
      document.head.appendChild(style);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${msg}</span>
      <button class="toast-close">&times;</button>
    `;
    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.animation = 'toast-out 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    });
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'toast-out 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3000);
  }
}

/* --------------------------------
   7) Venue Planner Tools
--------------------------------- */
function initVenuePlanner() {
  const venueItems = document.querySelectorAll('.venue-item');
  venueItems.forEach(venue => {
    const venueName = venue.querySelector('h3')?.textContent || 'Your Venue';
    const plannerTools = document.createElement('div');
    plannerTools.className = 'venue-planner-tools hidden';
    plannerTools.innerHTML = `
      <h4>Plan Your Event at ${venueName}</h4>
      <!-- Add your planning tool markup, checklists, or floorplan logic here. -->
    `;

    const infoSection = venue.querySelector('.venue-info');
    if (infoSection) {
      infoSection.appendChild(plannerTools);

      // Add toggle button
      const actions = venue.querySelector('.venue-actions');
      if (actions) {
        const plannerBtn = document.createElement('button');
        plannerBtn.className = 'btn btn-secondary btn-planning-tools';
        plannerBtn.innerHTML = '<i class="fas fa-tasks"></i> Planning Tools';
        actions.appendChild(plannerBtn);

        plannerBtn.addEventListener('click', () => {
          plannerTools.classList.toggle('hidden');
          plannerBtn.classList.toggle('active');
          if (!plannerTools.classList.contains('hidden')) {
            plannerTools.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    }
  });
}

/* ------------------------------------------
   8) Smooth Scrolling for Anchor Links
------------------------------------------- */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

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
      
      // Try to show a panorama photo instead of Street View for certain venues
      // This is a more reliable option since Street View might not be available everywhere
      setTimeout(() => {
        // First try: if venue has a specific panorama image, use that
        if (venue.panoramaImage) {
          showPanoramaImage(venue, tourContainer);
          return;
        }
        
        // Second try: See if we can get a Street View image
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
  
  // Also handle close button and outside modal clicks
  if (e.target.classList.contains('close-modal') || e.target.id === 'tourModal') {
    const tourModal = document.getElementById('tourModal');
    if (tourModal) {
      console.log('Closing tour modal');
      tourModal.style.display = 'none';
    }
  }
});

// Function to display a Street View panorama
function showStreetViewPanorama(venue, container, data) {
  // Create the panorama
  const panorama = new google.maps.StreetViewPanorama(
    container,
    {
      pano: data.location.pano,
      visible: true,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: true,
      fullscreenControl: true
    }
  );
  
  // Add venue info overlay
  const overlay = document.createElement('div');
  overlay.className = 'venue-pano-overlay';
  overlay.style.cssText = 'position:absolute; top:10px; left:10px; background:rgba(255,255,255,0.8); padding:10px; border-radius:5px; z-index:10;';
  overlay.innerHTML = `
    <h3 style="margin:0 0 5px; font-size:16px;">${venue.name}</h3>
    <p style="margin:0; font-size:12px;">${venue.location}</p>
    <button class="btn-close-overlay" style="border:none; background:#e74c3c; color:white; padding:3px 8px; margin-top:5px; cursor:pointer; border-radius:3px;">Close</button>
  `;
  container.appendChild(overlay);
  
  document.querySelector('.btn-close-overlay')?.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
}

// Function to display a static panorama image (when available)
function showPanoramaImage(venue, container) {
  container.innerHTML = `
    <div style="position:relative; width:100%; height:100%;">
      <img src="${venue.panoramaImage}" alt="${venue.name} panoramic view" 
           style="width:100%; height:100%; object-fit:cover; border-radius:5px;">
      <div style="position:absolute; bottom:20px; left:20px; background:rgba(255,255,255,0.8); padding:15px; border-radius:5px;">
        <h3 style="margin:0 0 10px;">${venue.name}</h3>
        <p style="margin:0;">${venue.location}</p>
      </div>
    </div>
  `;
}

// Function to show a beautiful fallback when Street View is unavailable
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
        While 360° Street View is not available for this location, ${venue.name} offers 
        ${venue.description.substring(0, 100)}...
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

// Global fallback initialization for mobile devices
window.addEventListener('load', function() {
  const isMobile = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints;
  
  if (isMobile) {
    Debug.info('MOBILE_FALLBACK', 'Applying mobile-specific fallback initializations');
    
    // Fallback for map initialization
    setTimeout(() => {
      const mapContainer = document.getElementById('venuesMap');
      if (mapContainer && (!mapContainer.querySelector('iframe') && !mapContainer.querySelector('.gm-style'))) {
        Debug.warn('MOBILE_FALLBACK', 'Map not initialized properly, attempting fallback');
        
        // Check if Google Maps is available
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
          // Force flag to be true
          googleMapsLoaded = true;
          
          // Re-initialize map
          try {
            initInteractiveMap();
          } catch (error) {
            Debug.error('MOBILE_FALLBACK', 'Error in map fallback initialization', error);
          }
        } else {
          // Create a fallback static map
          mapContainer.innerHTML = `
            <div class="map-error">
              <h3>Interactive Map Unavailable</h3>
              <p>The interactive map could not be loaded. Please try refreshing the page or viewing on desktop.</p>
              <img src="assets/images/venues/map-fallback.jpg" alt="Map of wedding venues in the Canadian Rockies" style="width:100%; max-width:600px; margin:20px auto; display:block;">
            </div>
          `;
        }
      }
    }, 2000); // Wait 2 seconds after page load
    
    // Fallback for virtual tour buttons
    setTimeout(() => {
      const virtualTourButtons = document.querySelectorAll('.view-360, [data-venue]');
      
      Debug.info('MOBILE_FALLBACK', `Ensuring ${virtualTourButtons.length} virtual tour buttons are clickable`);
      
      virtualTourButtons.forEach(button => {
        // Add direct onclick attribute as fallback
        const venueId = button.dataset.venue || button.getAttribute('data-venue');
        if (venueId) {
          Debug.info('MOBILE_FALLBACK', `Adding fallback handler for venue: ${venueId}`);
          
          // Remove existing handlers to avoid duplicates
          button.removeEventListener('click', handleTourButtonClick);
          
          // Add direct event handler
          button.addEventListener('click', handleTourButtonClick);
          
          // Add touchend handler specifically for mobile
          button.removeEventListener('touchend', handleTourButtonTouch);
          button.addEventListener('touchend', handleTourButtonTouch, { passive: false });
          
          // Make button more visible
          button.style.position = 'relative';
          button.style.zIndex = '10';
          
          // Add inline styles for better tappability
          button.style.minHeight = '44px';
          button.style.padding = '12px 16px';
          button.style.display = 'inline-flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
        }
      });
      
      function handleTourButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const venueId = this.dataset.venue || this.getAttribute('data-venue');
        
        // Display loading indication
        this.classList.add('loading');
        
        // Find venue data
        const venue = venueMarkers.find(v => v.id === venueId);
        if (!venue) {
          Debug.error('TOUR_BUTTON', `Could not find venue data for ID: ${venueId}`);
          this.classList.remove('loading');
          return;
        }

        // Try to initialize Street View
        const streetViewService = new google.maps.StreetViewService();
        
        // First try with place ID
        if (venue.placeId) {
          streetViewService.getPanorama({ placeId: venue.placeId }, handleStreetViewResponse);
        } else if (venue.coordinates) {
          // Try with coordinates as fallback
          streetViewService.getPanorama({
            location: venue.coordinates,
            radius: 100,
            source: google.maps.StreetViewSource.OUTDOOR
          }, handleStreetViewResponse);
        }

        function handleStreetViewResponse(data, status) {
          if (status === "OK" && data) {
            // Street View available - show the tour
            if (typeof openVirtualTour === 'function') {
              try {
                openVirtualTour(venueId);
              } catch (error) {
                Debug.error('TOUR_BUTTON', `Error opening tour for venue ${venueId}`, error);
                showMobileOptimizedTour(venue, data);
              }
            } else {
              showMobileOptimizedTour(venue, data);
            }
          } else {
            // No Street View available - try interior photos
            const placesService = new google.maps.places.PlacesService(document.createElement('div'));
            
            if (venue.placeId) {
              placesService.getDetails({
                placeId: venue.placeId,
                fields: ['photos', 'name', 'formatted_address']
              }, (place, placeStatus) => {
                if (placeStatus === google.maps.places.PlacesServiceStatus.OK && place && place.photos) {
                  showPhotoGalleryTour(venue, place.photos);
                } else {
                  showFallbackTourModal(venueId);
                }
              });
            } else {
              showFallbackTourModal(venueId);
            }
          }
        }
        
        // Remove loading after delay
        setTimeout(() => {
          this.classList.remove('loading');
        }, 500);
      }
      
      function handleTourButtonTouch(e) {
        e.preventDefault();
        handleTourButtonClick.call(this, e);
      }
      
      function showFallbackTourModal(venueId) {
        Debug.info('MOBILE_FALLBACK', `Showing fallback tour modal for venue: ${venueId}`);
        
        // Find venue in data
        const venue = venueMarkers.find(v => v.id === venueId);
        
        // Get or create modal
        let modal = document.getElementById('fallbackTourModal');
        if (!modal) {
          modal = document.createElement('div');
          modal.id = 'fallbackTourModal';
          modal.className = 'tour-modal active';
          modal.innerHTML = `
            <div class="modal-content">
              <div class="modal-header">
                <h2>${venue ? venue.name : 'Venue'} Tour</h2>
                <button class="close-modal" aria-label="Close modal">&times;</button>
              </div>
              <div class="fallback-tour-container">
                <div class="tour-message">
                  <p>The interactive tour is not available on this device. Please try on desktop or visit the venue's website directly.</p>
                  <div class="tour-actions">
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue ? venue.name + ' ' + (venue.address || 'Canadian Rockies') : 'Rocky Mountain wedding venues')}" class="btn-secondary" target="_blank">View on Google Maps</a>
                  </div>
                </div>
              </div>
            </div>
          `;
          document.body.appendChild(modal);
          
          // Add close button handler
          const closeBtn = modal.querySelector('.close-modal');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              modal.classList.remove('active');
              document.body.style.overflow = '';
            });
          }
        }
        
        // Show the modal
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
      }
    }, 1500); // Wait 1.5 seconds after page load
  }
});
  