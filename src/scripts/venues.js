document.addEventListener('DOMContentLoaded', () => {
    initInteractiveMap();
    initVenueGalleries();
    initVenueModal();
    initVirtualTours();
    initRegionFilters();
    initVenueComparison();
    initSmoothScrolling();
    initVenuePlanner();
});

// Google Maps interactive map with 3D capabilities
function initInteractiveMap() {
    const mapContainer = document.getElementById('venuesMap');
    if (!mapContainer) {
        console.error('Map container not found. Ensure there is an element with id "venuesMap" on the page.');
        return;
    }

    // Check if mapContainer has dimensions
    if (mapContainer.offsetWidth === 0 || mapContainer.offsetHeight === 0) {
        console.error('Map container has zero width or height. Ensure the container has proper dimensions.');
        mapContainer.style.minHeight = '500px'; // Apply a default height
    }

    // Add additional debugging
    console.log('Initializing Google Maps...');
    console.log('Map container dimensions:', mapContainer.offsetWidth, 'x', mapContainer.offsetHeight);
    
    // Check if Google Maps is defined
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API is not loaded!');
        return;
    }

    // Custom map styles for a mountain/outdoors theme similar to Mapbox
    const mapStyles = [
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [{"color": "#dde2e3"}, {"visibility": "on"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#a9de83"}, {"visibility": "on"}]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry",
            "stylers": [{"color": "#c9e9b2"}, {"visibility": "on"}]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#a6cbe3"}, {"visibility": "on"}]
        },
        {
            "featureType": "poi.attraction",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.business",
            "stylers": [{"visibility": "off"}]
        }
    ];

    // Initialize the map with 3D capabilities and error handling
    try {
        const mapOptions = {
            center: { lat: 51.1645, lng: -115.5708 }, // Banff area
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
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
            tilt: 45 // Add 3D perspective similar to Mapbox pitch
        };

        const map = new google.maps.Map(mapContainer, mapOptions);
        
        // Log successful map creation
        console.log('Google Maps created successfully');

        // Create custom marker icons based on venue region
        function createMarkerIcon(region) {
            const colors = {
                'banff': '#e74c3c', // Red
                'canmore': '#3498db', // Blue
                'lake-louise': '#2ecc71', // Green
                'emerald-lake': '#27ae60', // Darker Green
                'kananaskis': '#f39c12', // Orange
                'jasper': '#9b59b6', // Purple
                'golden': '#f1c40f' // Yellow/Gold
            };
            
            const color = colors[region] || '#e74c3c'; // Default to red
            
            return {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: 10
            };
        }
        
        // Add all venue markers in the correct order with proper coordinates
        const venueMarkers = [
            // BANFF VENUES
            {
                id: 'the-gem',
                name: 'The Gem',
                location: 'Bighorn No. 8, Alberta',
                description: 'An elegant venue with magnificent mountain views, perfect for intimate weddings and celebrations.',
                coordinates: { lat: 51.0977, lng: -115.3392 }, // Harvie Heights coordinates
                image: 'assets/images/venues/the-gem-main.jpg',
                region: 'banff',
                url: '#banff-venues',
                capacity: '20-150 guests',
                priceRange: '$$$-$$$$',
                features: ['Mountain Views', 'Elegant Setting', 'Intimate Ceremonies', 'Modern Amenities'],
                featured: true // Featured venue
            },
            {
                id: 'banff-springs',
                name: 'Fairmont Springs Hotel',
                location: 'Banff, Alberta',
                description: 'Known as Canada\'s "Castle in the Rockies," this historic hotel offers luxurious wedding venues with stunning mountain views.',
                coordinates: { lat: 51.1645, lng: -115.5708 },
                image: 'assets/images/venues/banff-springs-main.jpg',
                region: 'banff',
                url: '#banff-venues',
                capacity: '10-800 guests',
                priceRange: '$$$-$$$$',
                features: ['Historic Castle', 'Mountain Views', 'Luxury Accommodations', 'Multiple Ceremony Sites']
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
                features: ['Mountaintop Location', 'Panoramic Views', 'Gondola Access', 'Fine Dining']
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
                features: ['Downtown Location', 'Fine Dining', 'Intimate Setting', 'Canadian Cuisine']
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
                features: ['Mountain Resort', 'Scenic Views', 'Rustic Lodge', 'Outdoor Ceremonies']
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
                features: ['Brewery Setting', 'Urban Rustic', 'Craft Beer', 'Downtown Location']
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
                featured: true // Featured venue
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
                features: ['Golf Course', 'Mountain Views', 'Modern Clubhouse', 'Outdoor Terrace']
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
                features: ['Golf Resort', 'Mountain Views', 'Indoor & Outdoor Options', 'Luxury Experience']
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
                features: ['Luxury Hotel', 'Ballroom Setting', 'Scottish Heritage', 'Downtown Location']
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
                features: ['Boutique Venue', 'Creekside Setting', 'Intimate Atmosphere', 'Mountain Views']
            },
            {
                id: 'finchys',
                name: 'Finchy\'s @CanGOLF',
                location: 'Canmore, Alberta',
                description: 'A unique golf simulator and event space offering a fun, casual setting for wedding events.',
                coordinates: { lat: 51.0925, lng: -115.3434 },
                image: 'assets/images/venues/finchys-main.jpg',
                region: 'canmore',
                url: '#canmore-venues',
                capacity: '20-100 guests',
                priceRange: '$$-$$$',
                features: ['Golf Simulator', 'Casual Setting', 'Unique Experience', 'Entertainment Options']
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
                featured: true // Featured venue
            },
            
            // GOLDEN, BC VENUES
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
                featured: true // Featured venue
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
                features: ['Rustic Lodge', 'Private Chalets', 'Forest Setting', 'Intimate Weddings']
            },
            {
                id: 'emerald-lodge',
                name: 'Emerald Lake Lodge',
                location: 'Field, British Columbia',
                description: 'A secluded lodge on the shores of the vibrant, glacier-fed Emerald Lake, perfect for intimate weddings.',
                coordinates: { lat: 51.4429, lng: -116.5285 },
                image: 'assets/images/venues/emerald-lake-main.jpg',
                region: 'emerald-lake',
                url: '#emerald-lake-venues',
                capacity: '10-88 guests',
                priceRange: '$$$-$$$$',
                features: ['Secluded Location', 'Emerald Waters', 'Intimate Setting', 'Mountain Backdrop']
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
                featured: true // Featured venue
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
                features: ['Historic Property', 'Lakeside Setting', 'Wilderness Experience', 'Exclusive Use']
            }
        ];

        // Create and add markers to the map
        venueMarkers.forEach(venue => {
            // Create a custom marker
            const marker = new google.maps.Marker({
                position: venue.coordinates,
                map: map,
                title: venue.name,
                icon: createMarkerIcon(venue.region),
                animation: google.maps.Animation.DROP,
                optimized: true
            });

            // Create info window content
            const infoWindowContent = `
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
            
            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent,
                maxWidth: 320
            });

            // Add click listener to marker
            marker.addListener('click', () => {
                // Close any open info windows
                venueMarkers.forEach(v => {
                    if (v.infoWindow && v.infoWindow.getMap()) {
                        v.infoWindow.close();
                    }
                });
                
                // Open this info window
                infoWindow.open(map, marker);
                
                // Store reference to this info window
                venue.infoWindow = infoWindow;
                
                // Animate marker on click
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => {
                    marker.setAnimation(null);
                }, 750);
            });
            
            // Add hover effect
            marker.addListener('mouseover', () => {
                marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                marker.setIcon({
                    ...createMarkerIcon(venue.region),
                    scale: 12 // Make marker larger on hover
                });
            });
            
            marker.addListener('mouseout', () => {
                marker.setIcon(createMarkerIcon(venue.region));
            });
            
            // Store marker reference to venue object
            venue.marker = marker;
        });

        // Add region filter functionality
        const regionFilters = document.querySelectorAll('.region-filter');
        regionFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Update active filter
                regionFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                const region = filter.dataset.region;
                
                // Filter markers
                venueMarkers.forEach(venue => {
                    if (region === 'all' || venue.region === region) {
                        venue.marker.setVisible(true);
                    } else {
                        venue.marker.setVisible(false);
                        
                        // Close info window if open
                        if (venue.infoWindow && venue.infoWindow.getMap()) {
                            venue.infoWindow.close();
                        }
                    }
                });
                
                // Center map on selected region
                if (region !== 'all') {
                    const regionVenues = venueMarkers.filter(v => v.region === region);
                    if (regionVenues.length > 0) {
                        // Create bounds from all markers in this region
                        const bounds = new google.maps.LatLngBounds();
                        regionVenues.forEach(venue => {
                            bounds.extend(venue.coordinates);
                        });
                        
                        // Fit map to these bounds
                        map.fitBounds(bounds);
                        
                        // Set appropriate zoom level
                        const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
                            if (map.getZoom() > 12) {
                                map.setZoom(12);
                            }
                        });
                    }
                } else {
                    // Reset view to show all venues
                    const bounds = new google.maps.LatLngBounds();
                    venueMarkers.forEach(venue => {
                        bounds.extend(venue.coordinates);
                    });
                    map.fitBounds(bounds);
                }
            });
        });
        
        // Add custom controls for 3D view
        const controlDiv = document.createElement('div');
        controlDiv.className = 'custom-map-control';
        controlDiv.style.padding = '10px';
        
        const control3DButton = document.createElement('button');
        control3DButton.style.backgroundColor = '#fff';
        control3DButton.style.border = '2px solid #ccc';
        control3DButton.style.borderRadius = '3px';
        control3DButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        control3DButton.style.cursor = 'pointer';
        control3DButton.style.marginBottom = '5px';
        control3DButton.style.padding = '8px';
        control3DButton.style.textAlign = 'center';
        control3DButton.textContent = 'Toggle 3D View';
        control3DButton.title = 'Click to toggle 3D view';
        controlDiv.appendChild(control3DButton);
        
        // Add the control to the map
        controlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
        
        // Set up the click event listener for 3D view toggle
        let is3DView = true;
        control3DButton.addEventListener('click', () => {
            if (is3DView) {
                map.setOptions({ tilt: 0 });
                is3DView = false;
                control3DButton.textContent = 'Enable 3D View';
            } else {
                map.setOptions({ tilt: 45 });
                is3DView = true;
                control3DButton.textContent = 'Disable 3D View';
            }
        });

    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        mapContainer.innerHTML = `
            <div class="map-error">
                <h3>Map Loading Error</h3>
                <p>We couldn't load the interactive venue map. Please try refreshing the page or contact us for assistance.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}

// Region filters outside of map
function initRegionFilters() {
    const regionLinks = document.querySelectorAll('.region-link');
    
    regionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow normal navigation to the venue section
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced venue galleries with auto-rotation
function initVenueGalleries() {
    const galleryContainers = document.querySelectorAll('.venue-gallery');
    
    galleryContainers.forEach(gallery => {
        const mainImage = gallery.querySelector('.gallery-main img');
        const thumbs = gallery.querySelectorAll('.gallery-thumbs img');
        let currentIndex = 0;
        let rotationTimer;
        
        // Function to change the main image
        function changeMainImage(index) {
            // Fade out current image
            mainImage.style.opacity = '0';
            
            // Wait for fade out, then change source and fade back in
            setTimeout(() => {
                const tempSrc = mainImage.src;
                const tempAlt = mainImage.alt;
                
                mainImage.src = thumbs[index].src;
                mainImage.alt = thumbs[index].alt;
                
                // Optional: swap with thumbnail
                // thumbs[index].src = tempSrc;
                // thumbs[index].alt = tempAlt;
                
                // Fade in new image
                mainImage.style.opacity = '1';
                
                // Update current index
                currentIndex = index;
            }, 300);
        }
        
        // Set up click event for thumbnails
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                changeMainImage(index);
                
                // Reset rotation timer when manually changing
                clearInterval(rotationTimer);
                startRotation();
            });
        });
        
        // Function to start auto-rotation
        function startRotation() {
            rotationTimer = setInterval(() => {
                // Calculate next index
                const nextIndex = (currentIndex + 1) % thumbs.length;
                changeMainImage(nextIndex);
            }, 4000); // Change image every 4 seconds
        }
        
        // Pause rotation when user hovers over gallery
        gallery.addEventListener('mouseenter', () => {
            clearInterval(rotationTimer);
        });
        
        // Resume rotation when user leaves
        gallery.addEventListener('mouseleave', () => {
            startRotation();
        });
        
        // Start auto-rotation initially
        startRotation();
        
        // Add progress indicator
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'gallery-progress';
        for (let i = 0; i < thumbs.length; i++) {
            const dot = document.createElement('span');
            dot.className = i === 0 ? 'progress-dot active' : 'progress-dot';
            dot.addEventListener('click', () => {
                changeMainImage(i);
                clearInterval(rotationTimer);
                startRotation();
                
                // Update active dot
                document.querySelectorAll('.progress-dot').forEach((d, idx) => {
                    d.classList.toggle('active', idx === i);
                });
            });
            progressIndicator.appendChild(dot);
        }
        gallery.appendChild(progressIndicator);
        
        // Update progress indicator on image change
        const updateProgress = () => {
            document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        };
        
        // Override the changeMainImage function to update progress
        const originalChangeMainImage = changeMainImage;
        changeMainImage = (index) => {
            originalChangeMainImage(index);
            updateProgress();
        };
    });
}

