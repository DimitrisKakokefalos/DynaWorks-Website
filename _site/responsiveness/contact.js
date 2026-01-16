// ==========================================
// CONTACT PAGE - FORMSPREE INTEGRATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ATHENS TIME CLOCK
    // ==========================================
    const timeDisplay = document.getElementById('athens-time');

    function updateTime() {
        const now = new Date();
        const options = { 
            timeZone: 'Europe/Athens', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        };
        const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
        if (timeDisplay) {
            timeDisplay.textContent = `${timeString} ATH`;
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    // ==========================================
    // 2. SCROLL-CONTROLLED PROCESS STEPS
    // ==========================================
    const processSection = document.querySelector('.process-scroll-section');
    const processSteps = document.querySelectorAll('.process-step-vertical');
    
    if (processSection && processSteps.length > 0) {
        function updateProcessSteps() {
            const sectionRect = processSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const viewportHeight = window.innerHeight;
            
            if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
                processSection.classList.add('scrolling');
                
                const scrollProgress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - viewportHeight)));
                
                processSteps.forEach((step, index) => {
                    const stepProgress = index / (processSteps.length - 1);
                    const nextStepProgress = (index + 1) / (processSteps.length - 1);
                    
                    const activateThreshold = stepProgress - 0.1;
                    const passThreshold = nextStepProgress - 0.15;
                    
                    if (scrollProgress >= activateThreshold && scrollProgress < passThreshold) {
                        step.classList.add('active');
                        step.classList.remove('passed');
                    } else if (scrollProgress >= passThreshold) {
                        step.classList.add('passed');
                        step.classList.remove('active');
                    } else {
                        step.classList.remove('active', 'passed');
                    }
                });
            } else {
                processSection.classList.remove('scrolling');
            }
        }
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(updateProcessSteps);
        });
        
        updateProcessSteps();
    }

    // ==========================================
    // 3. FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-accordion-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });

    // ==========================================
    // 4. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const scrollSections = document.querySelectorAll('[data-scroll-section]');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    scrollSections.forEach(section => {
        scrollObserver.observe(section);
    });

    // ==========================================
    // 5. FORMSPREE CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const enquiryType = document.getElementById('subject').value;
            const consent = document.querySelector('input[name="consent"]').checked;

            // Validate required fields
            if (!name || name.length < 2) {
                showFieldError('name', 'Παρακαλώ συμπλήρωσε το όνομά σου');
                return;
            }

            if (!email || !isValidEmail(email)) {
                showFieldError('email', 'Παρακαλώ συμπλήρωσε ένα έγκυρο email');
                return;
            }

            if (!enquiryType) {
                showFieldError('subject', 'Παρακαλώ επίλεξε ένα θέμα');
                return;
            }

            if (!consent) {
                alert('Παρακαλώ αποδέξου την επεξεργασία των προσωπικών σου δεδομένων');
                return;
            }

            // Get submit button and show loading state
            const submitBtn = contactForm.querySelector('.submit-btn-yellow');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnArrow = submitBtn.querySelector('.btn-arrow');
            
            // Store original text
            const originalText = btnText.textContent;
            
            // Set loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Αποστολή...';
            btnArrow.innerHTML = '<span class="spinner">⟳</span>';
            btnArrow.style.animation = 'spin 1s linear infinite';

            try {
                // Get form action URL (Formspree endpoint)
                const formAction = contactForm.getAttribute('action');
                
                // Collect form data
                const formData = new FormData(contactForm);

                // Send to Formspree via AJAX
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success! Hide form, show success message
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    
                    // Scroll success message into view
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    console.log('✅ Form submitted successfully to Formspree');

                    // Reset form after 5 seconds and show it again
                    setTimeout(() => {
                        contactForm.reset();
                        // Use flex to maintain the form layout
                        contactForm.style.display = 'flex';
                        formSuccess.style.display = 'none';
                    }, 5000);

                } else {
                    // Formspree returned an error
                    const data = await response.json();
                    
                    if (data.errors) {
                        const errorMessages = data.errors.map(err => err.message).join(', ');
                        throw new Error(errorMessages);
                    } else {
                        throw new Error('Form submission failed');
                    }
                }

            } catch (error) {
                console.error('❌ Form error:', error);
                alert('Κάτι πήγε στραβά. Παρακαλώ δοκίμασε ξανά ή στείλε email στο info@dynaworks.gr');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                btnArrow.textContent = '→';
                btnArrow.style.animation = '';
            }
        });
    }

    // ==========================================
    // 6. FORM VALIDATION HELPERS
    // ==========================================
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.focus();
            field.style.borderColor = '#ef4444';
            
            // Remove existing error message if any
            let errorMsg = field.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#ef4444';
                errorMsg.style.fontSize = '0.85rem';
                errorMsg.style.marginTop = '0.5rem';
                field.parentElement.appendChild(errorMsg);
            }
            errorMsg.textContent = message;

            // Clear error on input
            field.addEventListener('input', function clearError() {
                field.style.borderColor = '';
                if (errorMsg) errorMsg.remove();
                field.removeEventListener('input', clearError);
            }, { once: true });
        }
    }

    // ==========================================
    // 7. SMOOTH SCROLL TO SECTIONS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 8. PARALLAX EFFECT ON HERO
    // ==========================================
    const heroSection = document.querySelector('.contact-hero-large');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                heroSection.style.opacity = opacity;
            }
        });
    }

    // ==========================================
    // 9. TRACK PAGE INTERACTIONS
    // ==========================================
    console.log('📧 Contact Page loaded with Formspree integration');
    
    // Track process step views
    if (processSteps && processSteps.length > 0) {
        processSteps.forEach((step, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.classList.contains('active')) {
                        console.log(`📍 Process Step ${index + 1} active`);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(step);
        });
    }

    // Track FAQ interactions
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            console.log(`❓ FAQ ${index + 1} toggled`);
        });
    });

});

// ==========================================
// 10. CSS FOR SPINNER ANIMATION
// ==========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .spinner {
        display: inline-block;
    }
    
    @keyframes fadeIn {
        from { 
            opacity: 0;
            transform: translateY(20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);