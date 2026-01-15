// ==========================================
// SERVICES PAGE SPECIFIC JAVASCRIPT
// Handles time clock, navigation pills, and animations
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
    // 2. NAV PILLS SMOOTH SCROLL & ACTIVE STATE
    // ==========================================
    const navPills = document.querySelectorAll('.nav-pill');
    const serviceSections = document.querySelectorAll('.service-section');
    const headerHeight = 80;

    navPills.forEach(pill => {
        pill.addEventListener('click', function(e) {
            e.preventDefault();
            
            navPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer to update active state on scroll
    const observerOptions = {
        rootMargin: `-20% 0px -60% 0px`, // Detect when 20% of section is visible
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                
                navPills.forEach(pill => {
                    if (pill.getAttribute('href') === `#${targetId}`) {
                        navPills.forEach(p => p.classList.remove('active'));
                        pill.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    serviceSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================
    // 3. SCROLL REVEAL ANIMATIONS (Reusing logic from script.js)
    // ==========================================
    const animatedElements = document.querySelectorAll(
        '.service-section h2, .service-section .service-subtitle, .service-section .service-description-long, .service-section .service-list, .service-section .visual-placeholder, .service-section .service-number'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
    
    console.log('✨ Services page loaded and ready for action!');
});