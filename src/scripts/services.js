// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    initBookingButtons();
    initModal();
    initFormValidation();
});

// Initialize Booking Buttons
function initBookingButtons() {
    const bookButtons = document.querySelectorAll('.btn-book');
    const modal = document.getElementById('bookingModal');
    const packageInput = document.getElementById('package');

    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get package type from button data attribute
            const packageType = button.dataset.package;
            
            // Update hidden input with package type
            packageInput.value = packageType.charAt(0).toUpperCase() + 
                               packageType.slice(1) + ' Planning Package';
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
}

// Initialize Modal
function initModal() {
    const modal = document.getElementById('bookingModal');
    const closeButton = document.querySelector('.close-modal');

    // Close on X button click
    closeButton.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('bookingForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (validateForm(data)) {
            try {
                // Show loading state
                const submitButton = form.querySelector('.btn-submit');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                // Submit form to Netlify
                await submitForm(data);

                // Show success message
                showMessage('Thank you! We will contact you soon.', 'success');
                form.reset();

            } catch (error) {
                // Show error message
                showMessage('Something went wrong. Please try again.', 'error');
            } finally {
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }
    });
}

// Validate Form Data
function validateForm(data) {
    let isValid = true;
    const errors = [];

    // Required fields
    if (!data.name || data.name.trim() === '') {
        errors.push('Please enter your name');
        isValid = false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email');
        isValid = false;
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
        isValid = false;
    }

    // Show errors if any
    if (!isValid) {
        showMessage(errors.join('<br>'), 'error');
    }

    return isValid;
}

// Email Validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone Validation
function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

// Show Message Function
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.innerHTML = message;

    // Add to page
    const form = document.getElementById('bookingForm');
    form.parentNode.insertBefore(messageElement, form);

    // Remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Submit Form Function
async function submitForm(data) {
    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response;
}