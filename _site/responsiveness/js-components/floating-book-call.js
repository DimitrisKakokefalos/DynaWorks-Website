// ==========================================
// FLOATING BOOK A CALL BUTTON
// Shows after scrolling past hero section
// ==========================================

(function() {
    'use strict';
    
    const floatingBtn = document.getElementById('floatingChatBtn');
    
    if (!floatingBtn) return;
    
    // Click to go to booking
    floatingBtn.addEventListener('click', function() {
        window.location.href = 'booking.html';
    });
    
    // Accessibility
    floatingBtn.setAttribute('role', 'button');
    floatingBtn.setAttribute('tabindex', '0');
    floatingBtn.setAttribute('aria-label', 'Book a call');
    
    floatingBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = 'booking.html';
        }
    });
    
    // Show/hide based on scroll position (after hero section)
    const heroSection = document.querySelector('.hero-section');
    const threshold = heroSection ? heroSection.offsetHeight : 500;
    
    let isVisible = false;
    let ticking = false;
    
    function toggleVisibility() {
        if (window.scrollY > threshold) {
            if (!isVisible) {
                floatingBtn.classList.add('visible');
                isVisible = true;
            }
        } else {
            if (isVisible) {
                floatingBtn.classList.remove('visible');
                isVisible = false;
            }
        }
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                toggleVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    toggleVisibility();
    
    console.log('📅 Floating Book a Call button initialized');
})();