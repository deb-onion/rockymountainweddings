// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initHeroParallax();
    initSmoothScroll();
});

// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
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
        if (currentScroll > lastScroll && currentScroll > navHeight) {
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

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
            // Add slight delay for smooth transition
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
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
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const targetPosition = target.offsetTop - 100;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Validation
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
            showFormErrors(errors);
        }
    });
}

// Form Validation Helper
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

// Email Validation Helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Form Submission
async function submitForm(data) {
    const response = await fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Form submission failed');
    }

    return response.json();
}

// Success/Error Messages
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = 'Thank you! We will be in touch soon.';
    insertMessage(message);
}

function showErrorMessage() {
    const message = document.createElement('div');
    message.className = 'form-message error';
    message.textContent = 'Something went wrong. Please try again.';
    insertMessage(message);
}

function insertMessage(messageElement) {
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(messageElement, form.nextSibling);
    
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}