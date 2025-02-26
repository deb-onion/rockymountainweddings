// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initHeroParallax();
    initSmoothScroll();
    initImageSlideshow();
    initServicesCarousel();
    initTestimonials();
    initInstagramFeed();
    initVideoModals();
    initCookieBanner();
});

// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 400);
    });
}

// Navigation
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    
    const navHeight = nav.offsetHeight;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show navigation on scroll
        if (currentScroll > lastScroll && currentScroll > navHeight * 2) {
            nav.style.transform = `translateY(-${navHeight}px)`;
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;
    
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.getAttribute('href').startsWith('#')) {
                toggleMenu();
            } else {
                toggleMenu();
                // Add slight delay for smooth transition
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    });

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }
}

// Scroll Animations
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

// Hero Parallax Effect
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (!hero || !heroContent) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.35;
        
        if (heroContent) {
            heroContent.style.transform = `translate(-50%, ${-50 + rate}px)`;
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                e.preventDefault();
                const targetPosition = target.offsetTop - 100;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Image Slideshow
function initImageSlideshow() {
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    if (slideshowContainers.length === 0) return;
    
    slideshowContainers.forEach(container => {
        const slides = container.querySelectorAll('.slide');
        const prevButton = container.nextElementSibling.querySelector('.prev-slide');
        const nextButton = container.nextElementSibling.querySelector('.next-slide');
        const dots = container.nextElementSibling.querySelectorAll('.dot');
        
        let currentSlide = 0;
        let slideInterval;
        
        // Set initial state
        slides[0].classList.add('active');
        if (dots.length > 0) {
            dots[0].classList.add('active');
        }
        
        // Start slideshow
        startSlideshow();
        
        // Event listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                resetSlideshow();
                changeSlide(currentSlide - 1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                resetSlideshow();
                changeSlide(currentSlide + 1);
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                resetSlideshow();
                changeSlide(index);
            });
        });
        
        // Pause slideshow on hover
        container.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        container.addEventListener('mouseleave', () => {
            startSlideshow();
        });
        
        // Functions
        function changeSlide(n) {
            slides[currentSlide].classList.remove('active');
            if (dots.length > 0) {
                dots[currentSlide].classList.remove('active');
            }
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if (dots.length > 0) {
                dots[currentSlide].classList.add('active');
            }
        }
        
        function startSlideshow() {
            slideInterval = setInterval(() => {
                changeSlide(currentSlide + 1);
            }, 5000);
        }
        
        function resetSlideshow() {
            clearInterval(slideInterval);
            startSlideshow();
        }
    });
}

// Services Carousel
function initServicesCarousel() {
    const carousels = document.querySelectorAll('.services-carousel');
    if (carousels.length === 0) return;
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.services-track');
        const cards = track.querySelectorAll('.service-card');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        
        // Set initial state
        let carouselIndex = 0;
        let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        let cardsPerView = getCardsPerView();
        let maxIndex = Math.max(0, cards.length - cardsPerView);
        
        // Update on window resize
        window.addEventListener('resize', () => {
            cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
            cardsPerView = getCardsPerView();
            maxIndex = Math.max(0, cards.length - cardsPerView);
            updateCarousel();
        });
        
        // Event listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (carouselIndex > 0) {
                    carouselIndex--;
                    updateCarousel();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (carouselIndex < maxIndex) {
                    carouselIndex++;
                    updateCarousel();
                }
            });
        }
        
        // Helper functions
        function getCardsPerView() {
            const viewportWidth = window.innerWidth;
            if (viewportWidth < 768) return 1;
            if (viewportWidth < 992) return 2;
            if (viewportWidth < 1200) return 3;
            return 4;
        }
        
        function updateCarousel() {
            const translateX = -carouselIndex * cardWidth;
            track.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            if (prevButton) {
                prevButton.disabled = carouselIndex === 0;
                prevButton.style.opacity = carouselIndex === 0 ? '0.5' : '1';
            }
            
            if (nextButton) {
                nextButton.disabled = carouselIndex >= maxIndex;
                nextButton.style.opacity = carouselIndex >= maxIndex ? '0.5' : '1';
            }
        }
        
        // Initialize
        updateCarousel();
    });
}

// Testimonials
function initTestimonials() {
    const testimonialSliders = document.querySelectorAll('.testimonial-slider');
    if (testimonialSliders.length === 0) return;
    
    testimonialSliders.forEach(slider => {
        const testimonials = slider.querySelectorAll('.testimonial-card');
        const prevButton = slider.querySelector('.testimonial-prev');
        const nextButton = slider.querySelector('.testimonial-next');
        const dots = slider.querySelectorAll('.dot');
        
        let currentIndex = 0;
        
        // Initial state
        testimonials[0].classList.add('active');
        if (dots.length > 0) {
            dots[0].classList.add('active');
        }
        
        // Event listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                changeTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                changeTestimonial((currentIndex + 1) % testimonials.length);
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                changeTestimonial(index);
            });
        });
        
        function changeTestimonial(index) {
            testimonials[currentIndex].classList.remove('active');
            if (dots.length > 0) {
                dots[currentIndex].classList.remove('active');
            }
            
            currentIndex = index;
            
            testimonials[currentIndex].classList.add('active');
            if (dots.length > 0) {
                dots[currentIndex].classList.add('active');
            }
        }
    });
}

