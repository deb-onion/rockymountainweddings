// VENUE MARKERS ARRAY - Global declaration for all venue data
const venueMarkers = [
  // BANFF VENUES
  {
    id: 'the-gem',
    name: 'The Gem',
    location: 'Bighorn No. 8, Alberta',
    description: 'An elegant venue with magnificent mountain views, perfect for intimate weddings and celebrations.',
    coordinates: { lat: 51.0977, lng: -115.3392 },
    image: 'assets/images/venues/the-gem-main.jpg',
    region: 'banff',
    url: '#banff-venues',
    capacity: '20-150 guests',
    priceRange: '$$$-$$$$',
    features: ['Mountain Views', 'Elegant Setting', 'Intimate Ceremonies', 'Modern Amenities'],
    placeId: 'ChIJXdYXc8PPcFMR2FLpubbFK70',
    address: '900A Harvie Heights Rd, Bighorn No. 8, AB T1W 2W2, Canada'
  },
  {
    id: 'banff-springs',
    name: 'Fairmont Banff Springs Hotel',
    location: 'Banff, Alberta',
    description: "Known as Canada's 'Castle in the Rockies,' this historic hotel offers luxurious wedding venues with stunning mountain views.",
    coordinates: { lat: 51.1645, lng: -115.5708 },
    image: 'assets/images/venues/banff-springs-main.jpg',
    region: 'banff',
    url: '#banff-venues',
    capacity: '10-800 guests',
    priceRange: '$$$-$$$$',
    features: ['Historic Castle', 'Mountain Views', 'Luxury Accommodations', 'Multiple Ceremony Sites'],
    placeId: 'ChIJv7gvLjvKcFMRzvb0LKnpmQA',
    address: '405 Spray Ave, Banff, AB T1L 1J4, Canada'
  },
  {
    id: 'sky-bistro',
    name: 'Sky Bistro, Gondola',
    location: 'Banff, Alberta',
    description: 'A breathtaking mountain-top venue with panoramic views accessed by a scenic gondola ride.',
    coordinates: { lat: 51.1493, lng: -115.5731 },
    image: 'assets/images/venues/sky-bistro-main.jpg',
    region: 'banff',
    url: '#banff-venues',
    capacity: '20-200 guests',
    priceRange: '$$$-$$$$',
    features: ['Mountaintop Location', 'Panoramic Views', 'Gondola Access', 'Fine Dining'],
    placeId: 'ChIJ9S3E0PnJcFMR8dn8aW1SQns',
    address: '100 Mountain Ave, Banff, AB T1L 1J3, Canada'
  },
  {
    id: 'maple-leaf',
    name: 'The Maple Leaf',
    location: 'Banff, Alberta',
    description: 'A charming restaurant in downtown Banff offering fine dining and an intimate setting for weddings.',
    coordinates: { lat: 51.1767, lng: -115.5712 },
    image: 'assets/images/venues/maple-leaf-main.jpg',
    region: 'banff',
    url: '#banff-venues',
    capacity: '10-80 guests',
    priceRange: '$$-$$$',
    features: ['Downtown Location', 'Fine Dining', 'Intimate Setting', 'Canadian Cuisine'],
    placeId: 'ChIJJ8_i30XKcFMRX4-EqsUwfec',
    address: '137 Banff Ave, Banff, AB T1L 1C8, Canada'
  },
  {
    id: 'mt-norquay',
    name: 'Mt. Norquay',
    location: 'Banff, Alberta',
    description: 'A ski resort venue with spectacular mountain vistas and a rustic lodge atmosphere.',
    coordinates: { lat: 51.2080, lng: -115.5937 },
    image: 'assets/images/venues/mt-norquay-main.jpg',
    region: 'banff',
    url: '#banff-venues',
    capacity: '50-200 guests',
    priceRange: '$$-$$$',
    features: ['Mountain Resort', 'Scenic Views', 'Rustic Lodge', 'Outdoor Ceremonies'],
    placeId: 'ChIJPe5LM-_KcFMRj5sq8kzdj38',
    address: 'Improvement District No. 9, AB T0L 1E0, Canada'
  },
  {
    id: 'three-bears',
    name: 'Three Bears Brewery',
    location: 'Banff, Alberta',
    description: 'A unique brewery venue with rustic-industrial charm in the heart of Banff.',
    coordinates: { lat: 51.1761, lng: -115.5693 },
    image: 'assets/images/venues/three-bears-main.jpg',
    region: 'banff',
    url: '#banff-venues',
    capacity: '30-150 guests',
    priceRange: '$$-$$$',
    features: ['Brewery Setting', 'Urban Rustic', 'Craft Beer', 'Downtown Location'],
    placeId: 'ChIJ0cdeKZvLcFMR0jSmXX0uyAI',
    address: '205 Bear St, Banff, AB T1L 1A1, Canada'
  },

  // CANMORE VENUES
  {
    id: 'mainspace-solara',
    name: 'Mainspace Solara',
    location: 'Canmore, Alberta',
    description: 'A contemporary event space with mountain views and flexible layouts for weddings of all sizes.',
    coordinates: { lat: 51.0899, lng: -115.3487 },
    image: 'assets/images/venues/mainspace-solara-main.jpg',
    region: 'canmore',
    url: '#canmore-venues',
    capacity: '20-250 guests',
    priceRange: '$$-$$$',
    features: ['Contemporary Space', 'Flexible Layout', 'Mountain Views', 'Modern Amenities'],
    placeId: 'ChIJB9obQr3FcFMRV5tPjm8UHow',
    address: '187 Kananaskis Way, Canmore, AB T1W 2A3, Canada'
  },
  {
    id: 'stewart-creek',
    name: 'Stewart Creek Golf Course',
    location: 'Canmore, Alberta',
    description: 'An elegant golf course venue with stunning mountain backdrops and a modern clubhouse for receptions.',
    coordinates: { lat: 51.0574, lng: -115.3696 },
    image: 'assets/images/venues/stewart-creek-main.jpg',
    region: 'canmore',
    url: '#canmore-venues',
    capacity: '20-180 guests',
    priceRange: '$$-$$$',
    features: ['Golf Course', 'Mountain Views', 'Modern Clubhouse', 'Outdoor Terrace'],
    placeId: 'ChIJq8NNqcLFcFMRsFwhjZDQI-8',
    address: '4100 Stewart Creek Dr, Canmore, AB T1W 2V3, Canada'
  },
  {
    id: 'silvertip',
    name: 'Silvertip Resort',
    location: 'Canmore, Alberta',
    description: 'A mountain golf resort offering stunning views of the Three Sisters peaks with beautiful indoor and outdoor ceremony spaces.',
    coordinates: { lat: 51.0911, lng: -115.3126 },
    image: 'assets/images/venues/silvertip-main.jpg',
    region: 'canmore',
    url: '#canmore-venues',
    capacity: '20-250 guests',
    priceRange: '$$$-$$$$',
    features: ['Golf Resort', 'Mountain Views', 'Indoor & Outdoor Options', 'Luxury Experience'],
    placeId: 'ChIJRbfHuJnFcFMRHo1burdyy9w',
    address: '2000 Silvertip Trail, Canmore, AB T1W 3J4, Canada'
  },
  {
    id: 'malcolm-hotel',
    name: 'The Malcolm Hotel',
    location: 'Canmore, Alberta',
    description: 'A luxury hotel with Scottish-inspired elegance and sophisticated ballrooms for weddings.',
    coordinates: { lat: 51.0875, lng: -115.3480 },
    image: 'assets/images/venues/malcolm-hotel-main.jpg',
    region: 'canmore',
    url: '#canmore-venues',
    capacity: '30-200 guests',
    priceRange: '$$$-$$$$',
    features: ['Luxury Hotel', 'Ballroom Setting', 'Scottish Heritage', 'Downtown Location'],
    placeId: 'ChIJCWB_67_FcFMRbSV-ZuLW46E',
    address: '321 Spring Creek Dr, Canmore, AB T1W 2G2, Canada'
  },
  {
    id: 'creekside-villa',
    name: 'Creekside Villa',
    location: 'Canmore, Alberta',
    description: 'A charming boutique venue with a picturesque setting along the creek and mountain views.',
    coordinates: { lat: 51.0816, lng: -115.3578 },
    image: 'assets/images/venues/creekside-villa-main.jpg',
    region: 'canmore',
    url: '#canmore-venues',
    capacity: '10-120 guests',
    priceRange: '$$-$$$',
    features: ['Boutique Venue', 'Creekside Setting', 'Intimate Atmosphere', 'Mountain Views'],
    placeId: 'ChIJNRHJp6bFcFMRC7Askc-fjPM',
    address: '709 Benchlands Trail, Canmore, AB T1W 3G9, Canada'
  },
  {
    id: 'finchys',
    name: "Finchy's @CanGOLF",
    location: 'Canmore, Alberta',
    description: 'A unique golf simulator and event space offering a fun, casual setting for wedding events.',
    coordinates: { lat: 51.0925, lng: -115.3434 },
    image: 'assets/images/venues/finchys-main.jpg',
    region: 'canmore',
    url: '#canmore-venues',
    capacity: '20-100 guests',
    priceRange: '$$-$$$',
    features: ['Golf Simulator', 'Casual Setting', 'Unique Experience', 'Entertainment Options'],
    placeId: 'ChIJWdSpew7FcFMRNeLYTIEUp_U',
    address: '306 Bow Valley Trail #125B, Canmore, AB T1W 0N2, Canada'
  },

  // LAKE LOUISE VENUES
  {
    id: 'chateau-louise',
    name: 'Fairmont Chateau Lake Louise',
    location: 'Lake Louise, Alberta',
    description: 'An iconic venue on the shores of the emerald waters of Lake Louise with glacier views.',
    coordinates: { lat: 51.4168, lng: -116.2175 },
    image: 'assets/images/venues/lake-louise-main.jpg',
    region: 'lake-louise',
    url: '#lake-louise-venues',
    capacity: '10-550 guests',
    priceRange: '$$$-$$$$',
    features: ['Iconic Location', 'Lakeside Ceremonies', 'Historic Hotel', 'Luxury Experience'],
    placeId: 'ChIJNZqvCRJdd1MRBBS7Nem5IEQ',
    address: '111 Lake Louise Dr, Lake Louise, AB T0L 1E0, Canada'
  },

  // GOLDEN (BC) VENUES
  {
    id: 'kicking-horse',
    name: 'Kicking Horse Resort',
    location: 'Golden, British Columbia',
    description: 'A mountain resort offering breathtaking views and versatile venues for weddings throughout the year.',
    coordinates: { lat: 51.2980, lng: -117.0475 },
    image: 'assets/images/venues/kicking-horse-main.jpg',
    region: 'golden',
    url: '#golden-venues',
    capacity: '20-200 guests',
    priceRange: '$$$-$$$$',
    features: ['Mountain Resort', 'Panoramic Views', 'Gondola Access', 'Luxury Experience'],
    placeId: 'ChIJSV7VHe2-eVMRaeruFCGNjys',
    address: '1500 Kicking Horse Trail, Golden, BC V0A 1H0, Canada'
  },
  {
    id: 'hillside-lodge',
    name: 'Hillside Lodge & Chalets',
    location: 'Golden, British Columbia',
    description: 'A rustic lodge with private chalets nestled in the mountains, perfect for intimate weddings.',
    coordinates: { lat: 51.3194, lng: -116.9722 },
    image: 'assets/images/venues/hillside-lodge-main.jpg',
    region: 'golden',
    url: '#golden-venues',
    capacity: '10-60 guests',
    priceRange: '$$-$$$',
    features: ['Rustic Lodge', 'Private Chalets', 'Forest Setting', 'Intimate Weddings'],
    placeId: 'ChIJ1S0CAQXIeVMRPoV7JAGqCfk',
    address: '1740 Seward Frontage Rd, Golden, BC V0A 1H0, Canada'
  },

  // EMERALD LAKE (also in BC)
  {
    id: 'emerald-lake',
    name: 'Emerald Lake Lodge',
    location: 'Field, British Columbia',
    description: 'A secluded lodge on the shores of the vibrant, glacier-fed Emerald Lake, perfect for intimate weddings.',
    coordinates: { lat: 51.4429, lng: -116.5285 },
    image: 'assets/images/venues/emerald-lake-main.jpg',
    region: 'emerald-lake',
    url: '#emerald-lake-venues',
    capacity: '10-88 guests',
    priceRange: '$$$-$$$$',
    features: ['Secluded Location', 'Emerald Waters', 'Intimate Setting', 'Mountain Backdrop'],
    placeId: 'ChIJ4f_____YeVMRKF7Aq3XdVWA',
    address: '1 Emerald Lake Rd, Field, BC V0A 1G0, Canada'
  },

  // JASPER VENUES
  {
    id: 'pyramid-lake',
    name: 'Pyramid Lake Lodge',
    location: 'Jasper, Alberta',
    description: 'Charming lakeside lodge with mountain views and private island for ceremonies.',
    coordinates: { lat: 52.9310, lng: -118.0945 },
    image: 'assets/images/venues/pyramid-lake-main.jpg',
    region: 'jasper',
    url: '#jasper-venues',
    capacity: '10-120 guests',
    priceRange: '$$$-$$$$',
    features: ['Lakeside Setting', 'Private Island', 'Mountain Views', 'Intimate Setting'],
    placeId: 'ChIJNdqht7Asg1MRD2BtHQ5gK14',
    address: 'Km North On, Pyramid Lake Rd #6, Jasper, AB T0E 0A8, Canada'
  },
  {
    id: 'maligne-lake',
    name: 'Maligne Lake Chalet',
    location: 'Jasper, Alberta',
    description: 'Historic chalet on the shores of iconic Maligne Lake with stunning mountain backdrops.',
    coordinates: { lat: 52.7167, lng: -117.6333 },
    image: 'assets/images/venues/maligne-lake-main.jpg',
    region: 'jasper',
    url: '#jasper-venues',
    capacity: '10-80 guests',
    priceRange: '$$$',
    features: ['Historic Property', 'Lakeside Setting', 'Wilderness Experience', 'Exclusive Use'],
    placeId: 'ChIJUQutQugpnVMR9MUUneTFKiU',
    address: 'Maligne Lake Rd, Jasper, AB T0E 1E0, Canada'
  },

  // COCHRANE VENUES
  {
    id: 'cochrane-ranchehouse',
    name: 'Cochrane RancheHouse',
    location: 'Cochrane, Alberta',
    description: 'A charming venue with rustic elegance and panoramic views of the Rocky Mountains and Bow River Valley.',
    coordinates: { lat: 51.1945, lng: -114.4669 },
    image: 'assets/images/venues/cochrane-ranchehouse-main.jpg',
    region: 'cochrane',
    url: '#cochrane-venues',
    capacity: '20-320 guests',
    priceRange: '$$-$$$',
    features: ['Mountain Views', 'Rustic Elegance', 'Indoor & Outdoor Options', 'Historical Setting'],
    placeId: 'ChIJqc_3Qnm-cUERNkoe0vmMnJI',
    address: '101 Ranchehouse Rd, Cochrane, AB T4C 2K8, Canada'
  },
  
  // KANANASKIS VENUE
  {
    id: 'mount-engadine',
    name: 'Mount Engadine Lodge',
    location: 'Kananaskis, Alberta',
    description: 'A secluded mountain lodge perfect for intimate weddings in a pristine wilderness setting.',
    coordinates: { lat: 50.9034, lng: -115.1926 },
    image: 'assets/images/venues/mount-engadine-main.jpg',
    region: 'kananaskis',
    url: '#kananaskis-venues',
    capacity: '10-40 guests',
    priceRange: '$$$-$$$$',
    features: ['Intimate Setting', 'Wildlife Viewing', 'Remote Lodge', 'All-Inclusive'],
    placeId: 'ChIJXVoDqcv4cFMRaEOZhQr6gOY',
    address: 'Mount Shark Rd, Kananaskis, AB T0L 1E0, Canada'
  }
];

