/**
 * RIO WIND TURBINE - Interactive Scripts
 * Scroll-Driven Video Hero with GSAP ScrollTrigger
 * Premium Apple-Style Interaction
 */

(function () {
    'use strict';

    // ===================================
    // CONFIGURATION
    // ===================================
    const CONFIG = {
        whatsappNumber: '919137328333', // Replace with actual number
        scrollThreshold: 100,
        isMobile: window.innerWidth <= 768 || 'ontouchstart' in window
    };

    // ===================================
    // DOM ELEMENTS
    // ===================================
    const elements = {
        navbar: document.getElementById('navbar'),
        navToggle: document.getElementById('navToggle'),
        navMenu: document.getElementById('navMenu'),
        heroWrapper: document.getElementById('heroWrapper'),
        hero: document.getElementById('hero'),
        heroVideo: document.getElementById('heroVideo'),
        heroPoster: document.getElementById('heroPoster'),
        heroContent: document.getElementById('heroContent'),
        windParticles: document.getElementById('windParticles'),
        scrollIndicator: document.getElementById('scrollIndicator'),
        contactForm: document.getElementById('contactForm'),
        newsletterForm: document.getElementById('newsletterForm'),
        productModal: document.getElementById('productModal'),
        modalBody: document.getElementById('modalBody')
    };

    // ===================================
    // SCROLL-DRIVEN FRAME SEQUENCE (GSAP ScrollTrigger)
    // Apple-Style Image Sequence Animation
    // ===================================
    function initScrollDrivenVideo() {
        const canvas = document.getElementById('heroCanvas');
        const context = canvas ? canvas.getContext('2d') : null;
        const heroWrapper = elements.heroWrapper;
        const hero = elements.hero;
        const loader = document.getElementById('heroLoader');
        const progressSpan = document.getElementById('loadProgress');

        if (!canvas || !context || !heroWrapper || !hero) {
            console.warn('Hero canvas elements not found');
            return;
        }

        // Configuration
        const frameCount = 76; // Total frames from user's folder
        const images = [];
        const frameState = { current: 0 };
        let canvasInitialized = false;

        // Render first frame immediately
        const initCanvas = () => {
            if (canvasInitialized) return;

            try {

                // Verify if first frame is actually ready
                if (!images[0] || !images[0].complete) {
                    setTimeout(initCanvas, 100);
                    return;
                }

                // Draw it immediately
                renderFrame(0);
                console.log('Frame 0 rendered, preparing canvas reveal');

                // Delay reveal to ensure the browser has actually painted the frame
                setTimeout(() => {
                    gsap.to(canvas, {
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        onStart: () => {
                            console.log('Starting interactive canvas fade-in');
                        },
                        onComplete: () => {
                            console.log('Canvas fully visible, hiding fallback video');
                            // Only now fade the video
                            if (elements.heroVideo) {
                                gsap.to(elements.heroVideo, {
                                    opacity: 0,
                                    duration: 1,
                                    onComplete: () => {
                                        elements.heroVideo.style.display = 'none';
                                    }
                                });
                            }
                        }
                    });
                }, 300);

                canvasInitialized = true;
            } catch (err) {
                console.error('initCanvas failed:', err);
            }
        };

        // Set canvas dimensions
        canvas.width = 1920;
        canvas.height = 1080;

        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Start loading
        let loadedCount = 0;

        const preloadImages = () => {
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, '0');
                const src = `frames/ezgif-frame-${frameNumber}.webp`;

                img.src = src;

                img.onload = () => {
                    loadedCount++;
                    if (progressSpan) {
                        progressSpan.innerText = Math.round((loadedCount / frameCount) * 100);
                    }

                    // Wait for more frames on mobile for smoother start
                    const requiredFrames = CONFIG.isMobile ? 15 : 5;

                    if (images[0] && images[0].complete && loadedCount >= requiredFrames && !canvasInitialized) {
                        initCanvas();
                    }

                    if (loadedCount === frameCount) {
                        // All loaded
                        if (loader) {
                            loader.classList.add('hidden');
                            setTimeout(() => loader.remove(), 500);
                        }
                        initScrollTrigger();
                    }
                };

                img.onerror = () => {
                    console.warn(`Failed to load frame ${i}`);
                    loadedCount++; // Count as loaded to prevent hanging
                };

                images.push(img);
            }
        };

        // Render specific frame
        const renderFrame = (index) => {
            if (!images[index] || !images[index].complete) {
                // If frame not ready, don't clear or draw nothing
                return;
            }

            try {
                // Draw image to cover canvas (like object-fit: cover)
                const hRatio = canvas.width / images[index].width;
                const vRatio = canvas.height / images[index].height;
                const ratio = Math.max(hRatio, vRatio);

                const centerShift_x = (canvas.width - images[index].width * ratio) / 2;
                const centerShift_y = (canvas.height - images[index].height * ratio) / 2;

                // Clean frame rendering
                context.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the actual image
                context.drawImage(
                    images[index],
                    0, 0, images[index].width, images[index].height,
                    centerShift_x, centerShift_y, images[index].width * ratio, images[index].height * ratio
                );
            } catch (err) {
                console.error('Error drawing frame:', err);
            }
        };

        // Initialize ScrollTrigger
        const initScrollTrigger = () => {
            console.log('Initializing ScrollTrigger for Hero');
            // Pin and animate frames
            gsap.to(frameState, {
                current: frameCount - 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroWrapper,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0,
                    pin: hero,
                    pinSpacing: false,
                    onUpdate: () => {
                        const frameIndex = Math.round(frameState.current);
                        renderFrame(frameIndex);
                    }
                }
            });

            // Content fade
            gsap.to(elements.heroContent, {
                scrollTrigger: {
                    trigger: heroWrapper,
                    start: 'top top',
                    end: '50% top',
                    scrub: true
                },
                opacity: 0,
                y: -50,
                scale: 0.95
            });
        };

        // Start loading
        preloadImages();
    }

    // ===================================
    // WIND PARTICLES GENERATION
    // ===================================
    function initWindParticles() {
        if (!elements.windParticles || CONFIG.isMobile) return;

        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'wind-particle';

            // Random properties
            const top = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = 4 + Math.random() * 6;
            const size = 2 + Math.random() * 3;

            particle.style.cssText = `
                top: ${top}%;
                left: -10px;
                width: ${size}px;
                height: ${size}px;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            elements.windParticles.appendChild(particle);
        }
    }

    // ===================================
    // NAVBAR SCROLL EFFECT
    // ===================================
    function initNavbarScroll() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > CONFIG.scrollThreshold) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }
        });
    }

    // ===================================
    // MOBILE NAVIGATION
    // ===================================
    function initMobileNav() {
        if (!elements.navToggle || !elements.navMenu) return;

        elements.navToggle.addEventListener('click', () => {
            elements.navMenu.classList.toggle('active');
            elements.navToggle.classList.toggle('active');
        });

        // Close menu on link click
        elements.navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                elements.navMenu.classList.remove('active');
                elements.navToggle.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!elements.navMenu.contains(e.target) && !elements.navToggle.contains(e.target)) {
                elements.navMenu.classList.remove('active');
                elements.navToggle.classList.remove('active');
            }
        });
    }

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ===================================
    // SMOOTH SCROLLING
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = elements.navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===================================
    // FAQ ACCORDION
    // ===================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ===================================
    // CONTACT FORM -> WHATSAPP
    // ===================================
    function initContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name') || '';
            const phone = formData.get('phone') || '';
            const email = formData.get('email') || '';
            const city = formData.get('city') || '';
            const product = formData.get('product') || '';
            const message = formData.get('message') || '';

            // Construct WhatsApp message
            let whatsappMessage = `Hello Rio Wind Turbine Team,\n\n`;
            whatsappMessage += `*New Inquiry*\n`;
            whatsappMessage += `━━━━━━━━━━━━━━\n`;
            whatsappMessage += `*Name:* ${name}\n`;
            whatsappMessage += `*Phone:* ${phone}\n`;
            if (email) whatsappMessage += `*Email:* ${email}\n`;
            whatsappMessage += `*City:* ${city}\n`;
            if (product) whatsappMessage += `*Interested In:* ${product}\n`;
            if (message) whatsappMessage += `\n*Message:*\n${message}\n`;
            whatsappMessage += `\nPlease contact me regarding wind energy systems.`;

            // Encode and open WhatsApp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
        });
    }

    // ===================================
    // NEWSLETTER FORM
    // ===================================
    function initNewsletter() {
        if (!elements.newsletterForm) return;

        elements.newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // For now, open WhatsApp with subscription message
            const message = `Hello, I would like to subscribe to the Rio Wind Turbine newsletter.\n\nEmail: ${email}`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
            this.reset();
        });
    }

    // ===================================
    // PRODUCT MODAL
    // ===================================
    const productData = {
        breeze: {
            name: 'Rio Breeze',
            capacity: '0.3kW System',
            description: 'Perfect for small homes and apartments with low energy needs.',
            specs: [
                { label: 'Rated Power', value: '300W' },
                { label: 'Max Power', value: '350W' },
                { label: 'Start Wind Speed', value: '2.5 m/s' },
                { label: 'Rated Wind Speed', value: '11 m/s' },
                { label: 'Rotor Diameter', value: '1.2m' },
                { label: 'Noise Level', value: '< 35dB' }
            ],
            applications: ['Small apartments', 'Rooftop installations', 'Battery charging'],
            benefits: ['Ultra-quiet operation', 'Compact and lightweight', 'Easy DIY installation']
        },
        storm: {
            name: 'Rio Storm',
            capacity: '1kW System',
            description: 'Our most popular system for homes, farms, and small businesses.',
            specs: [
                { label: 'Rated Power', value: '1000W' },
                { label: 'Max Power', value: '1200W' },
                { label: 'Start Wind Speed', value: '2.0 m/s' },
                { label: 'Rated Wind Speed', value: '10 m/s' },
                { label: 'Rotor Diameter', value: '2.0m' },
                { label: 'Controller', value: 'Smart MPPT' }
            ],
            applications: ['Family homes', 'Small farms', 'Hybrid solar systems'],
            benefits: ['Smart MPPT controller', 'Starts in low winds', 'Hybrid compatible']
        },
        titan: {
            name: 'Rio Titan',
            capacity: '3kW System',
            description: 'High-power system for schools, large farms, and commercial use.',
            specs: [
                { label: 'Rated Power', value: '3000W' },
                { label: 'Max Power', value: '3500W' },
                { label: 'Start Wind Speed', value: '2.5 m/s' },
                { label: 'Rated Wind Speed', value: '11 m/s' },
                { label: 'Rotor Diameter', value: '3.2m' },
                { label: 'Controller', value: 'Advanced MPPT' }
            ],
            applications: ['Schools', 'Large farms', 'Commercial buildings'],
            benefits: ['Industrial grade', 'Grid-tie capable', 'Advanced monitoring']
        }
    };

    window.openProductModal = function (productKey) {
        const product = productData[productKey];
        if (!product || !elements.productModal || !elements.modalBody) return;

        const specsHTML = product.specs.map(spec => `
            <tr>
                <td>${spec.label}</td>
                <td><strong>${spec.value}</strong></td>
            </tr>
        `).join('');

        const applicationsHTML = product.applications.map(app => `<li>${app}</li>`).join('');
        const benefitsHTML = product.benefits.map(benefit => `<li>${benefit}</li>`).join('');

        elements.modalBody.innerHTML = `
            <h2>${product.name}</h2>
            <p class="modal-capacity">${product.capacity}</p>
            <p class="modal-description">${product.description}</p>
            
            <h3>Technical Specifications</h3>
            <table class="modal-specs-table">
                <tbody>${specsHTML}</tbody>
            </table>
            
            <div class="modal-columns">
                <div class="modal-column">
                    <h3>Applications</h3>
                    <ul>${applicationsHTML}</ul>
                </div>
                <div class="modal-column">
                    <h3>Benefits</h3>
                    <ul>${benefitsHTML}</ul>
                </div>
            </div>
            
            <div class="modal-cta">
                <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20${encodeURIComponent(product.capacity)}.%20Please%20share%20more%20details." 
                   class="btn btn-primary btn-large" target="_blank">
                   Request Quote on WhatsApp
                </a>
            </div>
        `;

        elements.productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function initProductModal() {
        if (!elements.productModal) return;

        const overlay = elements.productModal.querySelector('.modal-overlay');
        const closeBtn = elements.productModal.querySelector('.modal-close');

        if (overlay) overlay.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.productModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function closeModal() {
        elements.productModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===================================
    // INITIALIZATION
    // ===================================
    function init() {
        initScrollDrivenVideo();
        initWindParticles();
        initNavbarScroll();
        initMobileNav();
        initScrollAnimations();
        initSmoothScroll();
        initFAQ();
        initContactForm();
        initNewsletter();
        initProductModal();

        console.log('Rio Wind Turbine website initialized with scroll-driven video');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
