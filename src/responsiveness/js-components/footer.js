// ==========================================
// FOOTER REVEAL ANIMATION
// Calculates footer height dynamically
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    const footer = document.querySelector('.site-footer');
    const mainContent = document.querySelector('.main-content');
    
    if (!footer || !mainContent) {
        console.warn('Footer or main-content not found');
        return;
    }
    
    // Function to set the margin based on footer height
    function setFooterMargin() {
        const footerHeight = footer.offsetHeight;
        // Προσθέτουμε 150px extra buffer για να χωράει όλο το footer
        mainContent.style.marginBottom = (footerHeight +  'px');
    }
    
    // Initial calculation
    setFooterMargin();
    
    // Recalculate on window resize
    window.addEventListener('resize', () => {
        setFooterMargin();
    });
    
    // Recalculate after fonts load (can affect height)
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            setFooterMargin();
        });
    }
    
    // Optional: Add smooth reveal animation on scroll
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateFooterVisibility() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const footerHeight = footer.offsetHeight;
        
        // Calculate how much of the footer should be visible
        const scrollBottom = scrollY + windowHeight;
        const footerStart = documentHeight - footerHeight;
        
        if (scrollBottom > footerStart) {
            const visibleAmount = scrollBottom - footerStart;
            const visiblePercent = Math.min(visibleAmount / footerHeight, 1);
            
            // Optional: Add parallax or fade effect
            footer.style.opacity = 0.5 + (visiblePercent * 0.5);
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateFooterVisibility();
            });
            ticking = true;
        }
    });
    
    // Initial visibility check
    updateFooterVisibility();
    
    console.log('Footer reveal initialized');
});