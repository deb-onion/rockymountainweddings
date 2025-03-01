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
        // Ensure Google Maps API is completely loaded before accessing MapTypeId
        let mapTypeId = 'roadmap'; // Default fallback
        if (google.maps && google.maps.MapTypeId) {
            // Check if TERRAIN is available
            mapTypeId = google.maps.MapTypeId.TERRAIN || google.maps.MapTypeId.ROADMAP;
        }

        const mapOptions = {
            center: { lat: 51.1645, lng: -115.5708 }, // Banff area
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
                featured: true, // Featured venue,
                placeId: 'ChIJW6XUmrEYcFMRaEOtOYjqH3g', // From the Google Maps link
                address: '900A Harvie Heights Rd, Bighorn No. 8, AB T1W 2W2, Canada'
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
                features: ['Historic Castle', 'Mountain Views', 'Luxury Accommodations', 'Multiple Ceremony Sites'],
                placeId: 'ChIJn8hUfMIQcFMRf95C1DrfPiI', // From the Google Maps link
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
                placeId: 'ChIJbfpqSksVcFMRBOUNLXJ-0Xo', // From the Google Maps link
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
                placeId: 'ChIJO_yxGUMVcFMR3IbpFZPcLII', // From the Google Maps link
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
                placeId: 'ChIJM8_Ru_IVcFMRFsNu0E_ZxO0', // From the Google Maps link
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
                placeId: 'ChIJBQX2tUIVcFMRH9sxg9m5_2g', // From the Google Maps link
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
                featured: true, // Featured venue,
                placeId: 'ChIJs2Jfy-EbcFMRiB7lSe8UeVY', // From the Google Maps link
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
                placeId: 'ChIJbT1EzP4bcFMRNNbzC6_wMxA', // From the Google Maps link
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
                placeId: 'ChIJs37VYz0ccFMRf_X0FnYlXac', // From the Google Maps link
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
                placeId: 'ChIJtb0FwvEbcFMRYHOI7A9aNKo', // From the Google Maps link
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
                placeId: 'ChIJAQybYwsccFMRPw-B4NRzvFs', // From the Google Maps link
                address: '709 Benchlands Trail, Canmore, AB T1W 3G9, Canada'
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
                features: ['Golf Simulator', 'Casual Setting', 'Unique Experience', 'Entertainment Options'],
                placeId: 'ChIJy8D3-uQbcFMRkpHGEgUV9FY', // From the Google Maps link
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
                featured: true, // Featured venue,
                placeId: 'ChIJcz_cTlQtcVMR_yC4zJNM_xc', // From the Google Maps link
                address: '111 Lake Louise Dr, Lake Louise, AB T0L 1E0, Canada'
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
                featured: true, // Featured venue,
                placeId: 'ChIJSzU4uuiDcVMRb8JlhC_mD2A', // From the Google Maps link
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
                placeId: 'ChIJUb96hNiFcVMRe_8-uZj9HuQ', // From the Google Maps link
                address: '1740 Seward Frontage Rd, Golden, BC V0A 1H0, Canada'
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
                features: ['Secluded Location', 'Emerald Waters', 'Intimate Setting', 'Mountain Backdrop'],
                placeId: 'ChIJexU-W6pkcVMRHQs6PaTI17k', // From the Google Maps link
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
                featured: true, // Featured venue,
                placeId: 'ChIJ7ZWCwJtRdFMRJvS7Vt7W_vA', // From the Google Maps link
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
                placeId: 'ChIJyxxJZcwtc1MROk-0fdW7mI0', // From the Google Maps link
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
                placeId: 'ChIJZftOi0EtcVMRk3p9D9URcAw', // From the Google Maps link
                address: '101 Ranchehouse Rd, Cochrane, AB T4C 2K8, Canada'
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

// Enhanced 360° virtual tours with dual-view system
async function initVirtualTours() {
    try {
        // Dynamically load required libraries
        const mapsLib = await google.maps.importLibrary("maps");
        const streetViewLib = await google.maps.importLibrary("streetView");
        const markerLib = await google.maps.importLibrary("marker");
        const placesLib = await google.maps.importLibrary("places");
        
        // Store the necessary objects from the libraries
        const Map = mapsLib.Map;
        const LatLng = mapsLib.LatLng;
        const StreetViewService = streetViewLib.StreetViewService;
        const StreetViewPanorama = streetViewLib.StreetViewPanorama;
        const AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
        const PlacesService = placesLib.PlacesService;
    
        console.log("Google Maps libraries loaded successfully");
        
        const tourModal = document.getElementById('tourModal');
        if (!tourModal) return;
        
        const tourButtons = document.querySelectorAll('.view-360');
        const closeButton = tourModal.querySelector('.close-modal');
        const tourContainer = document.getElementById('tourContainer');
        
        // Get venueMarkers from global scope or define a local array if not available
        let venueMarkersData = [];
        
        // Check if venueMarkers is defined in outer scope - access it correctly from the global scope
        if (typeof window.venueMarkers !== 'undefined') {
            venueMarkersData = window.venueMarkers;
        } else if (typeof venueMarkers !== 'undefined') {
            venueMarkersData = venueMarkers;
        } else {
            // Backup for when venueMarkers is not defined in this scope
            // This could happen due to scoping issues with the map function
            // Locate venues data from a data attribute or another source
            try {
                const venuesDataElement = document.getElementById('venues-data');
                if (venuesDataElement && venuesDataElement.dataset.venues) {
                    venueMarkersData = JSON.parse(venuesDataElement.dataset.venues);
                }
            } catch (error) {
                console.error("Error loading venue data:", error);
            }
            
            // If still no data, use the hardcoded venue data
            if (venueMarkersData.length === 0) {
                console.warn("Venue markers not available, using hardcoded data");
                // Use hardcoded venue data from this file
                venueMarkersData = [
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
                        placeId: 'ChIJW6XUmrEYcFMRaEOtOYjqH3g',
                        address: '900A Harvie Heights Rd, Bighorn No. 8, AB T1W 2W2, Canada'
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
                        features: ['Historic Castle', 'Mountain Views', 'Luxury Accommodations', 'Multiple Ceremony Sites'],
                        placeId: 'ChIJn8hUfMIQcFMRf95C1DrfPiI',
                        address: '405 Spray Ave, Banff, AB T1L 1J4, Canada'
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
                        placeId: 'ChIJM8_Ru_IVcFMRFsNu0E_ZxO0',
                        address: 'Improvement District No. 9, AB T0L 1E0, Canada'
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
                        placeId: 'ChIJbfpqSksVcFMRBOUNLXJ-0Xo',
                        address: '100 Mountain Ave, Banff, AB T1L 1J3, Canada'
                    },
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
                        placeId: 'ChIJcz_cTlQtcVMR_yC4zJNM_xc',
                        address: '111 Lake Louise Dr, Lake Louise, AB T0L 1E0, Canada'
                    },
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
                        placeId: 'ChIJSzU4uuiDcVMRb8JlhC_mD2A',
                        address: '1500 Kicking Horse Trail, Golden, BC V0A 1H0, Canada'
                    },
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
                        placeId: 'ChIJ7ZWCwJtRdFMRJvS7Vt7W_vA',
                        address: 'Km North On, Pyramid Lake Rd #6, Jasper, AB T0E 0A8, Canada'
                    },
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
                        placeId: 'ChIJZftOi0EtcVMRk3p9D9URcAw',
                        address: '101 Ranchehouse Rd, Cochrane, AB T4C 2K8, Canada'
                    }
                ];
            }
        }
        
        // Make venueMarkersData available globally in case it's needed by other functions
        window.venueData = venueMarkersData;

        // Function to open virtual tour
        function openVirtualTour(venueId) {
            // Show loading indicator
            tourContainer.innerHTML = '<div class="tour-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading virtual tour...</p></div>';
            
            // Show modal
            tourModal.classList.add('active');
            setTimeout(() => {
                tourModal.querySelector('.modal-content').classList.add('modal-animate');
            }, 100);
            document.body.style.overflow = 'hidden';
            
            console.log(`Opening virtual tour for venue ID: ${venueId}`);
            
            // Find the venue data from our venues array
            const venueData = venueMarkersData.find(venue => venue.id === venueId);
            
            if (!venueData) {
                console.error(`Could not find venue data for ID: ${venueId}`);
                showErrorMessage("Could not find venue information.");
                return;
            }
            
            const venueName = venueData.name;
            const venueAddress = venueData.address;
            const venuePlaceId = venueData.placeId;
                
            console.log(`Venue Name: ${venueName}, Address: ${venueAddress}, Place ID: ${venuePlaceId}`);
            
            // Update modal title
            tourModal.querySelector('h2').textContent = `${venueName} Virtual Tour`;
            
            // Create tour tabs container
            createTourTabs(venueId, venueName);
            
            // Default to showing Street View first
            showStreetView(venueId, venueName, venueAddress, venuePlaceId);
        }
        
        // Create tour tabs for switching between views
        function createTourTabs(venueId, venueName) {
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
                        
                        // Find venue data again to get place ID
                        const venueData = venueMarkersData.find(venue => venue.id === venueId);
                        if (!venueData) return;
                        
                        if (view === 'exterior') {
                            showStreetView(venueId, venueData.name, venueData.address, venueData.placeId);
                        } else {
                            showInteriorView(venueId, venueData.name, venueData.placeId);
                        }
                    });
                });
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
                const fallbackCoordinates = getVenueFallbackCoordinates(venueId);
                if (fallbackCoordinates) {
                    console.log(`Using fallback coordinates for ${venueName}`, fallbackCoordinates);
                    checkStreetViewAndInitialize({
                        geometry: {
                            location: new LatLng(fallbackCoordinates.lat, fallbackCoordinates.lng)
                        },
                        name: venueName,
                        formatted_address: venueAddress || "Rocky Mountains, Canada"
                    });
                } else {
                    // Last resort: try to find venue location using Places API
                    findVenueLocation(venueName, venueAddress);
                }
            }
        }
        
        // Get place details using place ID and initialize Street View
        function getPlaceDetailsAndInitializeStreetView(placeId, venueName) {
            const placesService = new PlacesService(document.createElement('div'));
            
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
                    const venueData = venueMarkersData.find(venue => venue.name === venueName);
                    if (venueData && venueData.coordinates) {
                        checkStreetViewAndInitialize({
                            geometry: {
                                location: new LatLng(venueData.coordinates.lat, venueData.coordinates.lng)
                            },
                            name: venueName,
                            formatted_address: venueData.address || "Rocky Mountains, Canada"
                        });
                    } else {
                        showErrorMessage(`We couldn't find ${venueName}'s location. Please try viewing our interactive map for more information.`);
                    }
                }
            });
        }
        
        // Show interior virtual tour
        async function showInteriorView(venueId, venueName, placeId) {
            // Show loading indicator
            tourContainer.innerHTML = '<div class="tour-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading interior tour...</p></div>';
            
            console.log(`Showing interior view for venue: ${venueName}, Place ID: ${placeId}`);
            
            try {
                if (placeId) {
                    // Get place details including photos
                    const placeDetails = await getPlaceDetails(placeId);
                    
                    // Check if there's interior Street View data
                    const hasInteriorView = await checkForInteriorStreetView(placeDetails);
                    
                    if (hasInteriorView) {
                        // Use Street View for interiors if available
                        initInteriorStreetView(placeDetails);
                    } else if (placeDetails.photos && placeDetails.photos.length > 0) {
                        // Fall back to place photos if no interior Street View
                        showPlacePhotoGallery(placeDetails);
                    } else {
                        showInteriorUnavailableMessage(venueName);
                    }
                } else {
                    showInteriorUnavailableMessage(venueName);
                }
            } catch (error) {
                console.error(`Error loading interior view for ${venueName}:`, error);
                showInteriorUnavailableMessage(venueName);
            }
        }
        
        // Get place details including photos
        async function getPlaceDetails(placeId) {
            try {
                const placesService = new PlacesService(document.createElement('div'));
                
                return new Promise((resolve, reject) => {
                    placesService.getDetails({
                        placeId: placeId,
                        fields: [
                            'name', 
                            'photos', 
                            'geometry', 
                            'formatted_address',
                            'url'
                        ]
                    }, (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                            console.log('Retrieved place details:', place);
                            resolve(place);
                        } else {
                            console.error(`Error getting place details: ${status}`);
                            reject(new Error(`Error getting place details: ${status}`));
                        }
                    });
                });
            } catch (error) {
                console.error("Error getting place details:", error);
                throw error;
            }
        }
        
        // Check if interior Street View is available
        async function checkForInteriorStreetView(placeDetails) {
            try {
                const streetViewService = new StreetViewService();
                
                return new Promise((resolve) => {
                    // First check if we have a valid location to use
                    if (!placeDetails || !placeDetails.geometry || !placeDetails.geometry.location) {
                        console.error("Invalid place details for Street View check");
                        resolve(false);
                        return;
                    }
                    
                    // Now check exterior panoramas
                    streetViewService.getPanorama({
                        location: placeDetails.geometry.location,
                        radius: 50,
                        source: google.maps.StreetViewSource.OUTDOOR // Start with outdoor
                    }, (outdoorData, outdoorStatus) => {
                        // Verify the StreetViewStatus enum is available
                        const okStatus = google.maps.StreetViewStatus ? 
                            google.maps.StreetViewStatus.OK : 'OK';
                        
                        // Now check for indoor panoramas
                        streetViewService.getPanorama({
                            location: placeDetails.geometry.location,
                            radius: 50,
                            source: google.maps.StreetViewSource.DEFAULT // This includes indoor panoramas
                        }, (defaultData, defaultStatus) => {
                            // If there are more panoramas in DEFAULT than in OUTDOOR,
                            // it likely means there are indoor panoramas
                            const hasInterior = 
                                defaultStatus === okStatus && 
                                (outdoorStatus !== okStatus || 
                                (defaultData && outdoorData && 
                                defaultData.links && outdoorData.links &&
                                defaultData.links.length > outdoorData.links.length));
                            
                            resolve(hasInterior);
                        });
                    });
                });
            } catch (error) {
                console.error("Error checking for interior Street View:", error);
                return false;
            }
        }
        
        // Initialize Street View for interiors
        async function initInteriorStreetView(placeDetails) {
            try {
                // Safety check for required objects
                if (!placeDetails || !placeDetails.geometry || !placeDetails.geometry.location) {
                    console.error("Invalid place details for interior Street View");
                    showInteriorUnavailableMessage(placeDetails?.name || "this venue");
                    return;
                }
                
                // Safety check for StreetViewPanorama constructor
                if (typeof StreetViewPanorama !== 'function') {
                    console.error("StreetViewPanorama is not available");
                    showInteriorUnavailableMessage(placeDetails.name);
                    return;
                }
                
                const panorama = new StreetViewPanorama(
                    tourContainer,
                    {
                        position: placeDetails.geometry.location,
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
                        motionTracking: false,
                        visible: true
                    }
                );
                
                // Try to find the first indoor panorama
                findFirstInteriorPanorama(panorama, placeDetails.geometry.location);
                
                // Add info panel with proper attribution
                addInfoPanel(placeDetails.name, 'interior', 'Google Street View interior tour. ' +
                    'Navigate through the venue with the arrow links.');
                
            } catch (error) {
                console.error("Error initializing interior Street View:", error);
                showInteriorUnavailableMessage(placeDetails?.name || "this venue");
            }
        }
        
        // Find the first interior panorama from the given location
        async function findFirstInteriorPanorama(panorama, location) {
            try {
                // Safety check
                if (!panorama || !location || !StreetViewService) {
                    console.error("Missing required parameters for finding interior panorama");
                    return;
                }
                
                const streetViewService = new StreetViewService();
                
                streetViewService.getPanorama({
                    location: location,
                    radius: 50,
                    source: google.maps.StreetViewSource.DEFAULT // This includes indoor panoramas
                }, (data, status) => {
                    // Verify status enum is available
                    const okStatus = google.maps.StreetViewStatus ? 
                        google.maps.StreetViewStatus.OK : 'OK';
                        
                    if (status === okStatus && data && data.links && data.links.length > 0) {
                        // Find links that are likely indoor (usually have different pano IDs pattern)
                        const indoorLinks = data.links.filter(link => {
                            // Indoor panoramas often have specific pattern or different road names
                            // This is a heuristic and may need adjustment
                            return link.description &&
                                  (link.description.includes('Indoor') || 
                                  link.description.includes('inside') || 
                                  link.description.includes('Interior') ||
                                  !link.description.includes('Street'));
                        });
                        
                        if (indoorLinks.length > 0) {
                            // Navigate to the first indoor panorama
                            panorama.setPano(indoorLinks[0].pano);
                        }
                    }
                });
            } catch (error) {
                console.error("Error finding interior panorama:", error);
            }
        }
        
        // Show a gallery of place photos when interior Street View isn't available
        function showPlacePhotoGallery(placeDetails) {
            if (!placeDetails.photos || placeDetails.photos.length === 0) {
                showInteriorUnavailableMessage(placeDetails.name);
                return;
            }
            
            console.log(`Showing photo gallery for ${placeDetails.name} with ${placeDetails.photos.length} photos`);
            
            // Create gallery container
            const galleryHtml = `
                <div class="interior-gallery">
                    <div class="gallery-main">
                        <img src="${placeDetails.photos[0].getUrl({maxWidth: 1200, maxHeight: 800})}" 
                             alt="${placeDetails.name} interior">
                    </div>
                    <div class="gallery-thumbs">
                        ${placeDetails.photos.slice(0, 8).map((photo, index) => 
                            `<img src="${photo.getUrl({maxWidth: 100, maxHeight: 100})}" 
                                  alt="Interior view ${index + 1}" 
                                  data-index="${index}"
                                  class="${index === 0 ? 'active' : ''}">`
                        ).join('')}
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
            
            // Add info panel with proper attribution
            addInfoPanel(placeDetails.name, 'interior', 'Interior photos from Google Maps.');
        }
        
        // Show message when interior view is unavailable
        function showInteriorUnavailableMessage(venueName) {
            tourContainer.innerHTML = `
                <div class="tour-error">
                    <p>Interior tour for ${venueName} is not currently available in Google Maps.</p>
                    <p>We're working with the venue to add interior imagery soon.</p>
                    <button class="btn btn-primary switch-to-exterior">View Surroundings Instead</button>
                </div>
            `;
            
            // Add event listener to switch back to exterior view
            document.querySelector('.switch-to-exterior').addEventListener('click', () => {
                // Switch to exterior tab
                const exteriorTab = tourModal.querySelector('.tab-btn[data-view="exterior"]');
                exteriorTab.click();
            });
        }
        
        // Function to get interior panorama data (now used as a fallback only)
        function getVenueInteriorPanorama(venueId) {
            // Fallback panoramas can still be useful for venues that don't have Google interior imagery
            // This could be completely removed if not needed, but keeping for historical purposes
            const interiorPanoramas = {};
            
            return interiorPanoramas[venueId] || null;
        }
        
        // Function to get venue address
        function getVenueAddress(venueId) {
            // Fallback addresses for venues
            const venueAddresses = {
                'banff-springs': '405 Spray Ave, Banff, AB T1L 1J4, Canada',
                'chateau-louise': '111 Lake Louise Drive, Lake Louise, AB T0L 1E0, Canada',
                'the-gem': '900A Harvie Heights Rd, Bighorn No. 8, AB T1W 2W2, Canada',
                'sky-bistro': '100 Mountain Ave, Banff, AB T1L 1B2, Canada'
                // Add other venues as needed
            };
            
            return venueAddresses[venueId] || '';
        }
        
        // Function to get fallback coordinates for venues
        function getVenueFallbackCoordinates(venueId) {
            // Find the venue in our venue markers
            const venue = venueMarkersData.find(v => v.id === venueId);
            if (venue && venue.coordinates) {
                return venue.coordinates;
            }
            
            // If not found, use hardcoded fallbacks
            const fallbackCoords = {
                'banff-springs': { lat: 51.1644, lng: -115.5619 },
                'silvertip': { lat: 51.0777, lng: -115.3359 },
                'chateau-louise': { lat: 51.4163, lng: -116.2162 },
                'the-gem': { lat: 51.1720, lng: -115.5940 },
                'sky-bistro': { lat: 51.1644, lng: -115.5574 },
                'mt-norquay': { lat: 51.1985, lng: -115.5944 },
                'kicking-horse': { lat: 51.2980, lng: -117.0475 },
                'emerald-lake': { lat: 51.4429, lng: -116.5285 },
                'pyramid-lake': { lat: 52.9310, lng: -118.0945 },
                'mainspace-solara': { lat: 51.0899, lng: -115.3487 },
                'stewart-creek': { lat: 51.0574, lng: -115.3696 },
                'malcolm-hotel': { lat: 51.0875, lng: -115.3480 },
                'cochrane-ranchehouse': { lat: 51.1945, lng: -114.4669 }
            };
            
            return fallbackCoords[venueId] || null;
        }
        
        // Function to find venue location using Places API
        async function findVenueLocation(venueName, venueAddress) {
            console.log(`Searching for venue location: ${venueName}, ${venueAddress}`);
            
            try {
                // Load Places library
                const placesLib = await google.maps.importLibrary("places");
                const PlacesService = placesLib.PlacesService;
                
                // Create a PlacesService object
                const placesService = new PlacesService(document.createElement('div'));
                
                // Search for the venue by name and address
                placesService.findPlaceFromQuery({
                    query: `${venueName} ${venueAddress}`,
                    fields: ['name', 'geometry', 'formatted_address', 'place_id']
                }, (results, status) => {
                    console.log(`Places API response for ${venueName}:`, status, results);
                    
                    if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                        // Successfully found the venue
                        const place = results[0];
                        checkStreetViewAndInitialize(place);
                    } else {
                        // Try geocoding the address as fallback
                        console.log(`Places search failed for ${venueName}, trying geocoding...`);
                        geocodeAddress(venueAddress, venueName);
                    }
                });
            } catch (error) {
                console.error("Error in Places API call:", error);
                showErrorMessage("There was an error finding the venue location. Please try again later.");
            }
        }
        
        // Geocode address as fallback
        async function geocodeAddress(address, venueName) {
            console.log(`Geocoding address: ${address}`);
            
            try {
                // Load Geocoding library
                const geocodingLib = await google.maps.importLibrary("geocoding");
                const Geocoder = geocodingLib.Geocoder;
                
                const geocoder = new Geocoder();
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
                        showErrorMessage(`We couldn't find this venue's location. Please try viewing our interactive map for more information.`);
                    }
                });
            } catch (error) {
                console.error("Error in Geocoding API call:", error);
                showErrorMessage("There was an error finding the venue location. Please try again later.");
            }
        }
        
        // Check if Street View is available and initialize
        function checkStreetViewAndInitialize(place) {
            if (!place || !place.geometry || !place.geometry.location) {
                showErrorMessage("Could not find venue location data.");
                return;
            }
            
            console.log(`Checking Street View for ${place.name || 'venue'}`);
            
            try {
                // Safety check for required constructor
                if (typeof StreetViewService !== 'function') {
                    console.error("StreetViewService is not available");
                    initSimplifiedMapView(place);
                    return;
                }
                
                const streetViewService = new StreetViewService();
                const location = place.geometry.location;
                
                streetViewService.getPanorama({
                    location: location,
                    radius: 100,
                    source: google.maps.StreetViewSource.OUTDOOR
                }, (data, status) => {
                    // Verify status enum is available
                    const okStatus = google.maps.StreetViewStatus ? 
                        google.maps.StreetViewStatus.OK : 'OK';
                    
                    if (status === okStatus && data) {
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
                // Safety check for required constructor
                if (typeof StreetViewPanorama !== 'function') {
                    console.error("StreetViewPanorama is not available");
                    initSimplifiedMapView(place);
                    return;
                }
                
                // Clear previous content
                tourContainer.innerHTML = '';
                
                const panorama = new StreetViewPanorama(
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
        async function initSimplifiedMapView(place) {
            try {
                // Safety check
                if (!place || !place.geometry || !place.geometry.location) {
                    showErrorMessage("Could not find venue location data.");
                    return;
                }
                
                // Clear previous content
                tourContainer.innerHTML = '';
                
                if (typeof Map !== 'function') {
                    // If Map constructor is not available
                    showErrorMessage("Map view is not available. Please try again later.");
                    return;
                }
                
                const map = new Map(
                    tourContainer,
                    {
                        center: place.geometry.location,
                        zoom: 17,
                        mapTypeId: google.maps.MapTypeId ? 
                            (google.maps.MapTypeId.SATELLITE || 'satellite') : 'satellite',
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: true,
                        zoomControl: true
                    }
                );
                
                // Add a marker at the venue location if marker library is available
                if (typeof AdvancedMarkerElement === 'function') {
                    const marker = new AdvancedMarkerElement({
                        map: map,
                        position: place.geometry.location,
                        title: place.name
                    });
                } else if (typeof google.maps.Marker === 'function') {
                    // Fallback to regular marker
                    new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                        title: place.name
                    });
                }
                
                // Add info panel with proper attribution
                addInfoPanel(place.name, 'map', 'Satellite map view. Street View is not available for this location.');
                
                console.log("Simplified map view initialized");
            } catch (error) {
                console.error("Error initializing simplified map view:", error);
                showErrorMessage("Could not load map view. Please try again later.");
            }
        }
        
        // Create Pannellum viewer for custom interior panoramas
        function createPannellumViewer(config) {
            try {
                console.log("Initializing Pannellum viewer with:", config);
                
                // Initialize Pannellum viewer
                window.pannellum.viewer('tourContainer', {
                    type: 'equirectangular',
                    panorama: config.panorama,
                    autoLoad: true,
                    autoRotate: -2,
                    hotSpots: config.hotSpots || [],
                    hotSpotDebug: false,
                    preview: 'assets/images/venues-details/panorama-loading.jpg',
                    yaw: config.pov ? config.pov.heading : 0,
                    pitch: config.pov ? config.pov.pitch : 0,
                    title: config.title || '',
                    author: 'Rocky Mountain Weddings',
                    sceneFadeDuration: 1000
                });
                
                // Add tour info panel
                addInfoPanel(config.title, 'interior', config.description);
            } catch (error) {
                console.error("Error initializing Pannellum viewer:", error);
                showErrorMessage("There was an error loading the interior panorama. Please try again later.");
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
        }
        
        // Show error message
        function showErrorMessage(message) {
            console.log(`Showing error message: ${message}`);
            
            tourContainer.innerHTML = `
                <div class="tour-error">
                    <p>${message}</p>
                    <button class="btn btn-primary" id="viewOnMap">View on Google Maps</button>
                </div>
            `;
            
            // Add button to view on Google Maps
            document.getElementById('viewOnMap').addEventListener('click', () => {
                const venueName = tourModal.querySelector('h2').textContent.replace(' Virtual Tour', '');
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName)}`, '_blank');
            });
        }
        
        // Set up event listeners for all tour buttons
        tourButtons.forEach(button => {
            button.addEventListener('click', function() {
                const venueId = this.dataset.venue || this.getAttribute('data-venue');
                if (venueId) {
                    openVirtualTour(venueId);
                } else {
                    console.error('No venue ID specified for tour button');
                    showErrorMessage('Could not determine which venue to show.');
                }
            });
        });
        
        // Set up close button functionality
        if (closeButton) {
            closeButton.addEventListener('click', closeTourModal);
        }
        
        // Close tour modal when clicking outside of it or with ESC key
        tourModal.addEventListener('click', function(e) {
            // Only close if clicking directly on the background modal element
            if (e.target === tourModal) {
                closeTourModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && tourModal.classList.contains('active')) {
                closeTourModal();
            }
        });
    } catch (error) {
        console.error("Error initializing virtual tours:", error);
        // Handle the error gracefully
        const tourModal = document.getElementById('tourModal');
        if (tourModal) {
            const tourButtons = document.querySelectorAll('.view-360');
            
            // Update tour buttons to show error on click
            tourButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    alert("Sorry, the virtual tour feature is temporarily unavailable. Please try again later.");
                });
            });
        }
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

        function closeTourModal() {
            // Animate modal out
            const modalContent = tourModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.remove('modal-animate');
            }
            
            // Hide modal after animation completes
            setTimeout(() => {
                tourModal.classList.remove('active');
                document.body.style.overflow = '';
                tourContainer.innerHTML = '';
                
                // Remove tabs if they exist
                const tabsContainer = tourModal.querySelector('.tour-tabs');
                if (tabsContainer) {
                    tabsContainer.remove();
                }
                
                // Reset title
                const modalTitle = tourModal.querySelector('h2');
                if (modalTitle) {
                    modalTitle.textContent = 'Virtual Tour';
                }
            }, 300);
        }
        
        // Show error message in the tour container
        function showErrorMessage(message) {
            if (!tourContainer) return;
            
            tourContainer.innerHTML = `
                <div class="tour-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                    <button class="retry-btn">Try Again Later</button>
                </div>
            `;
            
            // Add event listener to retry button
            const retryBtn = tourContainer.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', closeTourModal);
            }
        }