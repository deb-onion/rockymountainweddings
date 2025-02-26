// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    initBookingButtons();
    initModal();
    initFormValidation();
    initPricingCalculator();
    initFaqToggles();
    initServiceLinkScrolling();
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

// Pricing Calculator
function initPricingCalculator() {
    const calculator = document.querySelector('.pricing-calculator');
    if (!calculator) return;

    // Cache DOM elements
    const primaryServiceOptions = document.querySelectorAll('.primary-service .option');
    const addOnOptions = document.querySelectorAll('.add-ons .option input[type="checkbox"]');
    const guestCountOptions = document.querySelectorAll('.guest-count .option input[type="radio"]');
    const priceMinElement = document.querySelector('.price-min');
    const priceMaxElement = document.querySelector('.price-max');

    // Initial prices
    let basePrice = 5000; // Default to Full Planning
    let addOnsTotal = 0;
    let guestUpcharge = 0;

    // Set up event listeners
    primaryServiceOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        
        radio.addEventListener('change', () => {
            if (radio.checked) {
                // Update selected state visually
                primaryServiceOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                
                // Update base price
                basePrice = parseInt(option.getAttribute('data-price'));
                updateTotalPrice();
            }
        });
        
        // Set initial selected state
        if (radio.checked) {
            option.classList.add('selected');
        }
    });

    addOnOptions.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const option = checkbox.closest('.option');
            const price = parseInt(option.getAttribute('data-price'));
            
            if (checkbox.checked) {
                option.classList.add('selected');
                addOnsTotal += price;
            } else {
                option.classList.remove('selected');
                addOnsTotal -= price;
            }
            
            updateTotalPrice();
        });
    });

    guestCountOptions.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const option = radio.closest('.option');
                
                // Update selected state visually
                guestCountOptions.forEach(r => {
                    r.closest('.option').classList.remove('selected');
                });
                option.classList.add('selected');
                
                // Update guest upcharge
                guestUpcharge = parseInt(option.getAttribute('data-price'));
                updateTotalPrice();
            }
        });
        
        // Set initial selected state
        if (radio.checked) {
            radio.closest('.option').classList.add('selected');
        }
    });

    // Calculate and update price display
    function updateTotalPrice() {
        const totalMin = basePrice + addOnsTotal + guestUpcharge;
        const totalMax = totalMin + 1500; // Add buffer for customizations
        
        // Format prices with commas
        const formattedMin = '$' + totalMin.toLocaleString();
        const formattedMax = '$' + totalMax.toLocaleString();
        
        // Update DOM
        priceMinElement.textContent = formattedMin;
        priceMaxElement.textContent = formattedMax;
    }

    // Initialize with default values
    updateTotalPrice();
}

// FAQ Toggles
function initFaqToggles() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active state on clicked item
            item.classList.toggle('active');
            
            // Optional: close other FAQs when one is opened
            // Uncomment to enable this behavior
            /*
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            */
        });
    });

    // Optionally open the first FAQ item by default
    // faqItems[0].classList.add('active');
}

// Smooth scroll to services when clicking service links from other pages
function initServiceLinkScrolling() {
    // Check if URL contains a hash that corresponds to a service
    const hash = window.location.hash;
    if (hash) {
        // Remove # from the hash
        const targetId = hash.replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Add slight delay to ensure page is fully loaded
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }

    // Also handle links within the page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
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

// Call the function to handle anchor links
initServiceLinkScrolling();