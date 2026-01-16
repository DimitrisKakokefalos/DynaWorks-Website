// ==========================================
// BOOKING PAGE SPECIFIC JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ATHENS TIME CLOCK (Shared)
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
    // 2. HORIZONTAL SCROLL ANIMATION WITH STRICT LOCK
    // ==========================================
    const processSection = document.querySelector('.process-section-horizontal');
    const slides = document.querySelectorAll('.process-slide');
    const dots = document.querySelectorAll('.progress-dot');
    
    // Mobile check function
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    if (processSection && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let isAnimating = false;
        let lastWheelTime = 0;
        const wheelCooldown = 100;
        let isLocked = false; // Track if we're locked in the section
        
        function updateSlides(newIndex, direction) {
            if (newIndex < 0 || newIndex >= totalSlides || newIndex === currentSlide || isAnimating) return;
            
            isAnimating = true;
            
            const oldSlide = slides[currentSlide];
            const newSlide = slides[newIndex];
            
            oldSlide.classList.remove('active');
            
            if (direction === 'down') {
                oldSlide.classList.add('exit-left');
                
                setTimeout(() => {
                    oldSlide.classList.remove('exit-left');
                    newSlide.classList.add('active');
                }, 50);
            } else {
                newSlide.style.transform = 'translate(-50%, -50%) translateX(-100%)';
                newSlide.style.opacity = '0';
                
                void newSlide.offsetWidth;
                
                newSlide.classList.add('active');
                newSlide.style.transform = '';
                newSlide.style.opacity = '';
            }
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === newIndex);
            });
            
            currentSlide = newIndex;
            
            setTimeout(() => {
                isAnimating = false;
            }, 700);
        }
        
        function isInStickyZone() {
            // Skip on mobile - use CSS native scroll instead
            if (isMobile()) return false;
            
            const rect = processSection.getBoundingClientRect();
            return rect.top <= 50 && rect.bottom > window.innerHeight - 50;
        }
        
        function handleWheel(e) {
            // Skip entirely on mobile
            if (isMobile()) return;
            
            if (!isInStickyZone()) {
                isLocked = false;
                return;
            }
            
            // Throttle wheel events
            const now = Date.now();
            if (now - lastWheelTime < wheelCooldown) {
                e.preventDefault();
                return;
            }
            lastWheelTime = now;
            
            // If animating, block all scroll
            if (isAnimating) {
                e.preventDefault();
                return;
            }
            
            const direction = e.deltaY > 0 ? 'down' : 'up';
            
            // SCROLL DOWN
            if (direction === 'down') {
                if (currentSlide < totalSlides - 1) {
                    e.preventDefault();
                    isLocked = true;
                    updateSlides(currentSlide + 1, 'down');
                } else {
                    // At last slide - allow normal scroll
                    isLocked = false;
                }
            }
            // SCROLL UP
            else {
                if (currentSlide > 0) {
                    e.preventDefault();
                    isLocked = true;
                    updateSlides(currentSlide - 1, 'up');
                } else {
                    // At first slide - allow normal scroll up
                    isLocked = false;
                }
            }
        }
        
        window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        
        // Block scroll with keys when in section (desktop only)
        window.addEventListener('keydown', (e) => {
            if (isMobile()) return;
            if (!isInStickyZone()) return;
            
            const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'];
            if (scrollKeys.includes(e.code)) {
                if (isAnimating) {
                    e.preventDefault();
                    return;
                }
                
                const direction = ['ArrowDown', 'PageDown', 'Space'].includes(e.code) ? 'down' : 'up';
                
                if (direction === 'down' && currentSlide < totalSlides - 1) {
                    e.preventDefault();
                    updateSlides(currentSlide + 1, 'down');
                } else if (direction === 'up' && currentSlide > 0) {
                    e.preventDefault();
                    updateSlides(currentSlide - 1, 'up');
                }
            }
        });
        
        // Touch support - only for desktop touch devices, not mobile
        let touchStartY = 0;
        let isTouching = false;
        
        processSection.addEventListener('touchstart', (e) => {
            if (isMobile()) return; // Let CSS handle mobile
            touchStartY = e.touches[0].clientY;
            isTouching = true;
        }, { passive: true });
        
        processSection.addEventListener('touchmove', (e) => {
            if (isMobile()) return; // Let CSS handle mobile
            if (!isInStickyZone() || !isTouching || isAnimating) {
                return;
            }
            
            const touchCurrentY = e.touches[0].clientY;
            const diff = touchStartY - touchCurrentY;
            
            if (Math.abs(diff) > 30) {
                const direction = diff > 0 ? 'down' : 'up';
                
                if (direction === 'down' && currentSlide < totalSlides - 1) {
                    e.preventDefault();
                    updateSlides(currentSlide + 1, 'down');
                    isTouching = false;
                } else if (direction === 'up' && currentSlide > 0) {
                    e.preventDefault();
                    updateSlides(currentSlide - 1, 'up');
                    isTouching = false;
                }
            }
        }, { passive: false });
        
        processSection.addEventListener('touchend', () => {
            isTouching = false;
        }, { passive: true });
        
        // Click on dots to navigate (desktop only)
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (isMobile()) return;
                if (isAnimating) return;
                const direction = index > currentSlide ? 'down' : 'up';
                updateSlides(index, direction);
            });
        });
        
        // Initial state - always start at first slide (desktop only)
        function initDesktopSlides() {
            if (!isMobile()) {
                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                slides[0].classList.add('active');
                dots[0].classList.add('active');
                currentSlide = 0;
            }
        }
        
        initDesktopSlides();
        
        // Re-init on resize
        window.addEventListener('resize', () => {
            if (!isMobile()) {
                initDesktopSlides();
            }
        });
    }

    // ==========================================
    // 3. SMOOTH SCROLL FOR CALENDAR
    // ==========================================
    const calendarSection = document.querySelector('.calendar-section');
    
    if (window.location.hash === '#calendar' && calendarSection) {
        setTimeout(() => {
            calendarSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }

    // Handle click on process CTA
    const processCta = document.querySelector('.process-cta');
    if (processCta) {
        processCta.addEventListener('click', (e) => {
            e.preventDefault();
            if (calendarSection) {
                calendarSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // ==========================================
    // 4. FEATURE BADGES ANIMATION
    // ==========================================
    const featureBadges = document.querySelectorAll('.feature-badge');
    
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.3 });

    featureBadges.forEach(badge => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px)';
        badge.style.transition = 'all 0.5s ease';
        badgeObserver.observe(badge);
    });

    // ==========================================
    // 5. TRACK PAGE VIEW
    // ==========================================
    console.log('📅 Booking page loaded');

});