document.addEventListener('DOMContentLoaded', () => {
    initVenueModal();
    initGalleryThumbs();
    initFormValidation();
});

// Modal Functionality
function initVenueModal() {
    const modal = document.getElementById('venueModal');
    const buttons = document.querySelectorAll('.btn-venue-inquiry');
    const closeBtn = document.querySelector('.close-modal');
    const venueInput = document.getElementById('selectedVenue');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const venueName = e.target.closest('.venue-info').querySelector('h2').textContent;
            venueInput.value = venueName;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Gallery Thumbnails
function initGalleryThumbs() {
    const galleries = document.querySelectorAll('.venue-gallery');

    galleries.forEach(gallery => {
        const mainImg = gallery.querySelector('.gallery-main img');
        const thumbs = gallery.querySelectorAll('.gallery-thumbs img');

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImg.src = thumb.src;
                mainImg.alt = thumb.alt;
                
                // Add fade effect
                mainImg.style.opacity = '0';
                setTimeout(() => {
                    mainImg.style.opacity = '1';
                }, 50);
            });
        });
    });
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('venueInquiryForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm(form)) {
            try {
                const submitBtn = form.querySelector('.btn-submit');
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Submit to Netlify
                const formData = new FormData(form);
                await fetch('/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString()
                });

                showMessage('Thank you! We will contact you within 24 hours.', 'success');
                form.reset();
                setTimeout(() => {
                    document.querySelector('.close-modal').click();
                }, 3000);

            } catch (error) {
                showMessage('Something went wrong. Please try again.', 'error');
            } finally {
                submitBtn.textContent = 'Submit Request';
                submitBtn.disabled = false;
            }
        }
    });
}

// Form Validation Helper
function validateForm(form) {
    const required = form.querySelectorAll('[required]');
    let isValid = true;

    required.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email');
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    });

    return isValid;
}

// Validation Helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);

    field.addEventListener('input', () => {
        errorDiv.remove();
    }, { once: true });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('venueInquiryForm');
    form.parentNode.insertBefore(messageDiv, form);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}