// Venue inquiry modal with enhanced form
function initVenueModal() {
    const modal = document.getElementById('venueModal');
    if (!modal) return;
    
    const inquiryButtons = document.querySelectorAll('.btn-venue-inquiry');
    const closeButton = modal.querySelector('.close-modal');
    const venueField = document.getElementById('selectedVenue');
    
    // Open modal on inquiry button click
    inquiryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const venueName = button.getAttribute('data-venue');
            
            // Set venue name in form
            venueField.value = venueName;
            
            // Show modal with animation
            modal.classList.add('active');
            setTimeout(() => {
                modal.querySelector('.modal-content').classList.add('modal-animate');
            }, 100);
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal on X button click
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.querySelector('.modal-content').classList.remove('modal-animate');
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Enhanced form with dynamic fields based on venue
    const form = document.getElementById('venueInquiryForm');
    if (form) {
        // When venue changes, update form fields
        venueField.addEventListener('change', updateFormFields);
        
        function updateFormFields() {
            const venueName = venueField.value;
            const venueSpecificFields = document.querySelector('.venue-specific-fields');
            
            // Clear existing venue-specific fields
            if (venueSpecificFields) {
                venueSpecificFields.innerHTML = '';
            } else {
                // Create container if it doesn't exist
                const container = document.createElement('div');
                container.className = 'venue-specific-fields';
                form.querySelector('.form-grid').appendChild(container);
            }
            
            // Add venue-specific fields based on venue name
            if (venueName.includes('Banff Springs')) {
                venueSpecificFields.innerHTML = `
                    <div class="form-group">
                        <label for="ceremony-location">Preferred Ceremony Location</label>
                        <select id="ceremony-location" name="ceremony-location">
                            <option value="">Select location</option>
                            <option value="terrace">Terrace</option>
                            <option value="conservatory">Conservatory</option>
                            <option value="cascade-ballroom">Cascade Ballroom</option>
                            <option value="mt-stephen-hall">Mt. Stephen Hall</option>
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
            } else if (venueName.includes('Lake Louise')) {
                venueSpecificFields.innerHTML = `
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
            // Add more venue-specific conditions as needed
        }
        
        // Form submission with validation and animation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Show loading animation
                const submitButton = form.querySelector('.btn-submit');
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual AJAX in production)
                setTimeout(() => {
                    // Show success message with animation
                    const formContent = form.querySelector('.form-grid');
                    formContent.style.opacity = '0';
                    
                    setTimeout(() => {
                        formContent.innerHTML = `
                            <div class="success-message">
                                <i class="fas fa-check-circle"></i>
                                <h3>Thank you for your inquiry!</h3>
                                <p>We will contact you within 24 hours to arrange your venue viewing.</p>
                                <button type="button" class="btn btn-primary close-success">Close</button>
                            </div>
                        `;
                        formContent.style.opacity = '1';
                        
                        // Add close button functionality
                        formContent.querySelector('.close-success').addEventListener('click', closeModal);
                    }, 300);
                }, 1500);
            }
        });
        
        function validateForm() {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            // Clear previous error messages
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            
            // Check each required field
            requiredFields.forEach(field => {
                field.classList.remove('error');
                
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message
                    const errorMessage = document.createElement('span');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    field.parentNode.appendChild(errorMessage);
                }
            });
            
            // Validate email format if provided
            const emailField = form.querySelector('#email');
            if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                
                // Add error message
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please enter a valid email address';
                emailField.parentNode.appendChild(errorMessage);
            }
            
            return isValid;
        }
        
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    }
}

