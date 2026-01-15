// ==========================================
// DYNAWORKS - MAIN SCRIPT
// Version: 2.0 - Chat widget moved to js/chat-widget.js
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ATHENS TIME CLOCK
    // ==========================================
    const timeDisplay = document.getElementById('athens-time');
    const mobileTimeDisplay = document.getElementById('athens-time-mobile');

    function updateTime() {
        const now = new Date();
        const options = { 
            timeZone: 'Europe/Athens', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        };
        try {
            const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
            
            if (timeDisplay) {
                timeDisplay.textContent = `${timeString} ATH`;
            }

            if (mobileTimeDisplay) {
                mobileTimeDisplay.textContent = `ATHENS ${timeString}`;
            }
        } catch (e) {
            console.log('Time format error', e);
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    // ==========================================
    // 2. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ==========================================
    // 3. SMOOTH SCROLL FOR ANCHORS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 4. HERO PARALLAX EFFECT
    // ==========================================
    const heroSection = document.querySelector('.hero-section');
    const heroText = document.querySelector('.hero-text');

    if (heroSection && heroText) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            heroText.style.transform = `translate(${x}px, ${y}px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroText.style.transform = 'translate(0px, 0px)';
        });
    }

    // ==========================================
    // 5. GRID ITEMS HOVER EFFECT
    // ==========================================
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ==========================================
    // 6. INTERSECTION OBSERVER (ANIMATIONS)
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.grid-item, .service-card, .section-header, .location-info'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ==========================================
    // 7. STATS COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                hasAnimatedStats = true;
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const hasPercent = text.includes('%');
                    const hasPlus = text.includes('+');
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    
                    if (!isNaN(number)) {
                        animateCounter(stat, number, hasPercent, hasPlus);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);

    function animateCounter(element, target, hasPercent, hasPlus) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (hasPercent) displayValue += '%';
            if (hasPlus) displayValue += '+';
            if (element.textContent.includes('/')) displayValue = '24/7';
            
            element.textContent = displayValue;
        }, 30);
    }

    // ==========================================
    // 8. MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerRight = document.querySelector('.header-right');
    const body = document.body;

    if (mobileMenuToggle && headerRight) {
        mobileMenuToggle.addEventListener('click', () => {
            headerRight.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            if (headerRight.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        headerRight.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                headerRight.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 9. CURSOR FOLLOW EFFECT (DESKTOP)
    // ==========================================
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .grid-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('expanded');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('expanded');
            });
        });
    }

    // ==========================================
    // 10. LAZY LOAD IMAGES
    // ==========================================
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }

    // ==========================================
    // 11. FLOATING BOOK BUTTON (SCROLL REVEAL)
    // ==========================================
    const floatingChatBtn = document.querySelector('.floating-chat-btn');

    if (floatingChatBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                floatingChatBtn.classList.add('visible');
            } else {
                floatingChatBtn.classList.remove('visible');
            }
        });

        floatingChatBtn.addEventListener('click', () => {
            window.location.href = 'booking.html';
        });
    }

    // ==========================================
    // 12. GDPR COOKIE CONSENT & ANALYTICS
    // ==========================================
    const GA_MEASUREMENT_ID = 'G-BXW736ZBV1'; 

    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    function loadGoogleAnalytics() {
        if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
            console.warn('Google Analytics ID missing or placeholder');
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
        
        console.log('📊 Google Analytics Loaded');
    }

    const savedConsent = localStorage.getItem('cookieConsent');

    if (savedConsent === 'accepted') {
        loadGoogleAnalytics();
    } else if (savedConsent === 'rejected') {
        // Do nothing
    } else {
        setTimeout(() => {
            if(cookieBanner) cookieBanner.classList.add('show');
        }, 1500);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            if(cookieBanner) cookieBanner.classList.remove('show');
            loadGoogleAnalytics();
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected');
            if(cookieBanner) cookieBanner.classList.remove('show');
        });
    }

    // ==========================================
    // 13. CONSOLE EASTER EGG
    // ==========================================
    console.log('%c🚀 DynaWorks', 'font-size: 24px; font-weight: bold; color: #ff6b35;');
    console.log('%cReady to automate? info@dynaworks.gr', 'font-size: 14px; color: #2d2d2d;');

});

// ==========================================
// 14. PREVENT LAYOUT SHIFT (LOADED CLASS)
// ==========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});