// Instagram Feed
function initInstagramFeed() {
    const instagramGrid = document.querySelector('.instagram-grid');
    if (!instagramGrid) return;
    
    const placeholder = instagramGrid.querySelector('.instagram-placeholder');
    
    // Simulate loading Instagram feed with a delay
    setTimeout(() => {
        // Remove placeholder
        if (placeholder) {
            placeholder.remove();
        }
        
        // Create sample Instagram posts (in a real implementation, this would come from Instagram API)
        const instagramPosts = [
            {
                image: 'assets/images/instagram-1.jpg',
                link: '#',
                alt: 'Mountain wedding ceremony'
            },
            {
                image: 'assets/images/instagram-2.jpg',
                link: '#',
                alt: 'Bride and groom portrait'
            },
            {
                image: 'assets/images/instagram-3.jpg',
                link: '#',
                alt: 'Wedding reception details'
            },
            {
                image: 'assets/images/instagram-4.jpg',
                link: '#',
                alt: 'Wedding flowers'
            },
            {
                image: 'assets/images/instagram-5.jpg',
                link: '#',
                alt: 'Wedding cake'
            },
            {
                image: 'assets/images/instagram-6.jpg',
                link: '#',
                alt: 'Bride getting ready'
            },
            {
                image: 'assets/images/instagram-7.jpg',
                link: '#',
                alt: 'Wedding rings'
            },
            {
                image: 'assets/images/instagram-8.jpg',
                link: '#',
                alt: 'First dance'
            }
        ];
        
        // Add posts to grid
        instagramPosts.forEach(post => {
            const postElement = document.createElement('a');
            postElement.href = post.link;
            postElement.className = 'instagram-post';
            postElement.target = '_blank';
            postElement.rel = 'noopener noreferrer';
            
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.alt}">
                <div class="instagram-overlay">
                    <i class="fab fa-instagram instagram-icon"></i>
                </div>
            `;
            
            instagramGrid.appendChild(postElement);
        });
    }, 1500);
}

// Video Modals
function initVideoModals() {
    const videoLinks = document.querySelectorAll('.video-preview');
    const videoModal = document.querySelector('.video-modal');
    
    if (videoLinks.length === 0 || !videoModal) return;
    
    const closeModal = videoModal.querySelector('.close-modal');
    const modalVideo = videoModal.querySelector('#modal-video');
    
    videoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const videoSrc = link.getAttribute('data-video');
            
            if (modalVideo) {
                const source = modalVideo.querySelector('source');
                if (source) {
                    source.setAttribute('src', `assets/videos/${videoSrc}`);
                    modalVideo.load();
                }
            }
            
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeVideoModal();
        });
    }
    
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        
        if (modalVideo) {
            modalVideo.pause();
        }
    }
}

// Cookie Banner
function initCookieBanner() {
    const cookieBanner = document.querySelector('.cookie-banner');
    if (!cookieBanner) return;
    
    const acceptButton = cookieBanner.querySelector('.cookie-accept');
    const settingsButton = cookieBanner.querySelector('.cookie-settings');
    
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted) {
        // Show cookie banner after a delay
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 2000);
    }
    
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('active');
        });
    }
    
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            // In a real implementation, this would open cookie settings modal
            alert('Cookie settings would open here. For this demo, all cookies are accepted.');
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('active');
        });
    }
}

// Form Validation (for contact form pages)
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic validation
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const errors = validateForm(data);

        if (Object.keys(errors).length === 0) {
            try {
                await submitForm(data);
                showSuccessMessage();
                form.reset();
            } catch (error) {
                showErrorMessage();
            }
        } else {
            // Display errors
            Object.keys(errors).forEach(field => {
                const input = form.querySelector(`[name="${field}"]`);
                const errorElement = document.createElement('div');
                errorElement.className = 'form-error';
                errorElement.textContent = errors[field];
                
                input.classList.add('error');
                input.parentNode.appendChild(errorElement);
            });
        }
    });

    // Clear errors on input
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorElement = input.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
}

function validateForm(data) {
    const errors = {};

    if (!data.name || data.name.trim() === '') {
        errors.name = 'Name is required';
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Valid email is required';
    }

    if (!data.message || data.message.trim() === '') {
        errors.message = 'Message is required';
    }

    return errors;
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function submitForm(data) {
    // In a real implementation, this would submit to a backend
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve({ success: true });
        }, 1000);
    });
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-message success';
    successMessage.textContent = 'Thank you! Your message has been sent successfully.';
    
    insertMessage(successMessage);
}

function showErrorMessage() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-message error';
    errorMessage.textContent = 'Oops! Something went wrong. Please try again later.';
    
    insertMessage(errorMessage);
}

function insertMessage(messageElement) {
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(messageElement, form);
    
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}