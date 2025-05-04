// Skills section interactive effects
document.addEventListener('DOMContentLoaded', function () {
    const skillItems = document.querySelectorAll('.skills-grid .skill-item');
    const lines = document.querySelectorAll('.skills .line');
    const particles = document.querySelectorAll('.skills .particle');

    console.log('Number of lines found:', lines.length); // Debug log to check if lines are found

    // Ensure all lines are visible and working correctly
    if (lines.length !== 7) {
        console.error('Expected 7 lines, but found:', lines.length);
    }

    // Check if we're in mobile portrait mode (width <= 576px)
    const isMobilePortrait = () => window.innerWidth <= 576;

    // Initialize random particles
    initParticles();

    // Update particles on window resize
    window.addEventListener('resize', () => {
        // Small delay to ensure CSS transitions are complete
        setTimeout(initParticles, 300);
    });

    // Hover effect to change line colors
    skillItems.forEach(item => {
        // Get color from class name
        let color = getSkillColor(item);

        // Mouse enter - change all lines to skill color
        item.addEventListener('mouseenter', () => {
            lines.forEach((line, index) => {
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

        // Mouse leave - restore original colors
        item.addEventListener('mouseleave', () => {
            lines.forEach((line, index) => {
                line.style.background = '';
                line.classList.remove('active');
                line.style.removeProperty('color');
                resetParticleColor(line.querySelector('.particle'), index);
            });
        });

        // Create particle burst effect when clicking on skills
        item.addEventListener('click', createParticleBurst);
    });

    // Initialize particles with random properties
    function initParticles() {
        particles.forEach((particle, index) => {
            // Check if this particle's parent line is visible
            const parentLine = particle.parentElement;
            if (isMobilePortrait() && index >= 3) {
                // Hide particle effect for hidden lines in mobile portrait
                particle.style.display = 'none';
            } else {
                particle.style.display = '';
                resetParticleColor(particle, index);
                randomizeParticle(particle);
            }
        });
    }

    // Randomize a single particle's properties
    function randomizeParticle(particle) {
        // Random colors based on predefined set
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
            '#1abc9c', '#f1c40f', '#d35400', '#8e44ad', '#16a085', '#c0392b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Add random animation duration between 5-12 seconds
        const duration = Math.random() * 7000 + 5000; // 5-12 seconds

        // Add random animation delay so particles don't all start at once
        const delay = Math.random() * 3000; // 0-3 seconds

        // Apply styles
        particle.style.backgroundColor = randomColor;
        particle.style.color = randomColor;
        particle.style.animationDuration = `${duration}ms`;
        particle.style.animationDelay = `${delay}ms`;
        particle.style.filter = 'brightness(1.4) blur(1px)';
        particle.style.boxShadow = `0 0 15px ${randomColor}, 0 0 5px ${randomColor}`;

        // Random size variation (6-10px)
        const size = Math.random() * 4 + 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${-size / 2}px`;

        // Adjust trail
        if (particle.nextElementSibling) {
            const trail = particle.nextElementSibling;
            trail.style.height = `${40 + Math.random() * 50}px`;
            trail.style.opacity = '0.5';
        }
    }

    // Reset particle to its default color based on index
    function resetParticleColor(particle, index) {
        if (!particle) return;

        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#f1c40f'];
        const defaultColor = colors[index % colors.length];

        particle.style.backgroundColor = defaultColor;
        particle.style.color = defaultColor;
    }

    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');

        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `${r}, ${g}, ${b}`;
    }

    // Helper function to get color based on skill type
    function getSkillColor(skill) {
        // Get accent color from item
        if (skill.classList.contains('html')) return '#E44D26';
        else if (skill.classList.contains('css')) return '#264DE4';
        else if (skill.classList.contains('js')) return '#F7DF1E';
        else if (skill.classList.contains('react')) return '#61DAFB';
        else if (skill.classList.contains('vue')) return '#4FC08D';
        else if (skill.classList.contains('angular')) return '#DD0031';
        else if (skill.classList.contains('node')) return '#339933';
        else if (skill.classList.contains('php')) return '#777BB3';
        else if (skill.classList.contains('wordpress')) return '#21759B';
        else if (skill.classList.contains('elementor')) return '#92003B';
        else if (skill.classList.contains('typescript')) return '#3178C6';
        else if (skill.classList.contains('mongo')) return '#47A248';
        else if (skill.classList.contains('sql')) return '#4479A1';
        else if (skill.classList.contains('git')) return '#F05032';
        else if (skill.classList.contains('kotlin')) return '#7F52FF';
        else if (skill.classList.contains('android')) return '#3DDC84';
        else if (skill.classList.contains('sass')) return '#CC6699';
        else if (skill.classList.contains('docker')) return '#2496ED';
        else if (skill.classList.contains('python')) return '#3776AB';
        else if (skill.classList.contains('aws')) return '#FF9900';
        else if (skill.classList.contains('flutter')) return '#45D0F0';
        else return '#6c63ff'; // Default purple
    }

    function createParticleBurst(e) {
        const skill = this;
        const rect = skill.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Get accent color from item
        let color = '#6c63ff'; // Default purple

        // Try to determine color from hover style
        if (skill.classList.contains('html')) color = '#E44D26';
        else if (skill.classList.contains('css')) color = '#264DE4';
        else if (skill.classList.contains('js')) color = '#F7DF1E';
        else if (skill.classList.contains('react')) color = '#61DAFB';
        else if (skill.classList.contains('vue')) color = '#4FC08D';
        else if (skill.classList.contains('node')) color = '#339933';

        // Create 12 particles
        for (let i = 0; i < 12; i++) {
            createParticle(centerX, centerY, color);
        }
    }

    function createParticle(x, y, color) {
        const particle = document.createElement('div');
        document.body.appendChild(particle);

        // Random size between 5-12px
        const size = Math.random() * 7 + 5;

        // Style the particle
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.position = 'fixed';
        particle.style.left = `${x - size / 2}px`;
        particle.style.top = `${y - size / 2}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.zIndex = '1000';
        particle.style.pointerEvents = 'none';

        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 80 + 50;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        // Animate using Web Animation API
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
    }

    // Function to randomize particle animations - call this periodically
    function randomizeParticles() {
        particles.forEach((particle) => {
            // Restart animation with new random values
            particle.style.animation = 'none';
            particle.offsetHeight; // Trigger reflow

            // Set new random properties
            randomizeParticle(particle);

            // Restart animation
            particle.style.animation = `particleFlow ${particle.style.animationDuration} linear infinite ${particle.style.animationDelay}`;
        });
    }

    // Randomize individual particles at different intervals
    particles.forEach((particle, index) => {
        // Each particle gets its own random interval between 8-15 seconds
        const randomInterval = Math.random() * 7000 + 8000;
        setInterval(() => {
            // Only randomize this specific particle
            particle.style.animation = 'none';
            particle.offsetHeight;
            randomizeParticle(particle);
            particle.style.animation = `particleFlow ${particle.style.animationDuration} linear infinite ${particle.style.animationDelay}`;
        }, randomInterval);
    });
});