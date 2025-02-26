document.addEventListener('DOMContentLoaded', () => {
    initInteractiveMap();
    initVenueGalleries();
    initVenueModal();
    initVirtualTours();
    initRegionFilters();
    initVenueComparison();
    initSmoothScrolling();
});

// Mapbox interactive map
function initInteractiveMap() {
    const mapContainer = document.getElementById('venuesMap');
    if (!mapContainer) return;

    // Initialize the map
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3ltb3VudGFpbndlZGRpbmdzIiwiYSI6ImNsbjV2Z2FudjBhMXIycW1ydzZ3cW5meWIifQ.vPZJ0o9Q0ulU6x-aLZVSKQ';
    
    const map = new mapboxgl.Map({
        container: 'venuesMap',
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-116.4817, 51.1784], // Centered on the Canadian Rockies
        zoom: 9,
        scrollZoom: true
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add venue markers when map loads
    map.on('load', () => {
        // Add custom marker data
        const venueMarkers = [
            {
                id: 'banff-springs',
                name: 'Fairmont Banff Springs',
                location: 'Banff, Alberta',
                description: 'Known as Canada\'s "Castle in the Rockies," this historic hotel offers luxurious wedding venues with stunning mountain views.',
                coordinates: [-115.5708, 51.1645],
                image: 'assets/images/venues/banff-springs-main.jpg',
                region: 'banff',
                url: '#banff-venues'
            },
            {
                id: 'tunnel-mountain',
                name: 'Tunnel Mountain Reservoir',
                location: 'Banff, Alberta',
                description: 'An outdoor ceremony location with breathtaking panoramic views of the surrounding mountains and Banff townsite.',
                coordinates: [-115.5420, 51.1789],
                image: 'assets/images/venues/tunnel-mountain-main.jpg',
                region: 'banff',
                url: '#banff-venues'
            },
            {
                id: 'silvertip',
                name: 'Silvertip Resort',
                location: 'Canmore, Alberta',
                description: 'A mountain golf resort offering stunning views of the Three Sisters peaks with beautiful indoor and outdoor ceremony spaces.',
                coordinates: [-115.3126, 51.0911],
                image: 'assets/images/venues/silvertip-main.jpg',
                region: 'canmore',
                url: '#canmore-venues'
            },
            {
                id: 'chateau-louise',
                name: 'Chateau Lake Louise',
                location: 'Lake Louise, Alberta',
                description: 'An iconic venue offering enchanting ceremonies by the emerald waters of Lake Louise with the Victoria Glacier as a backdrop.',
                coordinates: [-116.2153, 51.4254],
                image: 'assets/images/venues/lake-louise-main.jpg',
                region: 'lake-louise',
                url: '#lake-louise-venues'
            },
            {
                id: 'emerald-lodge',
                name: 'Emerald Lake Lodge',
                location: 'Yoho National Park, British Columbia',
                description: 'A secluded lodge on the shores of the vibrant, glacier-fed Emerald Lake, perfect for intimate weddings.',
                coordinates: [-116.5285, 51.4429],
                image: 'assets/images/venues/emerald-lake-main.jpg',
                region: 'emerald-lake',
                url: '#emerald-lake-venues'
            },
            {
                id: 'kananaskis-resort',
                name: 'Kananaskis Mountain Lodge',
                location: 'Kananaskis, Alberta',
                description: 'A luxury mountain resort with versatile venues and spectacular views of the Kananaskis Valley and mountains.',
                coordinates: [-115.1410, 51.0896],
                image: 'assets/images/venues/kananaskis-main.jpg',
                region: 'kananaskis',
                url: '#kananaskis-venues'
            }
        ];

        // Create and add markers to the map
        venueMarkers.forEach(venue => {
            // Create marker element
            const markerElement = document.createElement('div');
            markerElement.className = 'venue-marker';
            markerElement.dataset.region = venue.region;
            markerElement.innerHTML = `<i class="fas fa-map-marker-alt"></i>`;
            
            // Create a marker
            const marker = new mapboxgl.Marker(markerElement)
                .setLngLat(venue.coordinates)
                .addTo(map);
            
            // Add click event to each marker
            markerElement.addEventListener('click', () => {
                showVenuePreview(venue);
                
                // Move map to marker
                map.flyTo({
                    center: venue.coordinates,
                    zoom: 12,
                    essential: true
                });
            });
        });
        
        // Add event listener for region filters
        document.querySelectorAll('.region-filter').forEach(button => {
            button.addEventListener('click', () => {
                const region = button.getAttribute('data-region');
                
                // Update active state of filter buttons
                document.querySelectorAll('.region-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Filter markers
                filterMarkers(region);
                
                // Adjust map view based on selected region
                adjustMapView(region);
            });
        });
        
        // Function to filter markers by region
        function filterMarkers(region) {
            const markers = document.querySelectorAll('.venue-marker');
            
            markers.forEach(marker => {
                if (region === 'all' || marker.dataset.region === region) {
                    marker.style.display = 'block';
                } else {
                    marker.style.display = 'none';
                }
            });
        }
        
        // Function to adjust map view based on region
        function adjustMapView(region) {
            switch(region) {
                case 'banff':
                    map.flyTo({
                        center: [-115.5708, 51.1784],
                        zoom: 12,
                        essential: true
                    });
                    break;
                case 'canmore':
                    map.flyTo({
                        center: [-115.3126, 51.0911],
                        zoom: 12,
                        essential: true
                    });
                    break;
                case 'lake-louise':
                    map.flyTo({
                        center: [-116.2153, 51.4254],
                        zoom: 12,
                        essential: true
                    });
                    break;
                case 'emerald-lake':
                    map.flyTo({
                        center: [-116.5285, 51.4429],
                        zoom: 12,
                        essential: true
                    });
                    break;
                case 'kananaskis':
                    map.flyTo({
                        center: [-115.1410, 51.0896],
                        zoom: 12,
                        essential: true
                    });
                    break;
                default:
                    map.flyTo({
                        center: [-116.4817, 51.1784],
                        zoom: 9,
                        essential: true
                    });
                    break;
            }
        }
    });
    
    // Add map styling
    const style = document.createElement('style');
    style.textContent = `
        .venue-marker {
            width: 30px;
            height: 30px;
            color: var(--color-primary);
            font-size: 30px;
            cursor: pointer;
            transition: transform var(--transition-fast);
        }
        .venue-marker:hover {
            transform: scale(1.2);
        }
    `;
    document.head.appendChild(style);
    
    // Function to show venue preview in sidebar
    function showVenuePreview(venue) {
        const previewPlaceholder = document.querySelector('.venue-preview-placeholder');
        const previewContent = document.querySelector('.venue-preview-content');
        const previewImage = document.querySelector('.preview-image');
        const previewTitle = document.querySelector('.preview-title');
        const previewLocation = document.querySelector('.preview-location');
        const previewDescription = document.querySelector('.preview-description');
        const viewVenueBtn = document.querySelector('.btn-view-venue');
        
        // Hide placeholder and show content
        previewPlaceholder.style.display = 'none';
        previewContent.style.display = 'flex';
        
        // Update preview content
        previewImage.src = venue.image;
        previewImage.alt = venue.name;
        previewTitle.textContent = venue.name;
        previewLocation.textContent = venue.location;
        previewDescription.textContent = venue.description;
        viewVenueBtn.href = venue.url;
    }
}

// Region filters outside of map
function initRegionFilters() {
    const regionLinks = document.querySelectorAll('.region-link');
    
    regionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow normal navigation to the venue section
        });
    });
}