// Enhanced 360° virtual tours with hotspots
function initVirtualTours() {
    const tourModal = document.getElementById('tourModal');
    if (!tourModal) return;
    
    const tourButtons = document.querySelectorAll('.view-360');
    const closeButton = tourModal.querySelector('.close-modal');
    const tourContainer = document.getElementById('tourContainer');
    
    // Tour configuration data with hotspots
    const tourConfig = {
        'banff-springs': {
            title: 'Fairmont Banff Springs Virtual Tour',
            panorama: 'assets/360-tours/banff-springs-main.jpg',
            hotSpots: [
                {
                    pitch: 10,
                    yaw: 30,
                    text: "Main Ceremony Area",
                    id: "ceremony"
                },
                {
                    pitch: -10,
                    yaw: 130,
                    text: "Reception Hall",
                    id: "reception"
                },
                {
                    pitch: 15,
                    yaw: 230,
                    text: "Mountain View",
                    id: "mountain-view"
                }
            ]
        },
        'silvertip': {
            title: 'Silvertip Resort Virtual Tour',
            panorama: 'assets/360-tours/silvertip-main.jpg',
            hotSpots: [
                {
                    pitch: 5,
                    yaw: 20,
                    text: "Outdoor Pavilion",
                    id: "pavilion"
                },
                {
                    pitch: -5,
                    yaw: 100,
                    text: "Indoor Ballroom",
                    id: "ballroom"
                },
                {
                    pitch: 10,
                    yaw: 200,
                    text: "Three Sisters View",
                    id: "three-sisters"
                }
            ]
        },
        'chateau-louise': {
            title: 'Chateau Lake Louise Virtual Tour',
            panorama: 'assets/360-tours/lake-louise-main.jpg',
            hotSpots: [
                {
                    pitch: 0,
                    yaw: 15,
                    text: "Lakefront Ceremony",
                    id: "lakefront"
                },
                {
                    pitch: -10,
                    yaw: 110,
                    text: "Victoria Ballroom",
                    id: "ballroom"
                },
                {
                    pitch: 5,
                    yaw: 230,
                    text: "Glacier View",
                    id: "glacier"
                }
            ]
        }
    };
    
    // Function to open virtual tour
    function openVirtualTour(venueId) {
        if (!tourConfig[venueId]) {
            alert('Virtual tour coming soon!');
            return;
        }
        
        const config = tourConfig[venueId];
        
        // Update modal title
        tourModal.querySelector('h2').textContent = config.title;
        
        // Initialize Pannellum viewer
        if (!window.pannellum) {
            // Load Pannellum if not already loaded
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js';
            document.head.appendChild(script);
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css';
            document.head.appendChild(link);
            
            script.onload = () => {
                initViewer(config);
            };
        } else {
            initViewer(config);
        }
        
        // Show modal
        tourModal.classList.add('active');
        setTimeout(() => {
            tourModal.querySelector('.modal-content').classList.add('modal-animate');
        }, 100);
        document.body.style.overflow = 'hidden';
    }
    
    function initViewer(config) {
        tourContainer.innerHTML = '';
        
        window.pannellum.viewer('tourContainer', {
            type: 'equirectangular',
            panorama: config.panorama,
            autoLoad: true,
            autoRotate: -2,
            hotSpots: config.hotSpots,
            hotSpotDebug: false
        });
        
        // Add tour controls
        const controls = document.createElement('div');
        controls.className = 'tour-controls';
        controls.innerHTML = `
            <button class="tour-control" data-action="zoom-in"><i class="fas fa-search-plus"></i></button>
            <button class="tour-control" data-action="zoom-out"><i class="fas fa-search-minus"></i></button>
            <button class="tour-control" data-action="fullscreen"><i class="fas fa-expand"></i></button>
        `;
        tourContainer.appendChild(controls);
        
        // Add control functionality
        controls.querySelector('[data-action="zoom-in"]').addEventListener('click', () => {
            const viewer = window.pannellum.getViewer('tourContainer');
            viewer.zoom(viewer.getHfov() - 10);
        });
        
        controls.querySelector('[data-action="zoom-out"]').addEventListener('click', () => {
            const viewer = window.pannellum.getViewer('tourContainer');
            viewer.zoom(viewer.getHfov() + 10);
        });
        
        controls.querySelector('[data-action="fullscreen"]').addEventListener('click', () => {
            const viewer = window.pannellum.getViewer('tourContainer');
            viewer.toggleFullscreen();
        });
    }
    
    // Open tour on button click
    tourButtons.forEach(button => {
        button.addEventListener('click', () => {
            const venueId = button.getAttribute('data-venue');
            openVirtualTour(venueId);
        });
    });
    
    // Make the openVirtualTour function available globally
    window.openVirtualTour = openVirtualTour;
    
    // Close modal on X button click
    if (closeButton) {
        closeButton.addEventListener('click', closeTourModal);
    }
    
    // Close modal on outside click
    tourModal.addEventListener('click', (e) => {
        if (e.target === tourModal) {
            closeTourModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tourModal.classList.contains('active')) {
            closeTourModal();
        }
    });
    
    function closeTourModal() {
        tourModal.querySelector('.modal-content').classList.remove('modal-animate');
        setTimeout(() => {
            tourModal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Visual venue comparison tool
function initVenueComparison() {
    const comparisonTable = document.querySelector('.comparison-table');
    const comparisonPlaceholder = document.querySelector('.comparison-placeholder');
    const venueSelector = document.getElementById('venueSelector');
    const addVenueBtn = document.getElementById('addVenueBtn');
    const resetCompareBtn = document.getElementById('resetCompareBtn');
    
    if (!comparisonTable || !venueSelector || !addVenueBtn) return;
    
    // Enhanced venue data for comparison with visual indicators
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
        'silvertip': {
            name: 'Silvertip Resort',
            location: 'Canmore',
            capacity: '20-250 guests',
            priceRange: '$$$-$$$$',
            priceValue: 3.5,
            indoorOutdoor: 'Both',
            accommodation: 'Nearby condos',
            accommodationValue: 3,
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#canmore-venues',
            image: 'assets/images/venues/silvertip-main.jpg',
            features: ['Golf Resort', 'Mountain Views', 'Indoor & Outdoor Options', 'Luxury Experience'],
            rating: 4.8
        },
        'cornerstone': {
            name: 'Cornerstone Theatre',
            location: 'Canmore',
            capacity: '50-220 guests',
            priceRange: '$$-$$$',
            priceValue: 2.5,
            indoorOutdoor: 'Indoor only',
            accommodation: 'Nearby hotels',
            accommodationValue: 2,
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#canmore-venues',
            image: 'assets/images/venues/cornerstone-main.jpg',
            features: ['Rustic Design', 'Theatrical Space', 'Customizable', 'Downtown Location'],
            rating: 4.6
        },
        'stewart-creek': {
            name: 'Stewart Creek Golf Club',
            location: 'Canmore',
            capacity: '20-180 guests',
            priceRange: '$$-$$$',
            priceValue: 2.5,
            indoorOutdoor: 'Both',
            accommodation: 'Nearby hotels',
            accommodationValue: 2,
            catering: 'In-house only',
            seasonalAvailability: 'May-October',
            viewDetailsLink: '#canmore-venues',
            image: 'assets/images/venues/stewart-creek-main.jpg',
            features: ['Golf Course', 'Mountain Views', 'Modern Clubhouse', 'Outdoor Terrace'],
            rating: 4.5
        },
        'chateau-louise': {
            name: 'Fairmont Chateau Lake Louise',
            location: 'Lake Louise',
            capacity: '10-550 guests',
            priceRange: '$$$-$$$$',
            priceValue: 4,
            indoorOutdoor: 'Both',
            accommodation: 'On-site (539 rooms)',
            accommodationValue: 5,
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#lake-louise-venues',
            image: 'assets/images/venues/lake-louise-main.jpg',
            features: ['Iconic Location', 'Lakeside Ceremonies', 'Historic Hotel', 'Luxury Experience'],
            rating: 4.9
        },
        'post-hotel': {
            name: 'Post Hotel & Spa',
            location: 'Lake Louise',
            capacity: '10-90 guests',
            priceRange: '$$$-$$$$',
            priceValue: 3.5,
            indoorOutdoor: 'Both',
            accommodation: 'On-site (96 rooms)',
            accommodationValue: 4,
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#lake-louise-venues',
            image: 'assets/images/venues/post-hotel-main.jpg',
            features: ['Intimate Setting', 'Luxury Spa', 'Fine Dining', 'River Views'],
            rating: 4.8
        },
        'emerald-lodge': {
            name: 'Emerald Lake Lodge',
            location: 'Emerald Lake, BC',
            capacity: '10-88 guests',
            priceRange: '$$$-$$$$',
            priceValue: 3.5,
            indoorOutdoor: 'Both',
            accommodation: 'On-site (85 rooms)',
            accommodationValue: 4,
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#emerald-lake-venues',
            image: 'assets/images/venues/emerald-lake-main.jpg',
            features: ['Secluded Location', 'Emerald Waters', 'Intimate Setting', 'Mountain Backdrop'],
            rating: 4.8
        },
        'kananaskis-resort': {
            name: 'Kananaskis Mountain Lodge',
            location: 'Kananaskis',
            capacity: '20-250 guests',
            priceRange: '$$$-$$$$',
            priceValue: 3.5,
            indoorOutdoor: 'Both',
            accommodation: 'On-site (247 rooms)',
            accommodationValue: 4.5,
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#kananaskis-venues',
            image: 'assets/images/venues/kananaskis-main.jpg',
            features: ['Mountain Resort', 'Valley Views', 'Spa Services', 'Adventure Activities'],
            rating: 4.7
        },
        'boundary-ranch': {
            name: 'Boundary Ranch',
            location: 'Kananaskis',
            capacity: '50-200 guests',
            priceRange: '$$-$$$',
            priceValue: 2.5,
            indoorOutdoor: 'Both',
            accommodation: 'Nearby hotels',
            accommodationValue: 2,
            catering: 'In-house or external',
            seasonalAvailability: 'May-October',
            viewDetailsLink: '#kananaskis-venues',
            image: 'assets/images/venues/boundary-ranch-main.jpg',
            features: ['Western Theme', 'Ranch Setting', 'Mountain Views', 'Outdoor Activities'],
            rating: 4.6
        },
        'mount-engadine': {
            name: 'Mount Engadine Lodge',
            location: 'Kananaskis',
            capacity: '10-40 guests',
            priceRange: '$$-$$$',
            priceValue: 3,
            indoorOutdoor: 'Both',
            accommodation: 'On-site (19 rooms)',
            accommodationValue: 3.5,
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#kananaskis-venues',
            image: 'assets/images/venues/mount-engadine-main.jpg',
            features: ['Intimate Setting', 'Wildlife Viewing', 'All-Inclusive', 'Remote Location'],
            rating: 4.7
        }
    };
    
    // Store current venues being compared
    let comparedVenues = [];
    
    // Create container for visual comparison cards
    const comparisonCards = document.createElement('div');
    comparisonCards.className = 'comparison-cards';
    comparisonTable.appendChild(comparisonCards);
    
    // Add venue to comparison
    addVenueBtn.addEventListener('click', () => {
        const selectedVenue = venueSelector.value;
        
        if (!selectedVenue) {
            showToast('Please select a venue to compare', 'warning');
            return;
        }
        
        // Check if already comparing 3 venues
        if (comparedVenues.length >= 3) {
            showToast('You can compare up to 3 venues. Please remove a venue first.', 'warning');
            return;
        }
        
        // Check if venue is already being compared
        if (comparedVenues.includes(selectedVenue)) {
            showToast('This venue is already in your comparison', 'info');
            return;
        }
        
        // Add venue to comparison
        comparedVenues.push(selectedVenue);
        
        // Update comparison table
        updateComparisonCards();
        
        // Show success toast
        showToast(`${venueData[selectedVenue].name} added to comparison`, 'success');
    });
    
    // Reset comparison
    if (resetCompareBtn) {
        resetCompareBtn.addEventListener('click', () => {
            comparedVenues = [];
            
            // Hide table and show placeholder
            comparisonTable.style.display = 'none';
            comparisonPlaceholder.style.display = 'block';
            
            // Show reset toast
            showToast('Comparison reset', 'info');
        });
    }
    
    // Toast notification system
    function showToast(message, type = 'info') {
        // Create toast element if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add toast styling
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                .toast {
                    padding: 12px 20px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    color: white;
                    font-size: 16px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 280px;
                    max-width: 320px;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: toast-in 0.3s ease forwards;
                }
                .toast.success {
                    background-color: #4CAF50;
                }
                .toast.warning {
                    background-color: #ff9800;
                }
                .toast.error {
                    background-color: #f44336;
                }
                .toast.info {
                    background-color: #2196F3;
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: 10px;
                }
                @keyframes toast-in {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes toast-out {
                    to {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;
        toastContainer.appendChild(toast);
        
        // Add close button functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'toast-out 0.3s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toast-out 0.3s ease forwards';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, 3000);
    }
    
    // Update comparison cards with venue data
    function updateComparisonCards() {
        // Show table and hide placeholder
        comparisonTable.style.display = 'block';
        comparisonPlaceholder.style.display = 'none';
        
        // Clear comparison cards
        comparisonCards.innerHTML = '';
        
        // Add comparison cards for each venue
        comparedVenues.forEach(venueId => {
            const venue = venueData[venueId];
            if (!venue) return;
            
            // Create comparison card
            const card = document.createElement('div');
            card.className = 'comparison-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-image">
                        <img src="${venue.image}" alt="${venue.name}">
                    </div>
                    <h3>${venue.name}</h3>
                    <div class="venue-rating">
                        ${generateStarRating(venue.rating)}
                        <span class="rating-value">${venue.rating}</span>
                    </div>
                    <p class="venue-location"><i class="fas fa-map-marker-alt"></i> ${venue.location}</p>
                </div>
                <div class="comparison-features">
                    <div class="feature">
                        <span class="feature-name">Capacity</span>
                        <span class="feature-value">${venue.capacity}</span>
                    </div>
                    <div class="feature">
                        <span class="feature-name">Price Range</span>
                        <span class="feature-value">
                            ${venue.priceRange}
                            ${generatePriceIndicator(venue.priceValue)}
                        </span>
                    </div>
                    <div class="feature">
                        <span class="feature-name">Indoor/Outdoor</span>
                        <span class="feature-value">${venue.indoorOutdoor}</span>
                    </div>
                    <div class="feature">
                        <span class="feature-name">Accommodation</span>
                        <span class="feature-value">
                            ${venue.accommodation}
                            ${generateAccommodationIndicator(venue.accommodationValue)}
                        </span>
                    </div>
                    <div class="feature">
                        <span class="feature-name">Catering</span>
                        <span class="feature-value">${venue.catering}</span>
                    </div>
                    <div class="feature">
                        <span class="feature-name">Availability</span>
                        <span class="feature-value">${venue.seasonalAvailability}</span>
                    </div>
                    <div class="feature">
                        <span class="feature-name">Features</span>
                        <div class="feature-tags">
                            ${venue.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    <a href="${venue.viewDetailsLink}" class="btn btn-secondary">View Details</a>
                    <button class="btn btn-outline remove-venue" data-venue="${venueId}">Remove</button>
                </div>
            `;
            
            comparisonCards.appendChild(card);
        });
        
        // Re-add event listeners for remove buttons
        document.querySelectorAll('.remove-venue').forEach(button => {
            button.addEventListener('click', function() {
                const venueId = this.getAttribute('data-venue');
                const venueIndex = comparedVenues.indexOf(venueId);
                
                if (venueIndex > -1) {
                    comparedVenues.splice(venueIndex, 1);
                    updateComparisonCards();
                    
                    // Show removed toast
                    showToast(`${venueData[venueId].name} removed from comparison`, 'info');
                    
                    // If no venues left, show placeholder
                    if (comparedVenues.length === 0) {
                        comparisonTable.style.display = 'none';
                        comparisonPlaceholder.style.display = 'block';
                    }
                }
            });
        });
        
        // Highlight differences
        highlightDifferences();
    }
    
    // Function to highlight differences between venues
    function highlightDifferences() {
        if (comparedVenues.length < 2) return;
        
        // Collect all feature values
        const features = ['priceRange', 'indoorOutdoor', 'accommodation', 'catering', 'seasonalAvailability'];
        
        features.forEach(feature => {
            const values = comparedVenues.map(venueId => venueData[venueId][feature]);
            const allSame = values.every(val => val === values[0]);
            
            if (!allSame) {
                // Find all feature elements for this property
                document.querySelectorAll(`.feature:has(.feature-name:contains("${feature}"))`).forEach(featureEl => {
                    featureEl.classList.add('highlight-difference');
                });
            }
        });
    }
    
    // Helper functions for visual indicators
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Add half star if needed
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    function generatePriceIndicator(priceValue) {
        const maxPrice = 5;
        let indicator = '<div class="price-indicator">';
        
        for (let i = 0; i < maxPrice; i++) {
            if (i < priceValue) {
                indicator += '<span class="price-dot active"></span>';
            } else {
                indicator += '<span class="price-dot"></span>';
            }
        }
        
        indicator += '</div>';
        return indicator;
    }
    
    function generateAccommodationIndicator(value) {
        const maxValue = 5;
        let indicator = '<div class="accommodation-indicator">';
        
        for (let i = 0; i < maxValue; i++) {
            if (i < value) {
                indicator += '<i class="fas fa-bed active"></i>';
            } else {
                indicator += '<i class="far fa-bed"></i>';
            }
        }
        
        indicator += '</div>';
        return indicator;
    }
}

// Venue event planning tool
function initVenuePlanner() {
    const venueItems = document.querySelectorAll('.venue-item');
    
    venueItems.forEach(venue => {
        // Get venue name
        const venueName = venue.querySelector('h3').textContent;
        
        // Create venue planner tools section
        const plannerTools = document.createElement('div');
        plannerTools.className = 'venue-planner-tools hidden';
        plannerTools.innerHTML = `
            <h4>Plan Your Event at ${venueName}</h4>
            <div class="planner-tabs">
                <button class="tab-btn active" data-tab="checklist">Venue Checklist</button>
                <button class="tab-btn" data-tab="floorplan">Floor Plan</button>
                <button class="tab-btn" data-tab="timeline">Day Timeline</button>
            </div>
            <div class="tab-content">
                <div class="tab-pane active" id="checklist">
                    <div class="venue-checklist">
                        <div class="checklist-item">
                            <input type="checkbox" id="check-1-${venueName.replace(/\s+/g, '-').toLowerCase()}">
                            <label for="check-1-${venueName.replace(/\s+/g, '-').toLowerCase()}">Contact venue for availability</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check-2-${venueName.replace(/\s+/g, '-').toLowerCase()}">
                            <label for="check-2-${venueName.replace(/\s+/g, '-').toLowerCase()}">Schedule site visit</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check-3-${venueName.replace(/\s+/g, '-').toLowerCase()}">
                            <label for="check-3-${venueName.replace(/\s+/g, '-').toLowerCase()}">Review contract details</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check-4-${venueName.replace(/\s+/g, '-').toLowerCase()}">
                            <label for="check-4-${venueName.replace(/\s+/g, '-').toLowerCase()}">Confirm catering options</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check-5-${venueName.replace(/\s+/g, '-').toLowerCase()}">
                            <label for="check-5-${venueName.replace(/\s+/g, '-').toLowerCase()}">Review accommodation options</label>
                        </div>
                        <div class="checklist-item">
                            <input type="checkbox" id="check-6-${venueName.replace(/\s+/g, '-').toLowerCase()}">
                            <label for="check-6-${venueName.replace(/\s+/g, '-').toLowerCase()}">Check vendor requirements</label>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="floorplan">
                    <div class="floor-plan-tool">
                        <div class="floor-plan-canvas">
                            <div class="floor-plan-area">
                                <div class="floor-plan-element" data-type="table-round" draggable="true">
                                    <i class="fas fa-circle"></i>
                                    <span>Round Table</span>
                                </div>
                                <div class="floor-plan-element" data-type="table-rect" draggable="true">
                                    <i class="fas fa-square"></i>
                                    <span>Rectangle Table</span>
                                </div>
                                <div class="floor-plan-element" data-type="stage" draggable="true">
                                    <i class="fas fa-tv"></i>
                                    <span>Stage</span>
                                </div>
                                <div class="floor-plan-element" data-type="dance-floor" draggable="true">
                                    <i class="fas fa-music"></i>
                                    <span>Dance Floor</span>
                                </div>
                            </div>
                        </div>
                        <div class="floor-plan-info">
                            <p>Drag and drop items to create your floor plan. This is a simplified tool for visualization purposes.</p>
                            <button class="btn btn-secondary btn-sm floor-plan-reset">Reset Plan</button>
                            <button class="btn btn-primary btn-sm floor-plan-save">Save Plan</button>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="timeline">
                    <div class="day-timeline">
                        <div class="timeline-slot">
                            <span class="time">10:00 AM</span>
                            <input type="text" placeholder="Add timeline event...">
                        </div>
                        <div class="timeline-slot">
                            <span class="time">12:00 PM</span>
                            <input type="text" placeholder="Add timeline event...">
                        </div>
                        <div class="timeline-slot">
                            <span class="time">2:00 PM</span>
                            <input type="text" placeholder="Add timeline event...">
                        </div>
                        <div class="timeline-slot">
                            <span class="time">4:00 PM</span>
                            <input type="text" placeholder="Add timeline event...">
                        </div>
                        <div class="timeline-slot">
                            <span class="time">6:00 PM</span>
                            <input type="text" placeholder="Add timeline event...">
                        </div>
                        <div class="timeline-slot">
                            <span class="time">8:00 PM</span>
                            <input type="text" placeholder="Add timeline event...">
                        </div>
                        <div class="timeline-slot">
                            <span class="time">10:00 PM</span>
                            <input type="text" placeholder="Add timeline event...">
                        </div>
                        <button class="btn btn-primary btn-sm timeline-save">Save Timeline</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add planner tools to venue
        venue.querySelector('.venue-info').appendChild(plannerTools);
        
        // Add toggle button to venue actions
        const venueActions = venue.querySelector('.venue-actions');
        if (venueActions) {
            const plannerButton = document.createElement('button');
            plannerButton.className = 'btn btn-secondary btn-planning-tools';
            plannerButton.innerHTML = '<i class="fas fa-tasks"></i> Planning Tools';
            venueActions.appendChild(plannerButton);
            
            // Toggle planning tools on button click
            plannerButton.addEventListener('click', () => {
                plannerTools.classList.toggle('hidden');
                plannerButton.classList.toggle('active');
                
                // Scroll to planning tools if showing
                if (!plannerTools.classList.contains('hidden')) {
                    plannerTools.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
        
        // Tab switching functionality
        const tabButtons = plannerTools.querySelectorAll('.tab-btn');
        const tabPanes = plannerTools.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                plannerTools.querySelector(`#${tabId}`).classList.add('active');
            });
        });
        
        // Floor plan drag and drop functionality
        const floorPlanCanvas = plannerTools.querySelector('.floor-plan-area');
        const floorPlanElements = plannerTools.querySelectorAll('.floor-plan-element');
        const resetButton = plannerTools.querySelector('.floor-plan-reset');
        
        floorPlanElements.forEach(element => {
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element.getAttribute('data-type'));
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
        
        floorPlanCanvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        floorPlanCanvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const elementType = e.dataTransfer.getData('text/plain');
            
            // Create new element
            const newElement = document.createElement('div');
            newElement.className = 'dropped-element';
            newElement.setAttribute('data-type', elementType);
            
            // Set element icon based on type
            let icon;
            switch (elementType) {
                case 'table-round':
                    icon = '<i class="fas fa-circle"></i>';
                    break;
                case 'table-rect':
                    icon = '<i class="fas fa-square"></i>';
                    break;
                case 'stage':
                    icon = '<i class="fas fa-tv"></i>';
                    break;
                case 'dance-floor':
                    icon = '<i class="fas fa-music"></i>';
                    break;
                default:
                    icon = '<i class="fas fa-question"></i>';
            }
            
            newElement.innerHTML = icon;
            
            // Position element at drop point
            const rect = floorPlanCanvas.getBoundingClientRect();
            newElement.style.left = `${e.clientX - rect.left - 20}px`;
            newElement.style.top = `${e.clientY - rect.top - 20}px`;
            
            // Make element draggable within canvas
            newElement.addEventListener('mousedown', dragElement);
            
            // Add delete on double click
            newElement.addEventListener('dblclick', function() {
                this.remove();
            });
            
            floorPlanCanvas.appendChild(newElement);
        });
        
        // Drag functionality for placed elements
        function dragElement(e) {
            e.preventDefault();
            
            const element = e.target;
            const canvas = floorPlanCanvas;
            const rect = canvas.getBoundingClientRect();
            
            let startX = e.clientX - element.offsetLeft;
            let startY = e.clientY - element.offsetTop;
            
            function moveElement(e) {
                e.preventDefault();
                
                let newLeft = e.clientX - startX;
                let newTop = e.clientY - startY;
                
                // Constrain to canvas bounds
                newLeft = Math.max(0, Math.min(newLeft, canvas.clientWidth - element.clientWidth));
                newTop = Math.max(0, Math.min(newTop, canvas.clientHeight - element.clientHeight));
                
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            }
            
            function stopMoving() {
                document.removeEventListener('mousemove', moveElement);
                document.removeEventListener('mouseup', stopMoving);
            }
            
            document.addEventListener('mousemove', moveElement);
            document.addEventListener('mouseup', stopMoving);
        }
        
        // Reset floor plan
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                const placedElements = floorPlanCanvas.querySelectorAll('.dropped-element');
                placedElements.forEach(element => element.remove());
            });
        }
        
        // Save functionality for timeline
        const timelineSaveButton = plannerTools.querySelector('.timeline-save');
        if (timelineSaveButton) {
            timelineSaveButton.addEventListener('click', () => {
                // In a real implementation, this would save the timeline to a backend
                // For now, just show a success message
                alert('Timeline saved successfully!');
            });
        }
        
        // Save functionality for floor plan
        const floorPlanSaveButton = plannerTools.querySelector('.floor-plan-save');
        if (floorPlanSaveButton) {
            floorPlanSaveButton.addEventListener('click', () => {
                // In a real implementation, this would save the floor plan to a backend
                // For now, just show a success message
                alert('Floor plan saved successfully!');
            });
        }
    });
}

// Smooth scrolling for anchor links
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