document.addEventListener('DOMContentLoaded', () => {
    initInteractiveMap();    // Google Maps + all venue markers
    initVenueGalleries();    // Auto-rotating gallery
    initVenueModal();        // Inquiry form modal
    initVirtualTours();      // 360 tours
    initRegionFilters();     // Smooth scrolling for region links
    initVenueComparison();   // Comparison tool
    initSmoothScrolling();   // Anchor scrolling
    initVenuePlanner();      // Planner tool
  });
  
  /* --------------------------------
     1) Initialize Interactive Map
  --------------------------------- */
  function initInteractiveMap() {
    const mapContainer = document.getElementById('venuesMap');
    if (!mapContainer) {
      console.error('Map container not found (id="venuesMap").');
      return;
    }
  
    // Ensure map container has dimension
    if (mapContainer.offsetWidth === 0 || mapContainer.offsetHeight === 0) {
      console.warn('Map container has zero width/height; setting minHeight=500px.');
      mapContainer.style.minHeight = '500px';
    }
  
    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      console.error('Google Maps API not available.');
      return;
    }
  
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
      map = new google.maps.Map(mapContainer, mapOptions);
    } catch (error) {
      console.error('Error initializing map:', error);
      mapContainer.innerHTML = `
        <div class="map-error">
          <h3>Map Loading Error</h3>
          <p>We couldn't load the interactive venue map. Please refresh or try again later.</p>
          <p>Error: ${error.message}</p>
        </div>
      `;
      return;
    }
    console.log('Google Maps initialized.');
  
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
  
    // ----------------------------------------------------------------
    // Remove the duplicate venueMarkers array from here (moved to top of file)
    // ----------------------------------------------------------------
    
    // Attach markers & info windows
    venueMarkers.forEach(venue => {
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
     5) 360° Virtual Tours (Simplified)
  --------------------------------------- */
  async function initVirtualTours() {
    try {
      if (google?.maps?.importLibrary) {
        await google.maps.importLibrary('places');
        await google.maps.importLibrary('streetView');
      }
    } catch (err) {
      console.warn('importLibrary not supported in older browsers:', err);
    }
  
    const tourModal = document.getElementById('tourModal');
    if (!tourModal) return;
  
    const tourButtons = document.querySelectorAll('.view-360');
    const closeButton = tourModal.querySelector('.close-modal');
    const tourContainer = document.getElementById('tourContainer');
  
    tourButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const venueId = btn.dataset.venue || '';
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
      
      if (!venue || !venue.placeId) {
        showTourError(venueId);
        return;
      }
      
      try {
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
        
        const sv = new google.maps.StreetViewService();
        sv.getPanorama({ placeId: venue.placeId }, (data, status) => {
          if (status === 'OK') {
            // Success - show Street View
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
            sv.getPanorama({
              location: venue.coordinates,
              radius: 100,
              source: google.maps.StreetViewSource.OUTDOOR
            }, (data, status) => {
              if (status === 'OK') {
                panorama.setPano(data.location.pano);
              } else {
                showTourError(venueId, venue);
              }
            });
          }
        });
      } catch (error) {
        console.error('Street View error:', error);
        showTourError(venueId, venue);
      }
    }
    
    function showTourError(venueId, venue = null) {
      let mapUrl = 'https://www.google.com/maps';
      if (venue) {
        const lat = venue.coordinates.lat;
        const lng = venue.coordinates.lng;
        mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=18`;
      } else if (venueId) {
        // Try to find the venue by ID if not provided
        const foundVenue = venueMarkers.find(marker => marker.id === venueId);
        if (foundVenue && foundVenue.coordinates) {
          const lat = foundVenue.coordinates.lat;
          const lng = foundVenue.coordinates.lng;
          mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=18`;
        }
      }
      
      tourContainer.innerHTML = `
        <div class="tour-error">
          <p>Street View for <strong>${venue ? venue.name : venueId}</strong> is not available.</p>
          <button class="btn btn-primary" id="viewOnMap">View on Google Maps</button>
        </div>
      `;
      
      const viewOnMapBtn = document.getElementById('viewOnMap');
      if (viewOnMapBtn) {
        viewOnMapBtn.addEventListener('click', () => {
          window.open(mapUrl, '_blank');
        });
      }
    }
  
    function showTourModal() {
      tourModal.classList.add('active');
      setTimeout(() => {
        const content = tourModal.querySelector('.modal-content');
        if (content) content.classList.add('modal-animate');
      }, 100);
      document.body.style.overflow = 'hidden';
    }
  
    function closeTourModal() {
      const content = tourModal.querySelector('.modal-content');
      if (content) content.classList.remove('modal-animate');
      setTimeout(() => {
        tourModal.classList.remove('active');
        document.body.style.overflow = '';
        tourContainer.innerHTML = '';
      }, 300);
    }
  
    if (closeButton) closeButton.addEventListener('click', closeTourModal);
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
  