// Venue galleries
function initVenueGalleries() {
    const galleryThumbs = document.querySelectorAll('.gallery-thumbs img');
    
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const mainImage = thumb.closest('.venue-gallery').querySelector('.gallery-main img');
            
            // Swap images
            const tempSrc = mainImage.src;
            const tempAlt = mainImage.alt;
            
            mainImage.src = thumb.src;
            mainImage.alt = thumb.alt;
            
            thumb.src = tempSrc;
            thumb.alt = tempAlt;
        });
    });
}

// Venue inquiry modal
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
            
            // Show modal
            modal.classList.add('active');
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
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Form submission
    const form = document.getElementById('venueInquiryForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real implementation, this would submit to a back-end
            // For demo purposes, just show success message
            alert('Thank you for your inquiry! We will contact you within 24 hours to arrange your venue viewing.');
            
            // Close modal
            closeModal();
        });
    }
}

// Virtual 360 tours
function initVirtualTours() {
    const tourModal = document.getElementById('tourModal');
    if (!tourModal) return;
    
    const tourButtons = document.querySelectorAll('.view-360');
    const closeButton = tourModal.querySelector('.close-modal');
    const tourFrame = document.getElementById('tourFrame');
    
    // Tour URLs (in real implementation, these would be actual 360 tour URLs)
    const tourUrls = {
        'banff-springs': 'https://www.google.com/maps/embed?pb=!4v1629293456789!6m8!1m7!1sCAoSLEFGMVFpcE9kUHZMWTF1Wm1fNnlPTXpkNXBzNHo3ajF0NFN1YmwtUzJTcHZX!2m2!1d51.164516!2d-115.559786!3f280!4f0!5f0.7820865974627469',
        'silvertip': 'https://www.google.com/maps/embed?pb=!4v1629293456789!6m8!1m7!1sCAoSLEFGMVFpcE1uaHB4VTJDNUR1Y2VpTXNhbFU3ZnZCTy1XcG5LWkZaWkRNRGtq!2m2!1d51.091130!2d-115.312671!3f280!4f0!5f0.7820865974627469'
    };
    
    // Open tour modal on button click
    tourButtons.forEach(button => {
        button.addEventListener('click', () => {
            const venueId = button.getAttribute('data-venue');
            
            // Set iframe source
            if (tourUrls[venueId]) {
                tourFrame.src = tourUrls[venueId];
                
                // Show modal
                tourModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                alert('Virtual tour coming soon!');
            }
        });
    });
    
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
        tourModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear iframe source
        setTimeout(() => {
            tourFrame.src = '';
        }, 300);
    }
}

