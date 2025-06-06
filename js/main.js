// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const desktopToggle = document.querySelector('#theme-switch');
    const mobileToggle = document.querySelector('#theme-switch-mobile');

    // Navigation elements
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial-item');
    const currentYearEl = document.getElementById('current-year');
    const blobs = document.querySelectorAll('.blob');
    const blobOutlines = document.querySelectorAll('.blob-outline');
    const heroSection = document.querySelector('.hero');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const portfolioSection = document.getElementById('work');
    const portfolioContainer = document.querySelector('.portfolio-container');
    const portfolioPanels = document.querySelectorAll('.portfolio-panel');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const langSwitch = document.querySelector('.lang-switch');

    // Hero section optimization
    function optimizeHeroForMobile() {
        // Check if we're on mobile and in portrait mode
        const isMobile = window.innerWidth <= 768;
        const isPortrait = window.innerHeight > window.innerWidth;

        if (isMobile && isPortrait) {
            // Apply optimizations for mobile portrait mode

            // Remove all animations from background blobs only
            blobs.forEach(blob => {
                blob.style.willChange = 'auto'; // Remove will-change to reduce GPU usage
                blob.style.transition = 'none'; // Remove transitions
            });

            // Keep the blob image container animations intact as requested
            // No modifications to the blob-image-container

            // Remove event listeners that might be causing performance issues
            if (heroSection) {
                heroSection.removeEventListener('mousemove', heroSection._parallaxHandler);
            }
        }
    }

    // Run optimization on page load
    optimizeHeroForMobile();

    // Re-run optimization when orientation changes
    window.addEventListener('orientationchange', function () {
        setTimeout(optimizeHeroForMobile, 300);
    });

    // Re-run optimization on resize as well
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(optimizeHeroForMobile, 300);
    });

    // Initialize language from localStorage or default
    if (typeof updatePageDirection === 'function' && typeof updatePageContent === 'function') {
        updatePageDirection();
        updatePageContent();
    }

    // Lightbox elements
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-image') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    const lightboxCounter = lightbox ? lightbox.querySelector('.lightbox-counter') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    
    let currentPortfolioPanel = null;
    let currentImages = [];
    let currentIndex = 0;

    // Update current year in footer
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Function to hide the theme overlay
    function hideThemeOverlay() {
        const overlay = document.querySelector('.theme-transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        // Go to top section to show the effects properly, but only if not already there
        if (window.currentSectionIndex !== 0) { // Only scroll if not already at hero section (index 0)
            const upIndicator = document.querySelector('.up-indicator');
            if (upIndicator) {
                upIndicator.click();
            } else {
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        }
    }

    // Dark Mode Toggle
    function handleThemeToggle() {
        // Show the transition overlay
        const overlay = document.querySelector('.theme-transition-overlay');
        overlay.classList.add('active');

        // Failsafe - force hide overlay after 2 seconds no matter what
        const failsafeTimer = setTimeout(() => {
            hideThemeOverlay();
        }, 1000);

        setTimeout(() => {
            document.body.classList.toggle('dark-mode');

            // Save preference to local storage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                desktopToggle.checked = false;
                mobileToggle.checked = false;

                // Update vanta effect if it exists
                if (window.vantaEffect) {
                    window.vantaEffect.setOptions({
                        highlightColor: 0x3311bb,
                        midtoneColor: 0x1a1a2a,
                        lowlightColor: 0x0,
                        baseColor: 0x0
                    });
                }

                // Update portfolio vanta effect if it exists
                if (window.portfolioVantaEffect) {
                    window.portfolioVantaEffect.setOptions({
                        highlightColor: 0x6c63ff, // Bright purple
                        midtoneColor: 0x412fb3,   // Medium purple
                        lowlightColor: 0x28176a,  // Dark purple
                        baseColor: 0x0d0526       // Very dark purple/blue
                    });
                }
            } else {
                localStorage.setItem('theme', 'light');
                desktopToggle.checked = true;
                mobileToggle.checked = true;

                // Update vanta effect if it exists
                if (window.vantaEffect) {
                    window.vantaEffect.setOptions({
                        highlightColor: 0x6c63ff,
                        midtoneColor: 0xffffff,
                        lowlightColor: 0xfafafa,
                        baseColor: 0xf5f5f5
                    });
                }

                // Update portfolio vanta effect if it exists
                if (window.portfolioVantaEffect) {
                    window.portfolioVantaEffect.setOptions({
                        highlightColor: 0x6c63ff, // Keep same highlight color
                        midtoneColor: 0xc4c0ff,   // Light purple
                        lowlightColor: 0x9990ff,  // Medium-light purple
                        baseColor: 0xf0f0ff       // Very light purple/blue
                    });
                }
            }

            // Hide the overlay after a short delay
            setTimeout(() => {
                clearTimeout(failsafeTimer); // Clear failsafe timer
                hideThemeOverlay();
            }, 1000); // Changed from 1500 to 1000 to total 2 seconds
        }, 1000); // Changed from 800 to 1000 to total 2 seconds
    }

    // Add event listeners to both toggle switches
    desktopToggle.addEventListener('change', handleThemeToggle);
    mobileToggle.addEventListener('change', handleThemeToggle);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        desktopToggle.checked = true;
        mobileToggle.checked = true;
    } else {
        // Default to dark mode
        document.body.classList.add('dark-mode');
        desktopToggle.checked = false;
        mobileToggle.checked = false;
        localStorage.setItem('theme', 'dark');
    }

    // Initialize Vantajs fog effect in testimonials section
    if (typeof VANTA !== 'undefined') {
        window.vantaEffect = VANTA.FOG({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: document.body.classList.contains('dark-mode') ? 0x3311bb : 0x6c63ff,
            midtoneColor: document.body.classList.contains('dark-mode') ? 0x1a1a2a : 0xffffff,
            lowlightColor: document.body.classList.contains('dark-mode') ? 0x0 : 0xfafafa,
            baseColor: document.body.classList.contains('dark-mode') ? 0x0 : 0xf5f5f5,
            blurFactor: 0.50,
            speed: 0.70,
            zoom: 0.50
        });
    }

    // Initialize Vantajs fog effect for the portfolio section
    if (typeof VANTA !== 'undefined' && document.getElementById('portfolio-vanta-bg')) {
        // Determine initial mode from saved theme or body class
        const isDarkMode = document.body.classList.contains('dark-mode');

        // Define color schemes for dark and light modes
        const colorSchemes = {
            dark: {
                highlightColor: 0x6c63ff, // Bright purple
                midtoneColor: 0x412fb3,   // Medium purple
                lowlightColor: 0x28176a,  // Dark purple
                baseColor: 0x0d0526       // Very dark purple/blue
            },
            light: {
                highlightColor: 0x6c63ff, // Keep same highlight color
                midtoneColor: 0xc4c0ff,   // Light purple
                lowlightColor: 0x9990ff,  // Medium-light purple
                baseColor: 0xf0f0ff       // Very light purple/blue
            }
        };

        // Get the appropriate color scheme based on current mode
        const initialColors = isDarkMode ? colorSchemes.dark : colorSchemes.light;

        // Detect if we're on mobile
        const isMobile = window.innerWidth < 768;
        const isPortrait = window.innerHeight > window.innerWidth;

        // Function to detect low-end devices based on hardware
        function detectLowEndDevice() {
            // Check for user agent indicators of low-end devices
            const userAgent = navigator.userAgent.toLowerCase();

            // Check for hardware concurrency (CPU cores)
            const cpuCores = navigator.hardwareConcurrency || 4;
            const isLowCPU = cpuCores <= 4;

            // Check if device has poor memory
            const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

            // Check if device has poor performance based on timing
            const perfCheck = performance.now();
            let sum = 0;
            for (let i = 0; i < 10000; i++) {
                sum += Math.sqrt(i);
            }
            const perfDuration = performance.now() - perfCheck;
            const slowPerformance = perfDuration > 20; // If processing took more than 20ms

            // Check for mobile + portrait as additional indicator
            const isCriticalViewport = isMobile && isPortrait;

            // Combine factors - device is considered low-end if it meets multiple criteria
            const scoreThreshold = 2;
            const totalScore = (isLowCPU ? 1 : 0) +
                (isLowMemory ? 1 : 0) +
                (slowPerformance ? 1 : 0) +
                (isCriticalViewport ? 1 : 0);

            return totalScore >= scoreThreshold;
        }

        // Check if we're on a low-end device
        const isLowEndDevice = detectLowEndDevice();

        // Create placeholder gradient for extremely low-end devices
        if (isLowEndDevice && isPortrait) {
            // Get the container element
            const container = document.getElementById('portfolio-vanta-bg');

            // Remove any existing content
            container.innerHTML = '';

            // Add a simple CSS gradient background instead of WebGL
            container.style.background = 'linear-gradient(135deg, #5c53d5 0%, #3f2fb3 50%, #28176a 100%)';
            container.style.opacity = '0.7';

            // Add subtle animation with CSS
            container.style.animation = 'pulse 8s ease-in-out infinite alternate';

            // Add a style tag with the animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { background-position: 0% 50%; opacity: 0.6; }
                    50% { background-position: 100% 50%; opacity: 0.8; }
                    100% { background-position: 0% 50%; opacity: 0.6; }
                }
            `;
            document.head.appendChild(style);

            // Set gradient size
            container.style.backgroundSize = '200% 200%';

            // Skip Vanta initialization on extremely low-end devices
            return;
        }

        // Aggressive mobile optimization settings
        const mobileOptimization = {
            zoom: isMobile ? (isPortrait ? 0.3 : 0.35) : 0.45,
            scaleMobile: isMobile ? 0.25 : 0.4,
            speed: isMobile ? (isPortrait ? 0.2 : 0.3) : 0.5,
            blurFactor: isMobile ? (isPortrait ? 0.1 : 0.2) : 0.3,
            mouseControls: !isMobile,
            touchControls: !isPortrait, // Disable touch controls in portrait for better performance
            gyroControls: false,
            minHeight: isMobile ? 80.00 : 180.00,
            minWidth: isMobile ? 80.00 : 180.00,
            quality: isMobile ? (isPortrait ? 'low' : 'low') : 'medium',
            gpuAcceleration: true,
            // Drastically reduce particle count on mobile
            points: isMobile ? (isPortrait ? 4 : 6) : 12,
            maxDistance: isMobile ? (isPortrait ? 10 : 12) : 15,
            spacing: isMobile ? (isPortrait ? 18 : 16) : 14,
            // Lower framerate across all mobile devices
            frameRate: isMobile ? 25 : 45,
            lazyLoading: true,
            loadTimeout: isMobile ? 3000 : 1500,
            visibilityThreshold: 0.5
        };

        // Initialize Intersection Observer for lazy loading
        const vantaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !window.portfolioVantaEffect) {
                    window.portfolioVantaEffect = VANTA.FOG({
                        el: "#portfolio-vanta-bg",
                        mouseControls: mobileOptimization.mouseControls,
                        touchControls: mobileOptimization.touchControls,
                        gyroControls: mobileOptimization.gyroControls,
                        minHeight: mobileOptimization.minHeight,
                        minWidth: mobileOptimization.minWidth,
                        highlightColor: initialColors.highlightColor,
                        midtoneColor: initialColors.midtoneColor,
                        lowlightColor: initialColors.lowlightColor,
                        baseColor: initialColors.baseColor,
                        blurFactor: mobileOptimization.blurFactor,
                        speed: mobileOptimization.speed,
                        zoom: mobileOptimization.zoom,
                        scaleMobile: mobileOptimization.scaleMobile,
                        quality: mobileOptimization.quality,
                        gpuAcceleration: mobileOptimization.gpuAcceleration,
                        points: mobileOptimization.points,
                        maxDistance: mobileOptimization.maxDistance,
                        spacing: mobileOptimization.spacing,
                        lazyLoading: true,
                        resolutionScale: isMobile ? 0.5 : 1,
                        antialias: !isMobile,
                        powerPreference: isMobile ? 'low-power' : 'high-performance',
                        preserveDrawingBuffer: false,
                        alpha: true,
                        premultipliedAlpha: true,
                        stencil: false,
                        depth: false,
                        logarithmicDepthBuffer: false
                    });
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px 200px 0px'
        });

        // Observe the Vanta container
        const vantaContainer = document.getElementById('portfolio-vanta-bg');
        if (vantaContainer) {
            vantaObserver.observe(vantaContainer);
        }

        // Create a flag to track if we're currently in a performance-intensive context
        let isInHighPerformanceContext = false;
        let animationFrameId = null;

        // Function to throttle animations in performance-intensive scenarios
        const throttleAnimations = () => {
            if (isInHighPerformanceContext && window.portfolioVantaEffect) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }

                // Reduce animation frame rate for smoother scrolling
                window.portfolioVantaEffect.frameCount = 0;
                window.portfolioVantaEffect.renderer.setAnimationLoop(null);

                // Create a custom animation loop with reduced framerate
                let lastFrame = 0;
                const frameInterval = 1000 / mobileOptimization.frameRate;

                const customLoop = (timestamp) => {
                    animationFrameId = requestAnimationFrame(customLoop);

                    if (timestamp - lastFrame >= frameInterval) {
                        if (window.portfolioVantaEffect && window.portfolioVantaEffect.renderer) {
                            window.portfolioVantaEffect.onUpdate();
                            lastFrame = timestamp;
                        }
                    }
                };

                animationFrameId = requestAnimationFrame(customLoop);
            } else if (window.portfolioVantaEffect && window.portfolioVantaEffect.renderer) {
                // Restore normal animation loop
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }

                window.portfolioVantaEffect.setOptions({
                    frameRate: 60
                });
            }
        };

        // More aggressive optimization: completely pause animation on mobile during scroll
        const completelyPauseAnimation = () => {
            if (window.portfolioVantaEffect && window.portfolioVantaEffect.renderer) {
                // Stop all animation
                window.portfolioVantaEffect.renderer.setAnimationLoop(null);
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        };

        // Resume animation with appropriate settings
        const resumeAnimation = () => {
            if (window.portfolioVantaEffect && window.portfolioVantaEffect.renderer) {
                if (isMobile) {
                    // For mobile devices, use throttled animation
                    throttleAnimations();
                } else {
                    // For desktop, use normal animation loop
                    window.portfolioVantaEffect.renderer.setAnimationLoop(() => {
                        if (window.portfolioVantaEffect) {
                            window.portfolioVantaEffect.onUpdate();
                        }
                    });
                }
            }
        };

        // Handle orientation change to adjust effect settings
        window.addEventListener('orientationchange', function () {
            setTimeout(() => {
                const isPortrait = window.innerHeight > window.innerWidth;
                const isMobile = window.innerWidth < 768;

                if (window.portfolioVantaEffect) {
                    if (isPortrait && isMobile) {
                        // Most aggressive optimization for mobile portrait
                        window.portfolioVantaEffect.setOptions({
                            zoom: 0.35,
                            speed: 0.3,
                            blurFactor: 0.2,
                            quality: 'low',
                            points: 8,
                            maxDistance: 15,
                            spacing: 16,
                            touchControls: false
                        });
                    } else if (isMobile) {
                        // Landscape mobile - moderate optimization
                        window.portfolioVantaEffect.setOptions({
                            zoom: 0.4,
                            speed: 0.4,
                            blurFactor: 0.3,
                            quality: 'medium',
                            points: 10,
                            maxDistance: 18,
                            spacing: 14,
                            touchControls: true
                        });
                    } else {
                        // Desktop - full experience
                        window.portfolioVantaEffect.setOptions({
                            zoom: 0.5,
                            speed: 0.6,
                            blurFactor: 0.4,
                            quality: 'high',
                            points: 16,
                            maxDistance: 20,
                            spacing: 12,
                            touchControls: true,
                            mouseControls: true
                        });
                    }

                    // Force resize after orientation change
                    window.portfolioVantaEffect.resize();
                }
            }, 300); // Small delay to ensure the orientation change completes
        });

        // Optimize performance during scroll events
        if (portfolioContainer) {
            portfolioContainer.addEventListener('scroll', () => {
                if (!isInHighPerformanceContext) {
                    isInHighPerformanceContext = true;
                    completelyPauseAnimation();
                }

                // Reset after scrolling stops
                clearTimeout(portfolioContainer._scrollTimeout);
                portfolioContainer._scrollTimeout = setTimeout(() => {
                    isInHighPerformanceContext = false;
                    resumeAnimation();
                }, 200);
            });
        }

        // Ensure Vanta effect is optimized when window resizes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize event
            clearTimeout(resizeTimeout);

            if (!isInHighPerformanceContext && window.portfolioVantaEffect) {
                isInHighPerformanceContext = true;
                completelyPauseAnimation();
            }

            resizeTimeout = setTimeout(() => {
                if (window.portfolioVantaEffect) {
                    // Detect if we're on mobile now
                    const isMobileNow = window.innerWidth < 768;
                    const isPortrait = window.innerHeight > window.innerWidth;

                    // Update settings based on current device/orientation
                    if (isMobileNow && isPortrait) {
                        window.portfolioVantaEffect.setOptions({
                            zoom: 0.35,
                            speed: 0.3,
                            blurFactor: 0.2,
                            quality: 'low',
                            points: 8,
                            maxDistance: 15,
                            spacing: 16,
                            mouseControls: false,
                            touchControls: false
                        });
                    } else if (isMobileNow) {
                        window.portfolioVantaEffect.setOptions({
                            zoom: 0.4,
                            speed: 0.4,
                            blurFactor: 0.3,
                            quality: 'medium',
                            points: 10,
                            maxDistance: 18,
                            spacing: 14,
                            mouseControls: false,
                            touchControls: true
                        });
                    } else {
                        window.portfolioVantaEffect.setOptions({
                            zoom: 0.5,
                            speed: 0.6,
                            blurFactor: 0.4,
                            quality: 'high',
                            points: 16,
                            maxDistance: 20,
                            spacing: 12,
                            mouseControls: true,
                            touchControls: true
                        });
                    }

                    window.portfolioVantaEffect.resize();
                }

                isInHighPerformanceContext = false;
                resumeAnimation();
            }, 300);
        });

        // Add visibility change detection to pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (window.portfolioVantaEffect && window.portfolioVantaEffect.renderer) {
                if (document.hidden) {
                    // Page is hidden, completely pause the animation
                    completelyPauseAnimation();
                } else {
                    // Page is visible again, resume animation with appropriate settings
                    resumeAnimation();
                }
            }
        });
    }

    // Mobile Navigation Toggle
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Toggle scrolling on body
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';

                // Ensure proper animation based on RTL mode
                if (document.body.classList.contains('rtl')) {
                    mobileNav.style.transition = 'transform 0.4s ease';
                }
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (
                mobileNav.classList.contains('active') &&
                !mobileNav.contains(event.target) &&
                !hamburger.contains(event.target)
            ) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Make sure all portfolio items are visible by default
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        const card = item.querySelector('.material-card');
        if (card) {
            card.style.transform = 'translateY(0)';
        }
    });

    // Portfolio Filtering
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if(filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    // Show the item
                    item.style.display = 'block';
                    
                    // Add animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        const card = item.querySelector('.material-card');
                        if (card) {
                            card.style.transform = 'translateY(0)';
                        }
                    }, 10);
                } else {
                    // Hide with animation
                    item.style.opacity = '0';
                    const card = item.querySelector('.material-card');
                    if (card) {
                        card.style.transform = 'translateY(20px)';
                    }
                    
                    // Hide after animation completes
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Testimonial Slider functionality
    const quotes = document.querySelectorAll('.testimonial-quote');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;

    if (quotes.length > 0) {
        // Initial setup
        quotes.forEach((quote, i) => {
            if (i !== 0) {
                quote.classList.remove('active');
            }
        });

        // Next button
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                quotes[currentTestimonial].classList.remove('active');
                testimonialDots[currentTestimonial].classList.remove('active');

                currentTestimonial = (currentTestimonial + 1) % quotes.length;

                quotes[currentTestimonial].classList.add('active');
                testimonialDots[currentTestimonial].classList.add('active');
            });
        }

        // Previous button
        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                quotes[currentTestimonial].classList.remove('active');
                testimonialDots[currentTestimonial].classList.remove('active');

                currentTestimonial = (currentTestimonial - 1 + quotes.length) % quotes.length;

                quotes[currentTestimonial].classList.add('active');
                testimonialDots[currentTestimonial].classList.add('active');
            });
        }

        // Dot navigation
        testimonialDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                if (i !== currentTestimonial) {
                    quotes[currentTestimonial].classList.remove('active');
                    testimonialDots[currentTestimonial].classList.remove('active');

                    currentTestimonial = i;

                    quotes[currentTestimonial].classList.add('active');
                    testimonialDots[currentTestimonial].classList.add('active');
                }
            });
        });

        // Auto-rotate testimonials
        setInterval(() => {
            quotes[currentTestimonial].classList.remove('active');
            testimonialDots[currentTestimonial].classList.remove('active');

            currentTestimonial = (currentTestimonial + 1) % quotes.length;

            quotes[currentTestimonial].classList.add('active');
            testimonialDots[currentTestimonial].classList.add('active');
        }, 8000);
    }

    // Smooth scrolling for navigation links using our fullpage sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetIndex = sections.findIndex(section => section.id === targetId);

            if (targetIndex >= 0) {
                // Close mobile menu if open
                if (mobileNav.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';

                    // Small delay to ensure menu closing animation doesn't interfere
                    setTimeout(() => {
                        navigateToSection(targetIndex);
                    }, 300);
                } else {
                    // If menu not open, navigate immediately
                    navigateToSection(targetIndex);
                }
            }
        });
    });

    // Enhanced scrolling between sections
    let isScrolling = false;
    window.currentSectionIndex = 0;
    let lastScrollTime = 0;
    const scrollCooldown = 200; // Reduced cooldown for more responsive scrolling

    // Define all sections in order
    const sections = [
        {id: 'hero', element: heroSection},
        {id: 'work', element: portfolioSection},
        {id: 'skills', element: document.getElementById('skills')},
        {id: 'process', element: document.getElementById('process')},
        {id: 'testimonials', element: document.getElementById('testimonials')}
    ];

    // Get section indicator dots
    const indicatorDots = document.querySelectorAll('.section-indicator .dot');

    // Initialize sections - set first as active, position others
    const initSections = () => {
        // Set initial data-current-section attribute on body
        document.body.setAttribute('data-current-section', window.currentSectionIndex);

        sections.forEach((section, index) => {
            // Set initial positioning
            if (index === window.currentSectionIndex) {
                section.element.style.transform = 'translateY(0)';
                section.element.classList.add('active');

                // Update section indicator
                updateSectionIndicator(index);
            } else {
                section.element.style.transform = `translateY(${(index - window.currentSectionIndex) * 100}%)`;
                section.element.classList.remove('active');
            }
        });
    };

    // Function to update section indicator
    const updateSectionIndicator = (index) => {
        // Update body attribute to control section indicator visibility
        document.body.setAttribute('data-current-section', index);

        indicatorDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Add click event listeners to indicator dots
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isScrolling && window.currentSectionIndex !== index) {
                navigateToSection(index, index < window.currentSectionIndex ? 'up' : 'down');
            }
        });
    });

    // Call init on page load
    initSections();

    // Scroll indicator functionality
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function (e) {
            e.preventDefault();
            // Use new section navigation
            if (!isScrolling) {
                navigateToSection(1); // Navigate to portfolio section
            }
        });
    }

    // Function to navigate to a section
    function navigateToSection(targetIndex, direction) {
        if (targetIndex < 0 || targetIndex >= sections.length || isScrolling) return;

        isScrolling = true;

        // Get current and target section
        const currentSection = sections[window.currentSectionIndex];
        const targetSection = sections[targetIndex];

        // Determine if we're moving down or up
        const dir = direction || (targetIndex > window.currentSectionIndex ? 'down' : 'up');

        // Handle portfolio container scrolling
        if (targetIndex === 1) { // Portfolio section
            if (dir === 'down') {
                // Coming from hero, scroll to top
                portfolioContainer.scrollTop = 0;
            } else {
                // Coming from skills, scroll to bottom
                setTimeout(() => {
                    portfolioContainer.scrollTop = portfolioContainer.scrollHeight;
                }, 100);
            }
        }

        // Add entrance/exit animation classes based on direction
        if (dir === 'down') {
            currentSection.element.classList.add('fade-out');
            targetSection.element.classList.add('fade-in');
        } else {
            currentSection.element.classList.add('fade-out-up');
            targetSection.element.classList.add('fade-in-up');
        }

        // Update current section index
        window.currentSectionIndex = targetIndex;

        // Update section positions with enhanced transforms
        sections.forEach((section, i) => {
            if (i === targetIndex) {
                section.element.style.transform = 'translateY(0) rotateX(0)';
                section.element.classList.add('active');
            } else if (i < targetIndex) {
                // Sections above current (moved up)
                section.element.style.transform = `translateY(-${100 + (targetIndex - i) * 3}%) rotateX(0.8deg)`;
                section.element.style.opacity = '0';
                section.element.classList.remove('active');
            } else {
                // Sections below current (moved down)
                section.element.style.transform = `translateY(${100 + (i - targetIndex) * 3}%) rotateX(-0.8deg)`;
                section.element.style.opacity = '0';
                section.element.classList.remove('active');
            }
        });

        // Show current section
        targetSection.element.style.opacity = '1';

        // Update section indicator
        updateSectionIndicator(targetIndex);

        // Reset scrolling state and remove animation classes after animation completes
        setTimeout(() => {
            isScrolling = false;
            lastScrollTime = Date.now();

            // Remove animation classes
            sections.forEach(section => {
                section.element.classList.remove('fade-in', 'fade-out', 'fade-in-up', 'fade-out-up');
            });

            // Trigger portfolio animations if we navigated to portfolio section
            if (targetIndex === 1) {
                triggerPortfolioAnimations();
            }
        }, 700); // Faster transition time (was 1000)
    };

    // Main wheel event handler with improved logic
    const handleSectionWheel = (e) => {
        // If already in a scroll transition, don't do anything
        const now = Date.now();
        if (isScrolling || now - lastScrollTime < scrollCooldown) return;

        // Make scrolling more sensitive by using a smaller threshold
        const scrollDown = e.deltaY > 2; // Lower threshold (was implicitly checking if > 0)
        const scrollUp = e.deltaY < -2; // Add specific threshold for scrolling up

        // Special case for portfolio section to allow internal scrolling
        if (window.currentSectionIndex === 1) { // portfolio section
            // Force transition to hero section with minimal upward scroll when near the top
            if (e.deltaY < 0 && portfolioContainer.scrollTop <= 200) {
                e.preventDefault();
                navigateToSection(0); // Go to hero immediately
                return;
            } else if (e.deltaY > 0 &&
                portfolioContainer.scrollHeight - portfolioContainer.scrollTop <=
                portfolioContainer.clientHeight + 5) {
                e.preventDefault();
                navigateToSection(2); // Go to skills
                return;
            }

            // Otherwise, let portfolio handle its own scrolling
            return;
        }

        // For hero and skills sections, always prevent default behavior
        e.preventDefault();

        // Handle scrolling logic based on current section
        if (scrollDown && window.currentSectionIndex < sections.length - 1) {
            navigateToSection(window.currentSectionIndex + 1);
        } else if (scrollUp && window.currentSectionIndex > 0) {
            navigateToSection(window.currentSectionIndex - 1);
        }
    };

    // Add the event listener
    window.addEventListener('wheel', handleSectionWheel, {passive: false});

    // Add keyboard navigation for accessibility
    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;

        // Arrow keys for navigation
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (window.currentSectionIndex < sections.length - 1) {
                navigateToSection(window.currentSectionIndex + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (window.currentSectionIndex > 0) {
                navigateToSection(window.currentSectionIndex - 1);
            }
        } else if (e.key === 'Home') {
            // Add Home key to quickly go to hero section
            e.preventDefault();
            navigateToSection(0);
        } else if (e.key === 'End') {
            // Add End key to quickly go to testimonials section
            e.preventDefault();
            navigateToSection(sections.length - 1);
        } else if (e.key >= '1' && e.key <= '5') {
            // Add number keys 1-5 for direct section navigation
            e.preventDefault();
            navigateToSection(parseInt(e.key) - 1);
        }
    });

    // Update current section based on scroll position - debounced for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (isScrolling) return;

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
            const scrollY = window.scrollY;
            const positions = sections.map(section => section.element.offsetTop);

            window.currentSectionIndex = positions.findIndex(pos => scrollY >= pos - window.innerHeight / 2);
            if (window.currentSectionIndex === -1) window.currentSectionIndex = sections.length - 1;
        }, 100);
    });

    // Animate portfolio items when they enter viewport
    const animatePortfolioItems = () => {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const portfolioHeaders = document.querySelectorAll('.portfolio-header');

        // Create intersection observer for portfolio items
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const item = entry.target;

                    // Check if it's a portfolio header
                    if (item.classList.contains('portfolio-header')) {
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, 100);
                        observer.unobserve(item);
                        return;
                    }

                    // Otherwise it's a portfolio item
                    const gallery = item.closest('.portfolio-gallery');
                    if (!gallery) return;

                    // Find this item's position within its gallery
                    const galleryItems = Array.from(gallery.querySelectorAll('.portfolio-item'));
                    const itemIndex = galleryItems.indexOf(item);

                    // Add delay based on item index within its gallery
                    const delay = 100 + itemIndex * 80;
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, delay);

                    // Stop observing after animation
                    observer.unobserve(item);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10px 0px'
        });

        // Observe all portfolio items including first gallery
        portfolioItems.forEach(item => {
            observer.observe(item);
        });

        // Observe all portfolio headers
        portfolioHeaders.forEach(header => {
            observer.observe(header);
        });
    };

    // Wait for all content to load before initializing animations
    if (document.readyState === 'complete') {
        animatePortfolioItems();
        // Check if we're starting on portfolio section
        if (window.location.hash === '#work') {
            setTimeout(triggerPortfolioAnimations, 500);
        }
    } else {
        window.addEventListener('load', () => {
            setTimeout(animatePortfolioItems, 100);
            // Check if we're starting on portfolio section
            if (window.location.hash === '#work') {
                setTimeout(triggerPortfolioAnimations, 500);
            }
        });
    }

    // Also trigger animations when navigating to portfolio section
    const triggerPortfolioAnimations = () => {
        if (window.currentSectionIndex === 1) {
            document.querySelectorAll('.portfolio-panel.active .portfolio-item').forEach((item, index) => {
                if (!item.classList.contains('animate-in')) {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, 100 + index * 80);
                }
            });

            // Animate the active panel's header
            const activePanel = document.querySelector('.portfolio-panel.active');
            if (activePanel) {
                const header = activePanel.querySelector('.portfolio-header');
                if (header && !header.classList.contains('animate-in')) {
                    setTimeout(() => {
                        header.classList.add('animate-in');
                    }, 100);
                }
            }
        }
    };

    // Intersection Observer for animations - optimized to observe fewer elements at once
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.process-step, .skill-category, .portfolio-item');

        // Create a single observer for all elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px 100px 0px' // Add margin to start animations earlier
        });

        // Observe elements in chunks to improve performance
        const observeElements = (elements, batchSize = 10) => {
            for (let i = 0; i < elements.length; i += batchSize) {
                setTimeout(() => {
                    const batch = Array.from(elements).slice(i, i + batchSize);
                    batch.forEach(element => observer.observe(element));
                }, i > 0 ? 100 : 0); // Delay observation of subsequent batches
            }
        };

        observeElements(elements);
    };

    animateOnScroll();

    // Add animation classes to elements initially in viewport
    setTimeout(() => {
        document.querySelectorAll('.process-step, .skill-category, .portfolio-item').forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top >= 0 && rect.bottom <= window.innerHeight) {
                el.classList.add('animated');
            }
        });
    }, 300);

    // Add Material Design ripple effect to buttons
    const rippleButtons = document.querySelectorAll('.view-demo-btn');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.top = y + 'px';
            ripple.style.left = x + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Remove parallax effect for blobs
    if (heroSection) {
        // Remove the mousemove event listener that creates parallax effect
        window.removeEventListener('mousemove', window._heroParallaxHandler);

        // Reset any transforms on blobs that might have been applied
        blobs.forEach((blob) => {
            blob.style.transform = '';
        });

        blobOutlines.forEach((outline) => {
            // Keep only the animation transforms, not the parallax ones
            outline.style.transform = '';
        });
    }

    // Skills section setup
    const skillsSection = document.getElementById('skills');

    if (skillsSection) {
        skillsSection.style.position = 'relative';
    }

    // Add Vite-like glow effect to the skills grid - with optimized mousemove handling
    const skillItems = document.querySelectorAll('.skills-grid .skill-item');
    const skillsGrid = document.querySelector('.skills-grid');
    
    if (skillsGrid) {
        // Enhance the glow effect on item hover
        skillItems.forEach(skillItem => {
            const skillIcon = skillItem.querySelector('.skill-icon');

            skillItem.addEventListener('mouseenter', function () {
                // Apply stronger glow effect
                this.style.transform = 'translateY(-2px) scale(1.05)';
                this.style.transition = 'all 0.3s ease';
                this.style.zIndex = '10';
            });

            skillItem.addEventListener('mouseleave', function () {
                this.style.transform = '';
                this.style.zIndex = '1';
            });
        });

        // Throttle function to limit execution rate
        const throttle = (callback, delay) => {
            let lastCall = 0;
            return function (...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) {
                    return;
                }
                lastCall = now;
                return callback(...args);
            };
        };

        // Create a subtle glow effect that follows the mouse - throttled for performance
        skillsGrid.addEventListener('mousemove', throttle(function (e) {
            const rect = skillsGrid.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            skillItems.forEach(item => {
                if (item.classList.contains('empty-cell')) return;
                
                const itemRect = item.getBoundingClientRect();
                const itemX = itemRect.left + itemRect.width / 2 - rect.left;
                const itemY = itemRect.top + itemRect.height / 2 - rect.top;
                
                // Calculate distance from mouse to item center
                const distance = Math.sqrt(
                    Math.pow(x - itemX, 2) + 
                    Math.pow(y - itemY, 2)
                );
                
                // Only affect items within a certain radius
                if (distance < 150) {
                    const brightness = 1 + (1 - distance / 150) * 0.4;
                    item.style.filter = `brightness(${brightness})`;
                    
                    // Scale items closer to the mouse slightly larger
                    const scale = 1 + (1 - distance / 150) * 0.05;
                    item.style.transform = `scale(${scale})`;
                } else {
                    item.style.filter = '';
                    item.style.transform = '';
                }
            });
        }, 30)); // Throttled to run at most once every 30ms
    }

    // Portfolio scroll effects
    if (portfolioContainer && portfolioPanels.length) {
        // Add smooth scrolling to portfolio container
        portfolioContainer.style.scrollBehavior = 'smooth';

        // Set the first panel as active by default
        portfolioPanels[0].classList.add('active');

        // Update progress bar as user scrolls
        const updateProgressBar = () => {
            if (!portfolioContainer) return;

            const totalHeight = portfolioContainer.scrollHeight - portfolioContainer.clientHeight;
            const progress = (portfolioContainer.scrollTop / totalHeight) * 100;

            if (progressBar) {
                progressBar.style.height = `${progress}%`;
            }
        };

        // Handle panel activation and background color changing on scroll
        const handlePortfolioScroll = () => {
            if (!portfolioContainer) return;

            // Update progress bar
            updateProgressBar();

            // Calculate which panel is in view
            const scrollPosition = portfolioContainer.scrollTop;
            const viewportHeight = window.innerHeight;

            portfolioPanels.forEach((panel, index) => {
                const panelTop = index * viewportHeight;
                const panelBottom = panelTop + viewportHeight;

                // Check if panel is in view
                if (scrollPosition >= panelTop - viewportHeight / 3 &&
                    scrollPosition < panelBottom - viewportHeight / 3) {

                    // Activate current panel
                    panel.classList.add('active');

                    // Update Vanta background color based on panel's data-color attribute
                    const panelColor = panel.getAttribute('data-color');
                    if (panelColor && window.portfolioVantaEffect) {
                        // Convert hex to RGB for more control over the colors
                        const hexToRgb = (hex) => {
                            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                            return result ? {
                                r: parseInt(result[1], 16),
                                g: parseInt(result[2], 16),
                                b: parseInt(result[3], 16)
                            } : null;
                        };

                        const rgb = hexToRgb(panelColor);
                        if (rgb) {
                            const isDarkMode = document.body.classList.contains('dark-mode');
                            // Create variations for different fog colors
                            const highlight = parseInt(panelColor.replace('#', '0x'));

                            // Different color processing based on theme mode
                            let midtone, lowlight, base;

                            if (isDarkMode) {
                                // Dark mode - darker variations with more saturation
                                midtone = parseInt(
                                    `0x${Math.floor(rgb.r * 0.7).toString(16).padStart(2, '0')}${Math.floor(rgb.g * 0.7).toString(16).padStart(2, '0')}${Math.floor(rgb.b * 0.7).toString(16).padStart(2, '0')}`
                                );
                                lowlight = parseInt(
                                    `0x${Math.floor(rgb.r * 0.4).toString(16).padStart(2, '0')}${Math.floor(rgb.g * 0.4).toString(16).padStart(2, '0')}${Math.floor(rgb.b * 0.4).toString(16).padStart(2, '0')}`
                                );
                                base = parseInt(
                                    `0x${Math.floor(rgb.r * 0.1).toString(16).padStart(2, '0')}${Math.floor(rgb.g * 0.1).toString(16).padStart(2, '0')}${Math.floor(rgb.b * 0.1).toString(16).padStart(2, '0')}`
                                );
                            } else {
                                // Light mode - lighter variations with less saturation
                                // Convert to HSL, adjust lightness, convert back to RGB
                                const rgbToHsl = (r, g, b) => {
                                    r /= 255;
                                    g /= 255;
                                    b /= 255;
                                    const max = Math.max(r, g, b);
                                    const min = Math.min(r, g, b);
                                    let h, s, l = (max + min) / 2;

                                    if (max === min) {
                                        h = s = 0; // achromatic
                                    } else {
                                        const d = max - min;
                                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                                        switch (max) {
                                            case r:
                                                h = (g - b) / d + (g < b ? 6 : 0);
                                                break;
                                            case g:
                                                h = (b - r) / d + 2;
                                                break;
                                            case b:
                                                h = (r - g) / d + 4;
                                                break;
                                        }
                                        h /= 6;
                                    }
                                    return [h, s, l];
                                };

                                const hslToRgb = (h, s, l) => {
                                    let r, g, b;

                                    if (s === 0) {
                                        r = g = b = l; // achromatic
                                    } else {
                                        const hue2rgb = (p, q, t) => {
                                            if (t < 0) t += 1;
                                            if (t > 1) t -= 1;
                                            if (t < 1 / 6) return p + (q - p) * 6 * t;
                                            if (t < 1 / 2) return q;
                                            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                                            return p;
                                        };

                                        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                                        const p = 2 * l - q;
                                        r = hue2rgb(p, q, h + 1 / 3);
                                        g = hue2rgb(p, q, h);
                                        b = hue2rgb(p, q, h - 1 / 3);
                                    }

                                    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
                                };

                                // Get HSL values
                                const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

                                // Create lighter versions with some saturation adjustment for better contrast
                                const midtoneRgb = hslToRgb(h, s * 0.9, Math.min(0.85, l + 0.25));
                                const lowlightRgb = hslToRgb(h, s * 0.7, Math.min(0.75, l + 0.15));
                                const baseRgb = hslToRgb(h, s * 0.3, Math.min(0.95, l + 0.4));

                                // Convert RGB arrays back to hex numbers
                                const toHex = (r, g, b) => {
                                    return parseInt(`0x${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
                                };

                                midtone = toHex(midtoneRgb[0], midtoneRgb[1], midtoneRgb[2]);
                                lowlight = toHex(lowlightRgb[0], lowlightRgb[1], lowlightRgb[2]);
                                base = toHex(baseRgb[0], baseRgb[1], baseRgb[2]);
                            }

                            window.portfolioVantaEffect.setOptions({
                                highlightColor: highlight,
                                midtoneColor: midtone,
                                lowlightColor: lowlight,
                                baseColor: base
                            });
                        }
                    }
                } else {
                    // Deactivate panels not in view
                    panel.classList.remove('active');
                }
            });
        };

        // Initial call to set up the first panel
        handlePortfolioScroll();

        // Add scroll event listener with debounce for performance
        let scrollTimeout;
        portfolioContainer.addEventListener('scroll', () => {
            // Clear the timeout if it's set
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Set a timeout to run the function after 20ms
            scrollTimeout = setTimeout(handlePortfolioScroll, 20);

            // Update progress bar with requestAnimationFrame for smoother UI
            requestAnimationFrame(updateProgressBar);
        });

        // Throttle mousemove events for better performance
        let isThrottled = false;
        const originalMousemoveListener = portfolioContainer._mousemoveListener;

        // Remove existing mousemove listener if it exists
        if (originalMousemoveListener) {
            portfolioContainer.removeEventListener('mousemove', originalMousemoveListener);
        }

        // Remove the mousemove effect entirely - no parallax needed
        portfolioContainer._mousemoveListener = null;

        // Add touch support for mobile
        let touchStartY = 0;

        // Handle touch events for better mobile experience
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, {passive: true});

        document.addEventListener('touchend', (e) => {
            if (isScrolling) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchDiff = touchStartY - touchEndY;

            // More sensitive swipe detection (reduced from 50 to 30)
            if (Math.abs(touchDiff) > 30) {
                const scrollDown = touchDiff > 0;

                // Portfolio internal scrolling
                if (window.currentSectionIndex === 1 && portfolioContainer) {
                    const isAtTop = portfolioContainer.scrollTop <= 1;
                    const isAtBottom = portfolioContainer.scrollHeight - portfolioContainer.scrollTop <=
                        portfolioContainer.clientHeight + 5;

                    if ((isAtTop && !scrollDown) || (isAtBottom && scrollDown)) {
                        // Navigate between sections
                        navigateToSection(scrollDown ? 2 : 0);
                    }
                    // Otherwise let portfolio handle its own scrolling
                } else {
                    // Standard section navigation
                    navigateToSection(window.currentSectionIndex + (scrollDown ? 1 : -1));
                }
            }
        }, {passive: true});
    }

    // Lightbox functionality for portfolio images
    if (lightbox && portfolioItems.length > 0) {
        // Add click event to all portfolio items
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                console.log('Portfolio item clicked!'); // Debug log
                
                // Get the parent portfolio panel
                currentPortfolioPanel = this.closest('.portfolio-panel');
                
                // Get all images in this panel
                currentImages = Array.from(currentPortfolioPanel.querySelectorAll('.portfolio-item img'));
                
                // Find the index of the clicked image
                const clickedImg = this.querySelector('img');
                currentIndex = currentImages.findIndex(img => img === clickedImg);
                
                // Display the lightbox with the selected image
                openLightbox(clickedImg);
            });
        });
        
        // Function to open lightbox
        function openLightbox(img) {
            console.log('Opening lightbox with image:', img.src); // Debug log
            
            // Set image source
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            
            // Set caption text from alt attribute
            lightboxCaption.textContent = img.alt;
            
            // Update counter
            updateCounter();
            
            // Show lightbox
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        }
        
        // Function to close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Reset lightbox image after transition completes
            setTimeout(() => {
                lightboxImage.src = '';
                lightboxImage.alt = '';
            }, 300);
        }
        
        // Function to navigate to previous image
        function prevImage() {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = currentImages.length - 1;
            }
            updateLightboxImage();
        }
        
        // Function to navigate to next image
        function nextImage() {
            if (currentIndex < currentImages.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateLightboxImage();
        }
        
        // Function to update lightbox image
        function updateLightboxImage() {
            const img = currentImages[currentIndex];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = img.alt;
            updateCounter();
        }
        
        // Function to update counter
        function updateCounter() {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
        
        // Event listeners for lightbox controls
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', prevImage);
        lightboxNext.addEventListener('click', nextImage);
        
        // Close lightbox when clicking outside the content
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        });
    }

    // Particle Animation for Testimonials Background
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.lx = x;
            this.ly = y;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
            this.hueSemen = Math.random();
            this.hue = this.hueSemen > .5 ? 20 + 100 : 20 + 200;
            this.sat = this.hueSemen > .5 ? 80 : 90;
            this.light = this.hueSemen > .5 ? 60 : 80;
            this.maxSpeed = this.hueSemen > .5 ? 3 : 2;
        }

        randomize() {
            this.hueSemen = Math.random();
            this.hue = this.hueSemen > .5 ? 20 + 100 : 20 + 200;
            this.sat = this.hueSemen > .5 ? 80 : 90;
            this.light = this.hueSemen > .5 ? 60 : 80;
            this.maxSpeed = this.hueSemen > .5 ? 3 : 2;
        }

        update() {
            this.follow();

            this.vx += this.ax;
            this.vy += this.ay;

            var p = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            var a = Math.atan2(this.vy, this.vx);
            var m = Math.min(this.maxSpeed, p);
            this.vx = Math.cos(a) * m;
            this.vy = Math.sin(a) * m;

            this.x += this.vx;
            this.y += this.vy;
            this.ax = 0;
            this.ay = 0;

            this.edges();
        }

        follow() {
            let angle = (Math.sin(this.x * 0.01 + this.y * 0.01 + Date.now() * 0.01)) * Math.PI * 0.5 + Math.PI / 180 * -90;

            this.ax += Math.cos(angle);
            this.ay += Math.sin(angle);
        }

        updatePrev() {
            this.lx = this.x;
            this.ly = this.y;
        }

        edges() {
            if (this.x < 0) {
                this.x = window.innerWidth;
                this.updatePrev();
            }
            if (this.x > window.innerWidth) {
                this.x = 0;
                this.updatePrev();
            }
            if (this.y < 0) {
                this.y = window.innerHeight;
                this.updatePrev();
            }
            if (this.y > window.innerHeight) {
                this.y = 0;
                this.updatePrev();
            }
        }

        render(ctx) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, .5)`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.lx, this.ly);
            ctx.stroke();
            ctx.closePath();
            this.updatePrev();
        }
    }

    // Initialize Particles
    function initParticles() {
        const particlesContainer = document.getElementById('particles-bg');
        if (!particlesContainer) return;

        const canvas = document.createElement('canvas');
        particlesContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // Particle configuration
        const deg = (a) => Math.PI / 180 * a;
        const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));
        const opt = {
            particles: Math.min(window.innerWidth / 500 ? 500 : 300, 500),
            noiseScale: 0.009,
            angle: Math.PI / 180 * -90,
            h1: rand(0, 360),
            h2: rand(0, 360),
            s1: rand(20, 90),
            s2: rand(20, 90),
            l1: rand(30, 80),
            l2: rand(30, 80),
            strokeWeight: 1.2,
            tail: 82,
        };

        // P5.js functions
        const particles = [];
        let time = 0;
        let width, height;

        // Setup canvas and particles
        function setup() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            const particleCount = window.innerWidth < 768 ?
                Math.min(300, opt.particles / 3) :
                (window.innerWidth < 1200 ?
                    Math.min(500, opt.particles / 2) :
                    opt.particles);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(Math.random() * width, Math.random() * height));
            }
        }

        // P5.js noise function implementation (simplified Perlin noise)
        function noise(x, y, z) {
            return (Math.sin(x * 10 + time * 0.01) + Math.sin(y * 10 + time * 0.01) + Math.sin(z * 10)) * 0.33;
        }

        // Animation frame
        function draw() {
            time++;

            // Clear with alpha for trail effect
            ctx.fillStyle = document.body.classList.contains('dark-mode') ?
                `rgba(0, 0, 0, ${(100 - opt.tail) / 100})` :
                `rgba(255, 255, 255, ${(100 - opt.tail) / 100})`;
            ctx.fillRect(0, 0, width, height);

            const skipFrames = window.innerWidth < 768 ? 2 : 1;
            if (time % skipFrames === 0) {
                for (let p of particles) {
                    p.update();
                    p.render(ctx);
                }
            }

            requestAnimationFrame(draw);
        }

        // Initialize
        setup();
        draw();

        // Handle window resize
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Handle theme toggle click for color change
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            opt.h1 = rand(0, 360);
            opt.h2 = rand(0, 360);
            opt.s1 = rand(20, 90);
            opt.s2 = rand(20, 90);
            opt.l1 = rand(30, 80);
            opt.l2 = rand(30, 80);

            // Randomize particle colors
            for (let p of particles) {
                p.randomize();
            }
        });

        // Handle click on testimonials section to change colors
        particlesContainer.addEventListener('click', () => {
            opt.h1 = rand(0, 360);
            opt.h2 = rand(0, 360);
            opt.s1 = rand(20, 90);
            opt.s2 = rand(20, 90);
            opt.angle += deg(rand(-60, 60)) * (Math.random() > .5 ? 1 : -1);

            for (let p of particles) {
                p.randomize();
            }
        });
    }

    // Initialize particles when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initParticles();
    });

    // Add a dedicated scroll event handler for portfolio container
    if (portfolioContainer) {
        portfolioContainer.addEventListener('wheel', function (e) {
            // If we're at the top and scrolling up, go to hero section
            if (portfolioContainer.scrollTop <= 100 && e.deltaY < 0) {
                e.preventDefault();
                e.stopPropagation(); // Stop event bubbling
                navigateToSection(0);
                return false;
            }
            // If we're at the bottom and scrolling down, go to skills section
            else if (
                portfolioContainer.scrollHeight - portfolioContainer.scrollTop <= portfolioContainer.clientHeight + 1
                && e.deltaY > 0
            ) {
                e.preventDefault();
                e.stopPropagation(); // Stop event bubbling
                navigateToSection(2);
                return false;
            }
        }, {passive: false});
    }
});