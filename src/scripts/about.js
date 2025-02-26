// About Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
    initTeamVideoModals();
    initSceneGallery();
});

// Interactive Timeline
function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineDots = document.querySelectorAll('.timeline-dot');
    const prevButton = document.querySelector('.timeline-prev');
    const nextButton = document.querySelector('.timeline-next');
    
    // Set current slide index
    let currentSlide = 0;
    
    // Set initial state - show first slide
    setActiveSlide(currentSlide);
    
    // Add event listeners to navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                setActiveSlide(currentSlide);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentSlide < timelineItems.length - 1) {
                currentSlide++;
                setActiveSlide(currentSlide);
            }
        });
    }
    
    // Add event listeners to timeline dots
    timelineDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            setActiveSlide(currentSlide);
        });
    });
    
    // Function to set active slide
    function setActiveSlide(index) {
        // Update timeline items
        timelineItems.forEach(item => {
            item.classList.remove('active');
        });
        timelineItems[index].classList.add('active');
        
        // Update dots
        timelineDots.forEach(dot => {
            dot.classList.remove('active');
        });
        timelineDots[index].classList.add('active');
        
        // Update button states
        if (prevButton) {
            prevButton.disabled = index === 0;
            prevButton.style.opacity = index === 0 ? '0.5' : '1';
        }
        
        if (nextButton) {
            nextButton.disabled = index === timelineItems.length - 1;
            nextButton.style.opacity = index === timelineItems.length - 1 ? '0.5' : '1';
        }
    }
    
    // Auto-advance timeline (optional)
    // Uncomment to enable auto-advancing
    /*
    let timelineInterval = setInterval(() => {
        if (currentSlide < timelineItems.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        setActiveSlide(currentSlide);
    }, 5000);
    
    // Pause auto-advance on hover
    timeline.addEventListener('mouseenter', () => {
        clearInterval(timelineInterval);
    });
    
    // Resume auto-advance on mouse leave
    timeline.addEventListener('mouseleave', () => {
        timelineInterval = setInterval(() => {
            if (currentSlide < timelineItems.length - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            setActiveSlide(currentSlide);
        }, 5000);
    });
    */
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            currentSlide--;
            setActiveSlide(currentSlide);
        } else if (e.key === 'ArrowRight' && currentSlide < timelineItems.length - 1) {
            currentSlide++;
            setActiveSlide(currentSlide);
        }
    });
}

// Team Member Video Modals
function initTeamVideoModals() {
    const videoLinks = document.querySelectorAll('.video-preview');
    const videoModal = document.querySelector('.video-modal');
    
    if (videoLinks.length === 0 || !videoModal) return;
    
    const closeButton = videoModal.querySelector('.close-modal');
    const modalVideo = videoModal.querySelector('#modal-video');
    
    // Add click event to video preview links
    videoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get video source
            const videoSrc = link.getAttribute('data-video');
            
            // Update modal video source
            if (modalVideo) {
                const source = modalVideo.querySelector('source');
                if (source) {
                    source.setAttribute('src', `assets/videos/${videoSrc}`);
                    modalVideo.load();
                }
            }
            
            // Show modal
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal on button click
    if (closeButton) {
        closeButton.addEventListener('click', closeVideoModal);
    }
    
    // Close modal on outside click
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    // Function to close video modal
    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Pause video
        if (modalVideo) {
            modalVideo.pause();
        }
    }
}

// Behind-the-Scenes Gallery - Lightbox Effect
function initSceneGallery() {
    const sceneItems = document.querySelectorAll('.scene-item');
    
    // Create lightbox elements if they don't exist
    let lightbox = document.querySelector('.scenes-lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'scenes-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="close-lightbox" aria-label="Close lightbox"><i class="fas fa-times"></i></button>
                <img src="" alt="" class="lightbox-image">
                <p class="lightbox-caption"></p>
                <div class="lightbox-nav">
                    <button class="lightbox-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
                    <button class="lightbox-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Style the lightbox
        const style = document.createElement('style');
        style.textContent = `
            .scenes-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 9000;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                visibility: hidden;
                transition: all var(--transition-medium);
            }
            .scenes-lightbox.active {
                opacity: 1;
                visibility: visible;
            }
            .lightbox-content {
                position: relative;
                width: 90%;
                max-width: 1000px;
                text-align: center;
            }
            .close-lightbox {
                position: absolute;
                top: -50px;
                right: 0;
                color: white;
                font-size: 3rem;
                background: none;
                border: none;
                cursor: pointer;
                z-index: 2;
            }
            .lightbox-image {
                max-width: 100%;
                max-height: 80vh;
                border-radius: 10px;
            }
            .lightbox-caption {
                color: white;
                margin-top: 20px;
                font-size: 1.8rem;
            }
            .lightbox-nav {
                position: absolute;
                width: 100%;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
            }
            .lightbox-prev, .lightbox-next {
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            .lightbox-prev:hover, .lightbox-next:hover {
                background-color: rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Lightbox elements
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.close-lightbox');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    
    // Current image index
    let currentIndex = 0;
    
    // Add click event to scene items
    sceneItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Get image source and caption
            const imgSrc = item.querySelector('img').src;
            const caption = item.querySelector('.scene-caption p').textContent;
            
            // Set current index
            currentIndex = index;
            
            // Update lightbox content
            lightboxImage.src = imgSrc;
            lightboxImage.alt = caption;
            lightboxCaption.textContent = caption;
            
            // Show lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox on button click
    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    }
    
    // Close lightbox on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigate to previous image
    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = sceneItems.length - 1;
            }
            
            updateLightbox();
        });
    }
    
    // Navigate to next image
    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (currentIndex < sceneItems.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            
            updateLightbox();
        });
    }
    
    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            // Previous image on left arrow
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = sceneItems.length - 1;
            }
            updateLightbox();
        } else if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            // Next image on right arrow
            if (currentIndex < sceneItems.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateLightbox();
        }
    });
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Function to update lightbox content
    function updateLightbox() {
        const item = sceneItems[currentIndex];
        const imgSrc = item.querySelector('img').src;
        const caption = item.querySelector('.scene-caption p').textContent;
        
        lightboxImage.src = imgSrc;
        lightboxImage.alt = caption;
        lightboxCaption.textContent = caption;
    }
} 