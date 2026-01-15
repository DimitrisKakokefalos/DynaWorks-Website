// ==========================================
// BACK TO TOP BUTTON
// ==========================================

(function() {
    'use strict';

    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Επιστροφή στην κορυφή');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    
    document.body.appendChild(button);

    let isVisible = false;
    const threshold = 500;

    function toggleVisibility() {
        if (window.scrollY > threshold) {
            if (!isVisible) {
                button.classList.add('visible');
                isVisible = true;
            }
        } else {
            if (isVisible) {
                button.classList.remove('visible');
                isVisible = false;
            }
        }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                toggleVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    console.log('⬆️ Back to top button initialized');
})();