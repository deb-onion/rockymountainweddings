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
let venueMarkers = []; // This will be populated from JSON data instead of hard-coded

// Function to call when Google Maps is ready
function onGoogleMapsReady() {
  Debug.success('GOOGLE_MAPS', 'Google Maps API loaded successfully');
  googleMapsLoaded = true;
  
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
  } else {
    googleMapsCallbacks.push(callback);
  }
}

// Fetch venue data from JSON file
async function fetchVenueData() {
  try {
    Debug.info('DATA', 'Fetching venue data from JSON file');
    const response = await fetch('/data/venues.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    venueMarkers = data.venues;
    Debug.success('DATA', `Successfully loaded ${venueMarkers.length} venues from JSON`);
    return venueMarkers;
  } catch (error) {
    Debug.error('DATA', 'Error fetching venue data:', error);
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

  // Ensure map container has dimension
  if (mapContainer.offsetWidth === 0 || mapContainer.offsetHeight === 0) {
    Debug.warn('MAP_INIT', 'Map container has zero width/height; setting minHeight=500px.');
    mapContainer.style.minHeight = '500px';
  }

  // Check if Google Maps is loaded
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    Debug.error('MAP_INIT', 'Google Maps API not available.');
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

  // Map options
  const mapOptions = {
    center: { lat: 51.1645, lng: -115.5708 }, // Banff-ish
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: mapStyles,
    mapTypeControl: true,
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    tilt: 45
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
  const tourModal = document.getElementById('tourModal');
  if (!tourModal) {
    Debug.error('VIRTUAL_TOUR', 'Tour modal element not found');
    return;
  }

  // Make sure the modal content has correct structure
  if (!tourModal.querySelector('.modal-content')) {
    Debug.error('VIRTUAL_TOUR', 'Tour modal is missing modal-content element');
    // Add it if missing
    tourModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Virtual Tour</h2>
          <button class="close-modal" aria-label="Close modal">&times;</button>
        </div>
        <div id="tourContainer"></div>
      </div>
    `;
  }

  const tourButtons = document.querySelectorAll('.view-360');
  Debug.info('VIRTUAL_TOUR', `Found ${tourButtons.length} tour buttons`);
  
  const closeButton = tourModal.querySelector('.close-modal');
  const tourContainer = document.getElementById('tourContainer');
  
  if (!tourContainer) {
    Debug.error('VIRTUAL_TOUR', 'Tour container element not found');
    return;
  }

  // Add style to ensure modal is visible
  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    .tour-modal {
      display: none;
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      overflow: auto;
    }
    
    .tour-modal.active {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .tour-modal .modal-content {
      background-color: #fff;
      margin: 5% auto;
      padding: 0;
      border-radius: 8px;
      width: 90%;
      max-width: 900px;
      max-height: 90vh;
      position: relative;
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.3s ease-in-out;
    }
    
    .tour-modal .modal-content.modal-animate {
      transform: translateY(0);
      opacity: 1;
    }
    
    .tour-modal .modal-header {
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      height: 70vh;
      width: 100%;
      position: relative;
    }
  `;
  document.head.appendChild(modalStyle);

  // Make sure each button clicks correctly
  tourButtons.forEach(btn => {
    // Remove any existing event listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const venueId = this.dataset.venue || '';
      Debug.info('VIRTUAL_TOUR', `Tour button clicked for venue: ${venueId}`);
      openVirtualTour(venueId);
    });
  });

  function openVirtualTour(venueId) {
    // Show loading
    tourContainer.innerHTML = `
      <div class="tour-loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading virtual tour...</p>
      </div>
    `;
    showTourModal();

    // Get venue details from the venueMarkers array
    const venue = venueMarkers.find(marker => marker.id === venueId);
    
    if (!venue) {
      Debug.error('VIRTUAL_TOUR', `Venue not found with ID: ${venueId}`);
      showTourError(venueId);
      return;
    }
    
    Debug.info('VIRTUAL_TOUR', `Attempting to load virtual tour for ${venue.name} with placeId: ${venue.placeId}`);
    
    try {
      // Add a timeout to detect if panorama fails to load
      let panoramaLoadTimeout = setTimeout(() => {
        Debug.warn('VIRTUAL_TOUR', 'Street View panorama taking too long to load, showing fallback');
        showTourError(venueId, venue);
      }, 5000);
      
      // Street View implementation using placeIds
      const panorama = new google.maps.StreetViewPanorama(
        tourContainer,
        {
          pano: null,
          visible: true,
          pov: {
            heading: 0,
            pitch: 0,
          },
          zoom: 1,
          addressControl: false,
          showRoadLabels: false,
        }
      );
      
      // Listen for panorama ready or error events
      panorama.addListener('status_changed', () => {
        const status = panorama.getStatus();
        Debug.info('VIRTUAL_TOUR', `Street View status: ${status}`);
        if (status === 'OK') {
          clearTimeout(panoramaLoadTimeout);
        } else if (status === 'ZERO_RESULTS' || status === 'ERROR') {
          clearTimeout(panoramaLoadTimeout);
          showTourError(venueId, venue);
        }
      });
      
      const sv = new google.maps.StreetViewService();
      sv.getPanorama({ placeId: venue.placeId }, (data, status) => {
        Debug.info('VIRTUAL_TOUR', `Street View response for placeId: ${status}`);
        if (status === 'OK') {
          // Success - show Street View
          clearTimeout(panoramaLoadTimeout);
          panorama.setPano(data.location.pano);
          
          // Add venue info overlay
          const overlay = document.createElement('div');
          overlay.className = 'venue-pano-overlay';
          overlay.innerHTML = `
            <h3>${venue.name}</h3>
            <p>${venue.location}</p>
            <button class="btn btn-sm btn-light pano-close">Close Info</button>
          `;
          tourContainer.appendChild(overlay);
          
          document.querySelector('.pano-close')?.addEventListener('click', () => {
            overlay.style.display = 'none';
          });
        } else {
          // Fallback to venue coordinates if placeId doesn't have Street View
          Debug.info('VIRTUAL_TOUR', `Falling back to coordinates for ${venue.name}`);
          sv.getPanorama({
            location: venue.coordinates,
            radius: 100,
            source: google.maps.StreetViewSource.OUTDOOR
          }, (data, status) => {
            Debug.info('VIRTUAL_TOUR', `Street View response for coordinates: ${status}`);
            if (status === 'OK') {
              clearTimeout(panoramaLoadTimeout);
              panorama.setPano(data.location.pano);
            } else {
              clearTimeout(panoramaLoadTimeout);
              showTourError(venueId, venue);
            }
          });
        }
      });
    } catch (error) {
      Debug.error('VIRTUAL_TOUR', 'Street View error:', error);
      showTourError(venueId, venue);
    }
  }
  
  function showTourError(venueId, venue = null) {
    let mapUrl = 'https://www.google.com/maps';
    if (venue) {
      const lat = venue.coordinates.lat;
      const lng = venue.coordinates.lng;
      mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=18&layer=c`;
    } else if (venueId) {
      // Try to find the venue by ID if not provided
      const foundVenue = venueMarkers.find(marker => marker.id === venueId);
      if (foundVenue && foundVenue.coordinates) {
        const lat = foundVenue.coordinates.lat;
        const lng = foundVenue.coordinates.lng;
        mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=18&layer=c`;
      }
    }
    
    // Display an attractive fallback with venue image and map link
    tourContainer.innerHTML = `
      <div class="tour-error">
        <h3>Virtual Tour Unavailable</h3>
        ${venue ? `<img src="${venue.image}" alt="${venue.name}" class="tour-fallback-image">` : ''}
        <p>Street View for <strong>${venue ? venue.name : venueId}</strong> is not available at this moment.</p>
        <div class="tour-buttons">
          <a href="${mapUrl}" target="_blank" class="btn btn-primary" id="viewOnMap">View on Google Maps</a>
          <button class="btn btn-secondary" id="viewVenueDetails">View Venue Details</button>
        </div>
      </div>
    `;
    
    // Add CSS to make the fallback look nicer
    const style = document.createElement('style');
    style.textContent = `
      .tour-error { text-align: center; padding: 20px; }
      .tour-fallback-image { max-width: 100%; border-radius: 8px; margin: 15px 0; max-height: 300px; object-fit: cover; }
      .tour-buttons { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
    `;
    document.head.appendChild(style);
    
    const viewVenueDetailsBtn = document.getElementById('viewVenueDetails');
    if (viewVenueDetailsBtn && venue) {
      viewVenueDetailsBtn.addEventListener('click', () => {
        closeTourModal();
        document.querySelector(venue.url)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function showTourModal() {
    Debug.info('VIRTUAL_TOUR', 'Opening tour modal');
    tourModal.classList.add('active');
    setTimeout(() => {
      const content = tourModal.querySelector('.modal-content');
      if (content) {
        content.classList.add('modal-animate');
        Debug.info('VIRTUAL_TOUR', 'Modal animated in');
      } else {
        Debug.error('VIRTUAL_TOUR', 'Modal content element not found');
      }
    }, 100);
    document.body.style.overflow = 'hidden';
  }

  function closeTourModal() {
    Debug.info('VIRTUAL_TOUR', 'Closing tour modal');
    const content = tourModal.querySelector('.modal-content');
    if (content) content.classList.remove('modal-animate');
    setTimeout(() => {
      tourModal.classList.remove('active');
      document.body.style.overflow = '';
      tourContainer.innerHTML = '';
    }, 300);
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeTourModal);
  } else {
    Debug.error('VIRTUAL_TOUR', 'Close button not found in modal');
  }
  
  tourModal.addEventListener('click', e => {
    if (e.target === tourModal) closeTourModal();
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && tourModal.classList.contains('active')) {
      closeTourModal();
    }
  });
}

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
        @keyframes toast-out { to { opacity: 0; transform: translateY(-20px); } }
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
  