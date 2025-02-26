// Wait for page load
document.addEventListener('DOMContentLoaded', () => {
    initPortfolioFilters();
    initPortfolioHover();
    initTestimonialSlider();
    initScrollAnimations();
});

// Portfolio Filtering
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');

            // Get filter value
            const filterValue = button.getAttribute('data-filter');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Portfolio Hover Effects
function initPortfolioHover() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const image = item.querySelector('.portfolio-image img');

        // Mouse enter effect
        item.addEventListener('mouseenter', () => {
            overlay.style.transform = 'translateY(0)';
            image.style.transform = 'scale(1.1)';
        });

        // Mouse leave effect
        item.addEventListener('mouseleave', () => {
            overlay.style.transform = 'translateY(100%)';
            image.style.transform = 'scale(1)';
        });
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonials = [
        {
            quote: "Working with Rocky Mountain Weddings was the best decision we made. They made our dream wedding come true!",
            author: "Sarah & James"
        },
        {
            quote: "Our wedding day was absolutely perfect. Every detail was thoughtfully planned and executed.",
            author: "Emma & Michael"
        },
        {
            quote: "The team's knowledge of the Rockies and local vendors made planning our destination wedding so easy.",
            author: "Jessica & David"
        }
    ];

    let currentSlide = 0;
    const slider = document.querySelector('.testimonials-slider');

    function showSlide(index) {
        const slide = testimonials[index];
        const slideHTML = `
            <div class="testimonial-slide" style="opacity: 0">
                <p class="quote">"${slide.quote}"</p>
                <p class="author">- ${slide.author}</p>
            </div>
        `;

        slider.innerHTML = slideHTML;
        
        // Fade in effect
        setTimeout(() => {
            slider.querySelector('.testimonial-slide').style.opacity = '1';
        }, 10);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }

    // Show first slide
    showSlide(currentSlide);

    // Auto advance slides
    setInterval(nextSlide, 5000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with 'reveal' class
    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });
}

// Lazy Loading Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();