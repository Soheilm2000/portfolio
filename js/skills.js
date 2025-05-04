// Skills section interactive effects
document.addEventListener('DOMContentLoaded', function () {
    const skillItems = document.querySelectorAll('.skills-grid .skill-item');
    const lines = document.querySelectorAll('.skills .line');
    const particles = document.querySelectorAll('.skills .particle');

    // Cache DOM elements and computed values
    const skillsSection = document.getElementById('skills');
    const isMobile = window.innerWidth <= 576;

    // Performance optimization: Don't initialize if not in viewport
    let isInViewport = false;
    let animationsInitialized = false;

    // Throttle function to limit execution of expensive operations
    function throttle(callback, limit) {
        let waiting = false;
        return function () {
            if (!waiting) {
                callback.apply(this, arguments);
                waiting = true;
                setTimeout(() => {
                    waiting = false;
                }, limit);
            }
        };
    }

    // Check if skills section is in viewport
    function checkViewport() {
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        // Consider element in viewport if it's within 300px of the viewport
        isInViewport = rect.top <= window.innerHeight + 300 && rect.bottom >= -300;

        // Initialize animations when skills section comes into view
        if (isInViewport && !animationsInitialized) {
            initializeAnimations();
        }
    }

    // Initialize animations only when needed
    function initializeAnimations() {
        if (animationsInitialized) return;

        // Initialize particles
        initParticles();

        // Use event delegation for hover effects
        document.querySelector('.skills-grid').addEventListener('mouseover', handleSkillHover);
        document.querySelector('.skills-grid').addEventListener('mouseout', handleSkillMouseOut);

        // Mark as initialized
        animationsInitialized = true;
    }

    // Handle skill item hover with event delegation
    function handleSkillHover(e) {
        const skillItem = e.target.closest('.skill-item');
        if (!skillItem) return;

        // Get color from class name
        const color = getSkillColor(skillItem);

        // Apply color to lines (with a limit on the number of style changes)
        requestAnimationFrame(() => {
            lines.forEach(line => {
                line.style.background = `rgba(${hexToRgb(color)}, 0.2)`;
                line.classList.add('active');
                line.style.setProperty('color', color);
                const particle = line.querySelector('.particle');
                if (particle) {
                    particle.style.backgroundColor = color;
                    particle.style.color = color;
                }
            });
        });
    }

    // Handle skill item mouse out with event delegation
    function handleSkillMouseOut(e) {
        const skillItem = e.target.closest('.skill-item');
        if (!skillItem) return;

        // Reset lines (with requestAnimationFrame for better performance)
        requestAnimationFrame(() => {
            lines.forEach((line, index) => {
                line.style.background = '';
                line.classList.remove('active');
                line.style.removeProperty('color');
                resetParticleColor(line.querySelector('.particle'), index);
            });
        });
    }

    // Initialize particles with random properties - optimized
    function initParticles() {
        // Create a document fragment to minimize DOM operations
        const fragment = document.createDocumentFragment();

        particles.forEach((particle, index) => {
            // Skip initialization for particles not used in mobile
            if (isMobile && index >= 3) {
                particle.style.display = 'none';
                return;
            }

            particle.style.display = '';
            resetParticleColor(particle, index);
            randomizeParticle(particle);
        });
    }

    // Randomize a single particle's properties - optimized
    function randomizeParticle(particle) {
        // Random colors based on predefined set - use array indexing instead of creating new array each time
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
            '#1abc9c', '#f1c40f', '#d35400', '#8e44ad', '#16a085', '#c0392b'];
        const randomColor = colors[Math.floor(Math.random() * 11)];

        // Animation timing - calculate once
        const duration = Math.random() * 7000 + 5000; // 5-12 seconds
        const delay = Math.random() * 3000; // 0-3 seconds
        const size = Math.random() * 4 + 6;

        // Group style changes for better performance
        requestAnimationFrame(() => {
            // Apply styles in batch
            Object.assign(particle.style, {
                backgroundColor: randomColor,
                color: randomColor,
                animationDuration: `${duration}ms`,
                animationDelay: `${delay}ms`,
                filter: 'brightness(1.4) blur(1px)',
                boxShadow: `0 0 15px ${randomColor}, 0 0 5px ${randomColor}`,
                width: `${size}px`,
                height: `${size}px`,
                left: `${-size / 2}px`
            });
        });
    }

    // Reset particle to its default color based on index - optimized with a cached array
    function resetParticleColor(particle, index) {
        if (!particle) return;

        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#f1c40f'];
        const defaultColor = colors[index % 7];

        particle.style.backgroundColor = defaultColor;
        particle.style.color = defaultColor;
    }

    // Helper function to convert hex to RGB - optimized with caching
    const rgbCache = {}; // Cache RGB values
    function hexToRgb(hex) {
        // Use cached value if available
        if (rgbCache[hex]) return rgbCache[hex];

        // Remove # if present
        hex = hex.replace('#', '');

        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Cache the result
        rgbCache[hex] = `${r}, ${g}, ${b}`;

        return rgbCache[hex];
    }

    // Helper function to get color based on skill type - optimized with lookup table
    const skillColorMap = {
        'html': '#E44D26',
        'css': '#264DE4',
        'js': '#F7DF1E',
        'react': '#61DAFB',
        'vue': '#4FC08D',
        'angular': '#DD0031',
        'node': '#339933',
        'php': '#777BB3',
        'wordpress': '#21759B',
        'elementor': '#92003B',
        'typescript': '#3178C6',
        'mongo': '#47A248',
        'sql': '#4479A1',
        'git': '#F05032',
        'kotlin': '#7F52FF',
        'android': '#3DDC84',
        'sass': '#CC6699',
        'docker': '#2496ED',
        'python': '#3776AB',
        'aws': '#FF9900',
        'flutter': '#45D0F0'
    };

    function getSkillColor(skill) {
        // Find the skill class in the list of classes
        for (const className of skill.classList) {
            if (skillColorMap[className]) {
                return skillColorMap[className];
            }
        }
        return '#6c63ff'; // Default purple
    }

    // Create particle burst effect with optimized rendering and cleanup
    function createParticleBurst(e) {
        const skill = e.target.closest('.skill-item');
        if (!skill) return;

        const rect = skill.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Get accent color from item
        let color = getSkillColor(skill);

        // Create fragment to add all particles at once
        const fragment = document.createDocumentFragment();

        // Create 8 particles - reduced to 8 for better performance
        for (let i = 0; i < 8; i++) {
            const particle = createParticle(centerX, centerY, color);
            fragment.appendChild(particle);
        }

        // Add all particles to DOM at once
        document.body.appendChild(fragment);
    }

    function createParticle(x, y, color) {
        const particle = document.createElement('div');

        // Random size between 5-12px
        const size = Math.random() * 7 + 5;

        // Style the particle - set styles in batch
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            position: 'fixed',
            left: `${x - size / 2}px`,
            top: `${y - size / 2}px`,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`,
            zIndex: '1000',
            pointerEvents: 'none'
        });

        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 80 + 50;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        // Use Web Animation API for better performance
        const keyframes = [
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.8
            },
            {
                transform: `translate(${vx}px, ${vy}px) scale(0)`,
                opacity: 0
            }
        ];

        const timing = {
            duration: Math.random() * 600 + 400,
            easing: 'cubic-bezier(0.1, 0.1, 0.25, 1)'
        };

        const animation = particle.animate(keyframes, timing);

        // Clean up when animation finishes
        animation.onfinish = () => {
            particle.remove();
        };

        return particle;
    }

    // Use IntersectionObserver to efficiently check if section is in viewport
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            checkViewport();
        }
    }, {
        rootMargin: '300px'
    });

    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Set up click handler using event delegation
    document.querySelector('.skills-grid').addEventListener('click', createParticleBurst);

    // Throttled resize handler
    window.addEventListener('resize', throttle(() => {
        if (animationsInitialized) {
            // Update mobile status
            const wasMobile = isMobile;
            const newIsMobile = window.innerWidth <= 576;

            // Only reinitialize if mobile status changed
            if (wasMobile !== newIsMobile) {
                setTimeout(initParticles, 300);
            }
        }
    }, 250));

    // Initial viewport check
    checkViewport();
});