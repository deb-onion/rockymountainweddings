// scripts/venues.js

document.addEventListener('DOMContentLoaded', () => {
    initInteractiveMap();
    initRegionFilters();
    initVenueGalleries();
    initVenueModal();
    initVirtualTours();
    initVenueComparison();
    initSmoothScrolling();
    initVenuePlanner();
  });
  
  // 1) Google Maps + Marker Setup
  function initInteractiveMap() {
    const mapContainer = document.getElementById('venuesMap');
    if (!mapContainer) {
      console.error('No element with id="venuesMap" found.');
      return;
    }
  
    // Ensure we have a map container with height
    if (mapContainer.offsetWidth === 0 || mapContainer.offsetHeight === 0) {
      console.warn('Map container has zero width/height. Setting a default height of 500px.');
      mapContainer.style.minHeight = '500px';
    }
  
    // Check if the Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('Google Maps API not found. Check your script tag and API key.');
      return;
    }
  
    // Custom map styles
    const mapStyles = [
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#dde2e3' }, { visibility: 'on' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#a9de83' }, { visibility: 'on' }]
      },
      {
        featureType: 'landscape.natural.terrain',
        elementType: 'geometry',
        stylers: [{ color: '#c9e9b2' }, { visibility: 'on' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#a6cbe3' }, { visibility: 'on' }]
      },
      {
        featureType: 'poi.attraction',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
      }
    ];
  
    try {
      // Use terrain if available
      let mapTypeId = 'roadmap';
      if (google.maps.MapTypeId && google.maps.MapTypeId.TERRAIN) {
        mapTypeId = google.maps.MapTypeId.TERRAIN;
      }
  
      const mapOptions = {
        center: { lat: 51.1645, lng: -115.5708 },
        zoom: 8,
        mapTypeId: mapTypeId,
        styles: mapStyles,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        tilt: 45
      };
  
      const map = new google.maps.Map(mapContainer, mapOptions);
  
      // Create region-based marker coloring
      function createMarkerIcon(region) {
        const colors = {
          banff: '#e74c3c',
          canmore: '#3498db',
          'lake-louise': '#2ecc71',
          'emerald-lake': '#27ae60',
          jasper: '#9b59b6',
          golden: '#f1c40f',
          cochrane: '#bf8d3c'
        };
        const color = colors[region] || '#e74c3c';
        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          scale: 10
        };
      }
  
      // ~~~~~~~~~~~~ MASTER VENUE ARRAY ~~~~~~~~~~~~
      // Make sure to fill these out with your final placeIds, lat/lng, etc.
      const venueMarkers = [
        {
          id: 'the-gem',
          name: 'The Gem',
          location: 'Harvie Heights, AB',
          description: 'Unique venue combining rustic charm and modern amenities...',
          coordinates: { lat: 51.0977, lng: -115.3392 },
          image: 'assets/images/venues/the-gem-main.jpg',
          region: 'banff',
          url: '#banff-venues',
          capacity: '20-150 guests',
          priceRange: '$$-$$$',
          features: ['Mountain Views', 'Indoor & Outdoor', 'Rustic', 'Custom Packages'],
          placeId: 'ChIJW6XUmrEYcFMRaEOtOYjqH3g',
          address: '900A Harvie Heights Rd, Bighorn No. 8, AB T1W 2W2, Canada'
        },
        // ... more venue objects ...
      ];
  
      // Place markers on the map
      venueMarkers.forEach((venue) => {
        const marker = new google.maps.Marker({
          position: venue.coordinates,
          map: map,
          title: venue.name,
          icon: createMarkerIcon(venue.region),
          animation: google.maps.Animation.DROP,
          optimized: true
        });
  
        const infoHtml = `
          <div class="venue-info-window">
            <div class="venue-info-header">
              <img src="${venue.image}" alt="${venue.name}">
              <div class="venue-info-name">
                <h3>${venue.name}</h3>
              </div>
            </div>
            <div class="venue-info-content">
              <p>${venue.description}</p>
              <div class="venue-info-detail">
                <i class="fas fa-map-marker-alt"></i> ${venue.location}
              </div>
              <div class="venue-info-detail">
                <i class="fas fa-users"></i> ${venue.capacity}
              </div>
              <div class="venue-info-detail">
                <i class="fas fa-dollar-sign"></i> ${venue.priceRange}
              </div>
              <a href="${venue.url}" class="venue-info-link">View Details</a>
            </div>
          </div>
        `;
  
        const infoWindow = new google.maps.InfoWindow({
          content: infoHtml,
          maxWidth: 320
        });
  
        marker.addListener('click', () => {
          // Close other windows
          venueMarkers.forEach((v) => {
            if (v.infoWindow && v.infoWindow.getMap()) {
              v.infoWindow.close();
            }
          });
          infoWindow.open(map, marker);
          venue.infoWindow = infoWindow;
  
          // Bounce animation
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 750);
        });
  
        // Hover effect
        marker.addListener('mouseover', () => {
          marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
          marker.setIcon({
            ...createMarkerIcon(venue.region),
            scale: 12
          });
        });
        marker.addListener('mouseout', () => {
          marker.setIcon(createMarkerIcon(venue.region));
        });
  
        venue.marker = marker;
        venue.infoWindow = infoWindow;
      });
  
      // Region filter buttons
      const regionFilters = document.querySelectorAll('.region-filter');
      regionFilters.forEach((filterBtn) => {
        filterBtn.addEventListener('click', () => {
          regionFilters.forEach((b) => b.classList.remove('active'));
          filterBtn.classList.add('active');
          const region = filterBtn.dataset.region;
          venueMarkers.forEach((v) => {
            const match = region === 'all' || v.region === region;
            v.marker.setVisible(match);
            if (!match && v.infoWindow && v.infoWindow.getMap()) {
              v.infoWindow.close();
            }
          });
  
          // Adjust map bounds
          if (region === 'all') {
            const bounds = new google.maps.LatLngBounds();
            venueMarkers.forEach((v) => bounds.extend(v.coordinates));
            map.fitBounds(bounds);
          } else {
            const regionVenues = venueMarkers.filter((v) => v.region === region);
            if (regionVenues.length > 0) {
              const bounds = new google.maps.LatLngBounds();
              regionVenues.forEach((rv) => bounds.extend(rv.coordinates));
              map.fitBounds(bounds);
              google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
                if (map.getZoom() > 12) map.setZoom(12);
              });
            }
          }
        });
      });
  
      // Custom 3D tilt toggle
      const controlDiv = document.createElement('div');
      controlDiv.style.padding = '10px';
  
      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = 'Toggle 3D View';
      Object.assign(toggleBtn.style, {
        backgroundColor: '#fff',
        border: '2px solid #ccc',
        borderRadius: '3px',
        boxShadow: '0 2px 6px rgba(0,0,0,.3)',
        cursor: 'pointer',
        padding: '8px',
        textAlign: 'center'
      });
      controlDiv.appendChild(toggleBtn);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
  
      let is3D = true;
      toggleBtn.addEventListener('click', () => {
        if (is3D) {
          map.setOptions({ tilt: 0 });
          toggleBtn.textContent = 'Enable 3D View';
          is3D = false;
        } else {
          map.setOptions({ tilt: 45 });
          toggleBtn.textContent = 'Disable 3D View';
          is3D = true;
        }
      });
    } catch (error) {
      console.error('Error initializing the map:', error);
      mapContainer.innerHTML = `
        <div class="map-error">
          <h3>Map Loading Error</h3>
          <p>We couldn't load the venue map. Please refresh or contact us for assistance.</p>
          <p>Error details: ${error.message}</p>
        </div>
      `;
    }
  }
  
  // 2) Region Filter Buttons outside the map (anchor scroll)
  function initRegionFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const region = btn.dataset.filter;
  
        // Filter the .regional-venues sections
        const venueSections = document.querySelectorAll('.regional-venues');
        venueSections.forEach((section) => {
          const secRegion = section.getAttribute('data-region');
          if (region === 'all' || secRegion === region) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }
  
  // 3) Enhanced Venue Galleries
  function initVenueGalleries() {
    const venueGalleries = document.querySelectorAll('.venue-gallery');
    venueGalleries.forEach((gallery) => {
      const mainImage = gallery.querySelector('.gallery-main img');
      const thumbs = gallery.querySelectorAll('.gallery-thumbs img');
      let currentIndex = 0;
      let rotationTimer;
  
      function changeMainImage(index) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
          mainImage.src = thumbs[index].src;
          mainImage.alt = thumbs[index].alt;
          mainImage.style.opacity = '1';
          currentIndex = index;
        }, 300);
      }
  
      function startRotation() {
        rotationTimer = setInterval(() => {
          const nextIndex = (currentIndex + 1) % thumbs.length;
          changeMainImage(nextIndex);
        }, 4000);
      }
  
      thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => {
          changeMainImage(i);
          clearInterval(rotationTimer);
          startRotation();
        });
      });
  
      gallery.addEventListener('mouseenter', () => clearInterval(rotationTimer));
      gallery.addEventListener('mouseleave', () => startRotation());
  
      startRotation();
    });
  }
  
  // 4) Venue Inquiry Modal
  function initVenueModal() {
    const modal = document.getElementById('venueModal');
    if (!modal) return;
  
    const closeButton = modal.querySelector('.close-modal');
    const inquiryButtons = document.querySelectorAll('.btn-venue-inquiry');
    const venueField = document.getElementById('selectedVenue');
  
    function closeModal() {
      modal.querySelector('.modal-content').classList.remove('modal-animate');
      setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }, 300);
    }
  
    inquiryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const venueName = btn.getAttribute('data-venue') || '';
        venueField.value = venueName;
        modal.classList.add('active');
        setTimeout(() => {
          modal.querySelector('.modal-content').classList.add('modal-animate');
        }, 100);
        document.body.style.overflow = 'hidden';
      });
    });
  
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  
    // Dynamic form fields
    const form = document.getElementById('venueInquiryForm');
    if (form) {
      const venueSpecificFields = form.querySelector('.venue-specific-fields');
  
      venueField.addEventListener('change', updateFormFields);
      function updateFormFields() {
        const venueName = venueField.value.toLowerCase();
        venueSpecificFields.innerHTML = '';
  
        // Example dynamic logic
        if (venueName.includes('banff springs')) {
          venueSpecificFields.innerHTML = `
            <div class="form-group">
              <label for="ceremony-location">Preferred Ceremony Space</label>
              <select id="ceremony-location" name="ceremony-location">
                <option value="">Select</option>
                <option value="terrace">Terrace</option>
                <option value="conservatory">Conservatory</option>
                <option value="cascade-ballroom">Cascade Ballroom</option>
              </select>
            </div>
          `;
        } else if (venueName.includes('lake louise')) {
          venueSpecificFields.innerHTML = `
            <div class="form-group">
              <label for="ceremony-location">Preferred Ceremony Space</label>
              <select id="ceremony-location" name="ceremony-location">
                <option value="">Select</option>
                <option value="lakefront">Lakefront</option>
                <option value="victoria-terrace">Victoria Terrace</option>
              </select>
            </div>
          `;
        }
        // Add as needed
      }
  
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) return;
  
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
  
        setTimeout(() => {
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
              closeModal();
            });
          }, 300);
        }, 1500);
      });
  
      function validateForm() {
        let isValid = true;
        form.querySelectorAll('.error-message').forEach((msg) => msg.remove());
  
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach((field) => {
          field.classList.remove('error');
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            const err = document.createElement('span');
            err.className = 'error-message';
            err.textContent = 'This field is required';
            field.parentNode.appendChild(err);
          }
        });
  
        // Email check
        const emailField = form.querySelector('#email');
        if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
          isValid = false;
          emailField.classList.add('error');
          const err = document.createElement('span');
          err.className = 'error-message';
          err.textContent = 'Please enter a valid email address';
          emailField.parentNode.appendChild(err);
        }
  
        return isValid;
      }
    }
  }
  
  // 5) Virtual Tours
  function initVirtualTours() {
    const tourModal = document.getElementById('tourModal');
    if (!tourModal) return;
  
    const closeButton = tourModal.querySelector('.close-modal');
    const tourContainer = document.getElementById('tourContainer');
    const tourButtons = document.querySelectorAll('.view-360');
  
    function openVirtualTour(venueId) {
      tourContainer.innerHTML = `
        <div class="tour-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading virtual tour...</p>
        </div>
      `;
      tourModal.classList.add('active');
      setTimeout(() => {
        tourModal.querySelector('.modal-content').classList.add('modal-animate');
      }, 100);
      document.body.style.overflow = 'hidden';
  
      // TODO: Look up the venue data by ID, then attempt Street View
      // For brevity, we'll just embed a sample Street View or fallback:
      setTimeout(() => {
        // Example embed
        tourContainer.innerHTML = `
          <iframe
            width="100%"
            height="100%"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/streetview?key=YOUR_API_KEY&location=51.1761,-115.5693&heading=210&pitch=10&fov=80">
          </iframe>
        `;
      }, 1200);
    }
  
    tourButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const venueId = btn.dataset.venue;
        if (!venueId) {
          alert('No venue ID assigned to the 360 button.');
          return;
        }
        openVirtualTour(venueId);
      });
    });
  
    function closeModal() {
      const modalContent = tourModal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.classList.remove('modal-animate');
      }
      setTimeout(() => {
        tourModal.classList.remove('active');
        document.body.style.overflow = '';
        tourContainer.innerHTML = '';
      }, 300);
    }
  
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }
    tourModal.addEventListener('click', (e) => {
      if (e.target === tourModal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && tourModal.classList.contains('active')) {
        closeModal();
      }
    });
  }
  
  // 6) Venue Comparison
  function initVenueComparison() {
    const comparisonTable = document.querySelector('.comparison-table');
    const comparisonPlaceholder = document.querySelector('.comparison-placeholder');
    const venueSelector = document.getElementById('venueSelector');
    const addVenueBtn = document.getElementById('addVenueBtn');
    const resetCompareBtn = document.getElementById('resetCompareBtn');
    if (!comparisonTable || !venueSelector || !addVenueBtn) return;
  
    // Example data for comparison. Use real data or tie it to the map array
    const venueData = {
      'banff-springs': {
        name: 'Fairmont Banff Springs',
        location: 'Banff',
        capacity: '10-800 guests',
        priceRange: '$$$-$$$$',
        indoorOutdoor: 'Both',
        rating: 4.8,
        image: 'assets/images/venues/banff-springs-main.jpg',
        features: ['Historic', 'Luxury', 'On-site Accommodations']
      },
      'the-gem': {
        name: 'The Gem',
        location: 'Banff',
        capacity: '20-150 guests',
        priceRange: '$$-$$$',
        indoorOutdoor: 'Both',
        rating: 4.7,
        image: 'assets/images/venues/the-gem-main.jpg',
        features: ['Rustic', 'Mountain Views', 'Custom Packages']
      }
      // ...
    };
  
    let comparedVenues = [];
    const comparisonCards = document.createElement('div');
    comparisonCards.className = 'comparison-cards';
    comparisonTable.appendChild(comparisonCards);
  
    addVenueBtn.addEventListener('click', () => {
      const val = venueSelector.value;
      if (!val) {
        showToast('Please select a venue to compare', 'warning');
        return;
      }
      if (comparedVenues.length >= 3) {
        showToast('You can compare up to 3 venues. Remove one first.', 'warning');
        return;
      }
      if (comparedVenues.includes(val)) {
        showToast('This venue is already being compared.', 'info');
        return;
      }
      comparedVenues.push(val);
      updateComparisonCards();
      showToast(`${venueData[val]?.name || 'Venue'} added to comparison`, 'success');
    });
  
    if (resetCompareBtn) {
      resetCompareBtn.addEventListener('click', () => {
        comparedVenues = [];
        comparisonTable.style.display = 'none';
        comparisonPlaceholder.style.display = 'block';
        showToast('Comparison reset', 'info');
      });
    }
  
    function updateComparisonCards() {
      comparisonTable.style.display = 'block';
      comparisonPlaceholder.style.display = 'none';
      comparisonCards.innerHTML = '';
  
      comparedVenues.forEach((vID) => {
        const v = venueData[vID];
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
              ${renderStarRating(v.rating)}
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
              <span class="feature-value">${v.priceRange}</span>
            </div>
            <div class="feature">
              <span class="feature-name">Indoor/Outdoor</span>
              <span class="feature-value">${v.indoorOutdoor || 'N/A'}</span>
            </div>
            <div class="feature">
              <span class="feature-name">Features</span>
              <div class="feature-tags">
                ${v.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="card-actions">
            <a href="#${vID}-venues" class="btn btn-secondary">View Details</a>
            <button class="btn btn-outline remove-venue" data-venue="${vID}">Remove</button>
          </div>
        `;
        comparisonCards.appendChild(card);
      });
  
      // Remove buttons
      document.querySelectorAll('.remove-venue').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rmID = btn.dataset.venue;
          comparedVenues = comparedVenues.filter((v) => v !== rmID);
          updateComparisonCards();
          showToast('Removed from comparison', 'info');
          if (comparedVenues.length === 0) {
            comparisonTable.style.display = 'none';
            comparisonPlaceholder.style.display = 'block';
          }
        });
      });
    }
  
    function renderStarRating(rating) {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      let stars = '';
      for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
      }
      if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
      }
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      for (let j = 0; j < emptyStars; j++) {
        stars += '<i class="far fa-star"></i>';
      }
      return stars;
    }
  
    // Simple toast
    function showToast(message, type = 'info') {
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
      `;
      container.appendChild(toast);
  
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => {
        removeToast(toast);
      });
  
      setTimeout(() => {
        removeToast(toast);
      }, 3000);
    }
  
    function removeToast(el) {
      el.style.animation = 'toast-out 0.3s forwards';
      setTimeout(() => {
        if (el.parentNode) el.remove();
      }, 300);
    }
  }
  
  // 7) Venue Planner Tools
  function initVenuePlanner() {
    const venueItems = document.querySelectorAll('.venue-item');
    venueItems.forEach((venue) => {
      // Optionally add a button that toggles .venue-planner-tools
      // If you want a detailed "Checklist/Floorplan/Timeline" tab, you can put it here
    });
  }
  
  // 8) Smooth Scroll for anchor links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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
  