// Venue comparison tool
function initVenueComparison() {
    const comparisonTable = document.querySelector('.comparison-table');
    const comparisonPlaceholder = document.querySelector('.comparison-placeholder');
    const venueSelector = document.getElementById('venueSelector');
    const addVenueBtn = document.getElementById('addVenueBtn');
    const resetCompareBtn = document.getElementById('resetCompareBtn');
    
    if (!comparisonTable || !venueSelector || !addVenueBtn) return;
    
    // Venue data for comparison
    const venueData = {
        'banff-springs': {
            name: 'Fairmont Banff Springs',
            location: 'Banff',
            capacity: '10-800 guests',
            priceRange: '$$$-$$$$',
            indoorOutdoor: 'Both',
            accommodation: 'On-site (757 rooms)',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#banff-venues'
        },
        'tunnel-mountain': {
            name: 'Tunnel Mountain Reservoir',
            location: 'Banff',
            capacity: 'Up to 100 guests',
            priceRange: '$-$$',
            indoorOutdoor: 'Outdoor only',
            accommodation: 'Nearby hotels',
            catering: 'External vendors',
            seasonalAvailability: 'May-October',
            viewDetailsLink: '#banff-venues'
        },
        'silvertip': {
            name: 'Silvertip Resort',
            location: 'Canmore',
            capacity: '20-250 guests',
            priceRange: '$$$-$$$$',
            indoorOutdoor: 'Both',
            accommodation: 'Nearby condos',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#canmore-venues'
        },
        'cornerstone': {
            name: 'Cornerstone Theatre',
            location: 'Canmore',
            capacity: '50-220 guests',
            priceRange: '$$-$$$',
            indoorOutdoor: 'Indoor only',
            accommodation: 'Nearby hotels',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#canmore-venues'
        },
        'stewart-creek': {
            name: 'Stewart Creek Golf Club',
            location: 'Canmore',
            capacity: '20-180 guests',
            priceRange: '$$-$$$',
            indoorOutdoor: 'Both',
            accommodation: 'Nearby hotels',
            catering: 'In-house only',
            seasonalAvailability: 'May-October',
            viewDetailsLink: '#canmore-venues'
        },
        'chateau-louise': {
            name: 'Fairmont Chateau Lake Louise',
            location: 'Lake Louise',
            capacity: '10-550 guests',
            priceRange: '$$$-$$$$',
            indoorOutdoor: 'Both',
            accommodation: 'On-site (539 rooms)',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#lake-louise-venues'
        },
        'post-hotel': {
            name: 'Post Hotel & Spa',
            location: 'Lake Louise',
            capacity: '10-90 guests',
            priceRange: '$$$-$$$$',
            indoorOutdoor: 'Both',
            accommodation: 'On-site (96 rooms)',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#lake-louise-venues'
        },
        'emerald-lodge': {
            name: 'Emerald Lake Lodge',
            location: 'Emerald Lake, BC',
            capacity: '10-88 guests',
            priceRange: '$$$-$$$$',
            indoorOutdoor: 'Both',
            accommodation: 'On-site (85 rooms)',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#emerald-lake-venues'
        },
        'kananaskis-resort': {
            name: 'Kananaskis Mountain Lodge',
            location: 'Kananaskis',
            capacity: '20-250 guests',
            priceRange: '$$$-$$$$',
            indoorOutdoor: 'Both',
            accommodation: 'On-site (247 rooms)',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#kananaskis-venues'
        },
        'boundary-ranch': {
            name: 'Boundary Ranch',
            location: 'Kananaskis',
            capacity: '50-200 guests',
            priceRange: '$$-$$$',
            indoorOutdoor: 'Both',
            accommodation: 'Nearby hotels',
            catering: 'In-house or external',
            seasonalAvailability: 'May-October',
            viewDetailsLink: '#kananaskis-venues'
        },
        'mount-engadine': {
            name: 'Mount Engadine Lodge',
            location: 'Kananaskis',
            capacity: '10-40 guests',
            priceRange: '$$-$$$',
            indoorOutdoor: 'Both',
            accommodation: 'On-site (19 rooms)',
            catering: 'In-house only',
            seasonalAvailability: 'Year-round',
            viewDetailsLink: '#kananaskis-venues'
        }
    };
    
    // Store current venues being compared
    let comparedVenues = [];
    
    // Add venue to comparison
    addVenueBtn.addEventListener('click', () => {
        const selectedVenue = venueSelector.value;
        
        if (!selectedVenue) {
            alert('Please select a venue to compare');
            return;
        }
        
        // Check if already comparing 3 venues
        if (comparedVenues.length >= 3) {
            alert('You can compare up to 3 venues. Please remove a venue first.');
            return;
        }
        
        // Check if venue is already being compared
        if (comparedVenues.includes(selectedVenue)) {
            alert('This venue is already in your comparison');
            return;
        }
        
        // Add venue to comparison
        comparedVenues.push(selectedVenue);
        
        // Update comparison table
        updateComparisonTable();
    });
    
    // Reset comparison
    if (resetCompareBtn) {
        resetCompareBtn.addEventListener('click', () => {
            comparedVenues = [];
            
            // Hide table and show placeholder
            comparisonTable.style.display = 'none';
            comparisonPlaceholder.style.display = 'block';
        });
    }
    
    // Update comparison table with venue data
    function updateComparisonTable() {
        // Show table and hide placeholder
        comparisonTable.style.display = 'block';
        comparisonPlaceholder.style.display = 'none';
        
        // Get table cells
        const venueCells = document.querySelectorAll('.venue-col');
        
        // Reset all cells
        venueCells.forEach(cell => {
            cell.textContent = '';
            cell.innerHTML = '';
        });
        
        // Update cells with venue data
        comparedVenues.forEach((venueId, index) => {
            const venue = venueData[venueId];
            const colIndex = index + 1; // 1-based for columns
            
            if (!venue) return;
            
            // Update table headers with venue names
            const headerCell = document.querySelector(`.venue-col.venue-${colIndex}`);
            if (headerCell) {
                headerCell.textContent = venue.name;
            }
            
            // Update all data cells for this venue
            const dataRows = [
                { property: 'location', rowIndex: 1 },
                { property: 'capacity', rowIndex: 2 },
                { property: 'priceRange', rowIndex: 3 },
                { property: 'indoorOutdoor', rowIndex: 4 },
                { property: 'accommodation', rowIndex: 5 },
                { property: 'catering', rowIndex: 6 },
                { property: 'seasonalAvailability', rowIndex: 7 }
            ];
            
            dataRows.forEach(row => {
                const cell = document.querySelector(`tbody tr:nth-child(${row.rowIndex}) td.venue-${colIndex}`);
                if (cell) {
                    cell.textContent = venue[row.property];
                }
            });
            
            // Update view details link
            const actionCell = document.querySelector(`.action-row td.venue-${colIndex}`);
            if (actionCell) {
                const link = document.createElement('a');
                link.href = venue.viewDetailsLink;
                link.className = 'btn btn-secondary';
                link.textContent = 'View Details';
                actionCell.appendChild(link);
            }
        });
    }
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