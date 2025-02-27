/**
 * Rocky Mountain Weddings - Dynamic Media Management System
 * This script automatically loads media files from the appropriate folders
 * and updates the DOM elements with the correct file paths.
 */

// Configuration for image and video folders
const mediaConfig = {
    images: {
        // Direct access for legacy images (flat structure)
        'legacy': 'assets/images/',
        
        // Homepage components
        'homepage-hero': 'assets/images/homepage-hero/',
        'homepage-featured': 'assets/images/homepage-featured/',
        
        // Services page components
        'services-intro': 'assets/images/services-intro/',
        'services-case-studies': 'assets/images/case-studies/',
        
        // Venues page components
        'venues-intro': 'assets/images/venues-intro/',
        'venues-regions': 'assets/images/venues-regions/',
        'venues-details': 'assets/images/venues-details/',
        
        // Portfolio components
        'portfolio': 'assets/images/portfolio/',
        
        // Common components
        'testimonials': 'assets/images/testimonials/',
        'team': 'assets/images/team/',
        'about': 'assets/images/about/',
        'icons': 'assets/images/icons/'
    },
    videos: {
        // Direct access for legacy videos
        'legacy': 'assets/videos/',
        
        'homepage-hero': 'assets/videos/homepage-hero/',
        'testimonials': 'assets/videos/testimonials/'
    }
};

/**
 * Initializes the media manager by loading all media dynamically
 */
function initMediaManager() {
    console.log('Initializing Dynamic Media Management System...');
    
    // Process all images
    processMediaElements('img', 'images');
    
    // Process all videos
    processMediaElements('video source', 'videos');
    
    // Process video previews (with data-video attributes)
    processVideoPreviewElements();
    
    // Set up live reload for development
    setupLiveReload();
    
    // Log front-end initialization to console
    logMediaUpdate('System initialized');
    
    console.log('Dynamic Media Management System initialized.');
}

/**
 * Process all media elements of a specific type and update their src attributes
 * @param {string} selector - CSS selector for the elements to process
 * @param {string} mediaType - Type of media ('images' or 'videos')
 */
function processMediaElements(selector, mediaType) {
    const elements = document.querySelectorAll(selector);
    let updatedCount = 0;
    
    elements.forEach(element => {
        const currentSrc = element.getAttribute('src');
        if (!currentSrc || currentSrc === '') return;
        
        // Check if this is already a dynamically managed path
        if (currentSrc.includes('?dynamic=true')) return;
        
        // Determine which component category this belongs to
        const componentCategory = determineComponentCategory(element, mediaType);
        if (!componentCategory) return;
        
        // Get the filename from the current src
        const filename = getFilenameFromPath(currentSrc);
        if (!filename) return;
        
        // Build the new dynamic path
        let newPath;
        
        // IMPORTANT: Handle the flat structure for legacy files (direct images in assets/images/)
        if (componentCategory === 'legacy') {
            // For legacy files, keep the original path but add the dynamic parameter
            newPath = `${currentSrc}?dynamic=true`;
        } else {
            // For new directory structure
            newPath = `${mediaConfig[mediaType][componentCategory]}${filename}?dynamic=true`;
        }
        
        // Update the src attribute
        element.setAttribute('src', newPath);
        console.log(`Updated ${mediaType} path: ${currentSrc} → ${newPath}`);
        updatedCount++;
    });
    
    if (updatedCount > 0) {
        logMediaUpdate(`Updated ${updatedCount} ${mediaType} elements`);
    }
}

/**
 * Process elements with data-video attributes (video previews)
 */
function processVideoPreviewElements() {
    const elements = document.querySelectorAll('[data-video]');
    let updatedCount = 0;
    
    elements.forEach(element => {
        const videoFilename = element.getAttribute('data-video');
        if (!videoFilename) return;
        
        // Determine if this is a testimonial video or another type
        let componentCategory = element.closest('.testimonial') ? 'testimonials' : 'homepage-hero';
        
        // If the filename doesn't contain a path, assume it's a direct reference
        if (!videoFilename.includes('/')) {
            componentCategory = 'legacy';
        }
        
        // Update the data-video attribute with the full path
        const newPath = `${mediaConfig.videos[componentCategory]}${videoFilename}?dynamic=true`;
        element.setAttribute('data-video', newPath);
        console.log(`Updated video preview path: ${videoFilename} → ${newPath}`);
        updatedCount++;
    });
    
    if (updatedCount > 0) {
        logMediaUpdate(`Updated ${updatedCount} video preview elements`);
    }
}

/**
 * Determine which component category a media element belongs to
 * @param {Element} element - The DOM element to analyze
 * @param {string} mediaType - Type of media ('images' or 'videos')
 * @returns {string|null} - The component category or null if not found
 */
function determineComponentCategory(element, mediaType) {
    // Get the current src path
    const currentSrc = element.getAttribute('src');
    if (!currentSrc) return null;
    
    // IMPORTANT: Check if it's a direct reference without subfolder structure
    if ((currentSrc.startsWith('assets/images/') || currentSrc.startsWith('assets/videos/')) && 
        !currentSrc.includes('/', currentSrc.indexOf('/', 8) + 1)) {
        return 'legacy';
    }
    
    // Check if the path already contains a category identifier
    for (const category in mediaConfig[mediaType]) {
        if (category === 'legacy') continue; // Skip legacy check as we did it above
        if (currentSrc.includes(`/${category}/`) || 
            currentSrc.includes(`/${category.replace('-', '/')}/`)) {
            return category;
        }
    }
    
    // If no match found in the path, try to determine from DOM context
    const parent = element.closest('section, .hero, .featured, .testimonial, .team-member, .venue-card, .service-card');
    if (!parent) return 'legacy'; // Default to legacy if no context is found
    
    const parentClasses = parent.className.split(' ');
    
    // Map common section/component classes to categories
    const classToCategory = {
        'hero': 'homepage-hero',
        'featured': 'homepage-featured',
        'service-intro': 'services-intro',
        'services-intro': 'services-intro',
        'case-study': 'services-case-studies',
        'venues-intro': 'venues-intro',
        'region-selector': 'venues-regions',
        'venue-details': 'venues-details',
        'portfolio': 'portfolio',
        'testimonial': 'testimonials',
        'team-section': 'team',
        'about-section': 'about'
    };
    
    // Check if any of the parent classes match our mapping
    for (const cls of parentClasses) {
        if (classToCategory[cls]) {
            return classToCategory[cls];
        }
    }
    
    // If still no match, try to infer from the page URL
    const pagePath = window.location.pathname;
    
    if (pagePath.includes('index') || pagePath.endsWith('/')) {
        if (element.closest('.hero, header')) return 'homepage-hero';
        if (element.closest('.featured')) return 'homepage-featured';
        if (element.closest('.testimonial')) return 'testimonials';
        return 'homepage-featured';
    }
    if (pagePath.includes('services')) {
        if (element.closest('.intro')) return 'services-intro';
        if (element.closest('.case-study')) return 'services-case-studies';
        if (element.closest('.testimonial')) return 'testimonials';
        return 'services-intro';
    }
    if (pagePath.includes('venues')) {
        if (element.closest('.intro')) return 'venues-intro';
        if (element.closest('.region')) return 'venues-regions';
        if (element.closest('.venue-details')) return 'venues-details';
        return 'venues-intro';
    }
    if (pagePath.includes('portfolio')) {
        return 'portfolio';
    }
    if (pagePath.includes('about')) {
        if (element.closest('.team')) return 'team';
        return 'about';
    }
    
    // Default to legacy if nothing else matches
    return 'legacy';
}

/**
 * Extract the filename from a file path
 * @param {string} path - The file path
 * @returns {string} - The filename
 */
function getFilenameFromPath(path) {
    // Handle empty or undefined paths
    if (!path) return '';
    
    // Remove query parameters
    const pathWithoutQuery = path.split('?')[0];
    
    // Extract the filename
    const parts = pathWithoutQuery.split('/');
    return parts[parts.length - 1];
}

/**
 * Setup live reload for development
 * This will check for changes in the assets directory and refresh the page
 */
function setupLiveReload() {
    // Only set up in development mode (you can modify this check as needed)
    if (window.location.hostname !== 'localhost' && 
        !window.location.hostname.includes('127.0.0.1') &&
        !window.location.search.includes('dev=true')) {
        return;
    }
    
    console.log('Setting up live reload for media files...');
    
    // Use localStorage to track the last update time
    let lastUpdateCheck = localStorage.getItem('mediaLastUpdateCheck') || Date.now();
    
    // Check for updates every 3 seconds
    setInterval(() => {
        // Create a unique URL to prevent caching
        const timestamp = Date.now();
        fetch(`/assets/update-check.json?t=${timestamp}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                // If the file doesn't exist, just use the current time
                return { lastUpdate: timestamp };
            })
            .then(data => {
                if (data.lastUpdate > lastUpdateCheck) {
                    console.log('Media files updated! Refreshing page...');
                    localStorage.setItem('mediaLastUpdateCheck', timestamp);
                    window.location.reload();
                }
            })
            .catch(err => {
                // Silently fail - this is expected in production where the file doesn't exist
            });
    }, 3000);
}

/**
 * Log media updates to the console and potentially to the server
 * @param {string} message - The message to log
 */
function logMediaUpdate(message) {
    const timestamp = new Date().toLocaleString();
    const logMessage = `[${timestamp}] - ${message}`;
    console.log(`📊 Media Log: ${logMessage}`);
    
    // If in development mode, attempt to append to the log file on the server
    if (window.location.hostname === 'localhost' || 
        window.location.hostname.includes('127.0.0.1') ||
        window.location.search.includes('dev=true')) {
        
        // This is a simple example using fetch - in a real environment you might use
        // a more robust approach or a dedicated logging service
        try {
            fetch('/api/log-media-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: logMessage })
            }).catch(err => {
                // Silently fail - this is just for development
            });
        } catch (err) {
            // Silently fail - logging should never break the app
        }
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initMediaManager);

// Expose the API for manual refreshes or updates
window.mediaManager = {
    refresh: initMediaManager,
    getMediaPath: function(filename, type, category) {
        if (!mediaConfig[type] || !mediaConfig[type][category]) {
            console.error(`Invalid media type or category: ${type}/${category}`);
            return filename;
        }
        return `${mediaConfig[type][category]}${filename}?dynamic=true`;
    }
}; 