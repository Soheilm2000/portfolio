// Particle Animation for Testimonials Background
document.addEventListener('DOMContentLoaded', () => {
    // Particle Animation for Testimonials
    const particlesContainer = document.getElementById('particles-bg');
    if (!particlesContainer) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    particlesContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Variables
    const deg = (a) => Math.PI / 180 * a;
    const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));

    // Function to generate colors based on current theme
    function generateColors() {
        if (document.body.classList.contains('dark-mode')) {
            // Dark mode - brighter colors with higher lightness
            opt.h1 = rand(0, 360);
            opt.h2 = rand(0, 360);
            opt.s1 = rand(60, 100);
            opt.s2 = rand(60, 100);
            opt.l1 = rand(60, 90); // Higher lightness for dark mode
            opt.l2 = rand(60, 90);
        } else {
            // Light mode - deeper colors with lower lightness
            opt.h1 = rand(0, 360);
            opt.h2 = rand(0, 360);
            opt.s1 = rand(60, 100);
            opt.s2 = rand(60, 100);
            opt.l1 = rand(30, 60); // Lower lightness for light mode
            opt.l2 = rand(30, 60);
        }
    }

    const opt = {
        particles: window.innerWidth / 500 ? 1000 : 500,
        noiseScale: 0.0045,
        angle: Math.PI / 180 * -90,
        flowSpread: 1.12,
        h1: rand(0, 360),
        h2: rand(0, 360),
        s1: rand(60, 100),
        s2: rand(60, 100),
        l1: rand(50, 70),
        l2: rand(50, 70),
        strokeWeight: 1.5,
        tail: 90,
        attractionForce: 0.0001,
        attractionRadius: 150,
        repulsionForce: 0.05,
        behaviorCycleDuration: 10000,
        pathForce: 0.02,
        lineDeviation: 0.2,
        minDistance: 80
    };

    // Initialize colors based on current theme
    generateColors();

    const particles = [];
    let time = 0;
    let cycleTime = 0;
    let width, height;

    // Path points that particles will follow
    const pathPoints = [];
    const pathSegments = 12;

    // Track the last cycle state to detect changes
    let lastCycleState = true; // true = attracting, false = repelling

    // Particle class
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
            this.hue = this.hueSemen > .5 ? 20 + opt.h1 : 20 + opt.h2;
            this.sat = this.hueSemen > .5 ? opt.s1 : opt.s2;
            this.light = this.hueSemen > .5 ? opt.l1 : opt.l2;
            this.maxSpeed = this.hueSemen > .5 ? 1.5 : 0.8;
        }

        randomize() {
            this.hueSemen = Math.random();
            this.hue = this.hueSemen > .5 ? 20 + opt.h1 : 20 + opt.h2;
            this.sat = this.hueSemen > .5 ? opt.s1 : opt.s2;
            this.light = this.hueSemen > .5 ? opt.l1 : opt.l2;
            this.maxSpeed = this.hueSemen > .5 ? 1.5 : 0.8;
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
            // Calculate path influence - increases with time
            const pathInfluence = Math.min(1.0, time / 5000);

            // Find closest point on the path
            const pathData = findClosestPointOnPath(this.x, this.y);
            const closestPoint = pathData.point;

            // Calculate direction to the closest point on the path
            const dx = closestPoint.x - this.x;
            const dy = closestPoint.y - this.y;
            const distToPath = pathData.distance;

            // Calculate path following force - stronger when closer to the path
            const pathForceFactor = opt.pathForce * (1 / (1 + distToPath * opt.lineDeviation)) * pathInfluence;

            // Flow force decreases over time as path influence increases
            const flowFactor = 1 - pathInfluence;

            // Add path following force
            if (distToPath > 5) {
                this.ax += dx * pathForceFactor;
                this.ay += dy * pathForceFactor;
            }

            // Add flow field force (decreases over time)
            let angle = (Math.sin(this.x * opt.noiseScale + time * 0.00005) +
                    Math.sin(this.y * opt.noiseScale + time * 0.00005) +
                    Math.sin((this.x + this.y) * opt.noiseScale * 0.5)) *
                Math.PI * opt.flowSpread + opt.angle;

            this.ax += Math.cos(angle) * 0.6 * flowFactor;
            this.ay += Math.sin(angle) * 0.6 * flowFactor;

            // Determine if we're in attraction or repulsion mode
            const timeInCycle = cycleTime % (opt.behaviorCycleDuration * 2);
            const isAttracting = timeInCycle < opt.behaviorCycleDuration;

            // Apply appropriate force based on cycle
            const interactionStrength = isAttracting ? opt.attractionForce : opt.repulsionForce;

            // Interact with other particles (attract or repel)
            this.interactWithOtherParticles(interactionStrength, isAttracting);
        }

        interactWithOtherParticles(strength, isAttracting) {
            const radius = isAttracting ? opt.attractionRadius : opt.attractionRadius * 1.5;

            for (let i = 0; i < particles.length; i++) {
                const other = particles[i];
                if (other === this) continue;

                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                // Apply minimum distance constraint - strong repulsion when too close
                if (dist < opt.minDistance && dist > 0) {
                    // Very strong repulsion force based on how much closer than minimum distance
                    const repelFactor = 1 - (dist / opt.minDistance);
                    const repelForce = 0.05 * repelFactor * repelFactor; // Quadratic increase for stronger effect

                    this.ax -= (dx / dist) * repelForce;
                    this.ay -= (dy / dist) * repelForce;
                }
                // Regular interaction based on cycle
                else if (distSq < radius * radius && distSq > 0) {
                    if (isAttracting) {
                        // Attraction - particles move toward each other, but respect minimum distance
                        const force = strength * (1 - dist / radius);
                        this.ax += (dx / dist) * force;
                        this.ay += (dy / dist) * force;
                    } else {
                        // Repulsion - particles push away from each other
                        const force = strength * Math.pow(1 - dist / radius, 2);
                        this.ax -= (dx / dist) * force;
                        this.ay -= (dy / dist) * force;
                    }
                }
            }
        }

        updatePrev() {
            this.lx = this.x;
            this.ly = this.y;
        }

        edges() {
            if (this.x < 0) {
                this.x = width;
                this.updatePrev();
            }
            if (this.x > width) {
                this.x = 0;
                this.updatePrev();
            }
            if (this.y < 0) {
                this.y = height;
                this.updatePrev();
            }
            if (this.y > height) {
                this.y = 0;
                this.updatePrev();
            }
        }

        render() {
            // Adjust opacity based on theme for better contrast
            const opacity = document.body.classList.contains('dark-mode') ? 0.8 : 0.7;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${opacity})`;
            ctx.lineWidth = opt.strokeWeight;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.lx, this.ly);
            ctx.stroke();
            ctx.closePath();
            this.updatePrev();
        }
    }

    // Create a flowing path for particles to follow
    function createPath() {
        pathPoints.length = 0;

        // Create a flowing path across the screen
        for (let i = 0; i <= pathSegments; i++) {
            const t = i / pathSegments;
            const x = width * t;

            // Create a wavy path with some randomness
            const y = height * 0.5 +
                Math.sin(t * Math.PI * 2) * (height * 0.2) +
                Math.cos(t * Math.PI * 4) * (height * 0.05);

            pathPoints.push({x, y});
        }
    }

    // Find closest point on path
    function findClosestPointOnPath(x, y) {
        let minDist = Infinity;
        let closestPoint = {x: 0, y: 0};
        let segmentIndex = 0;

        // Find the closest segment
        for (let i = 0; i < pathPoints.length - 1; i++) {
            const p1 = pathPoints[i];
            const p2 = pathPoints[i + 1];

            // Find closest point on this segment
            const projection = projectPointOnSegment(x, y, p1.x, p1.y, p2.x, p2.y);
            const dist = Math.hypot(projection.x - x, projection.y - y);

            if (dist < minDist) {
                minDist = dist;
                closestPoint = projection;
                segmentIndex = i;
            }
        }

        return {point: closestPoint, distance: minDist, index: segmentIndex};
    }

    // Project point onto line segment
    function projectPointOnSegment(x, y, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const segmentLengthSq = dx * dx + dy * dy;

        if (segmentLengthSq === 0) {
            return {x: x1, y: y1};
        }

        // Calculate projection ratio (0 to 1 if on segment)
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / segmentLengthSq));

        return {
            x: x1 + t * dx,
            y: y1 + t * dy
        };
    }

    // Setup function
    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        // Create flowing path
        createPath();

        for (let i = 0; i < opt.particles; i++) {
            particles.push(new Particle(Math.random() * width, Math.random() * height));
        }
    }

    function draw() {
        time++;
        cycleTime += 16;

        const timeInCycle = cycleTime % (opt.behaviorCycleDuration * 2);
        const isAttracting = timeInCycle < opt.behaviorCycleDuration;

        if (isAttracting !== lastCycleState) {
            lastCycleState = isAttracting;

            // Generate appropriate colors for the current theme
            generateColors();

            for (let p of particles) {
                p.randomize();
            }
        }

        // Clear with alpha for trail effect - slower updates for longer trails
        ctx.fillStyle = document.body.classList.contains('dark-mode') ?
            `rgba(0, 0, 0, ${(100 - opt.tail) / 100})` :
            `rgba(255, 255, 255, ${(100 - opt.tail) / 100})`;
        ctx.fillRect(0, 0, width, height);

        // Optional: Draw mode indicator
        ctx.fillStyle = isAttracting ? "rgba(0,255,0,0.1)" : "rgba(255,0,0,0.1)";
        ctx.fillRect(10, 10, 20, 20);

        for (let p of particles) {
            p.update();
            p.render();
        }

        requestAnimationFrame(draw);
    }

    // Initialize animation
    setup();
    draw();

    // Event listeners
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createPath();
    });

    document.querySelector('.theme-toggle').addEventListener('click', () => {
        // Small delay to ensure the class change has happened
        setTimeout(() => {
            // Generate appropriate colors for the new theme
            generateColors();

            for (let p of particles) {
                p.randomize();
            }
        }, 50);
    });

    particlesContainer.addEventListener('click', () => {
        // Generate appropriate colors for the current theme
        generateColors();
        opt.angle += deg(rand(-60, 60)) * (Math.random() > .5 ? 1 : -1);

        for (let p of particles) {
            p.randomize();
        }
    });

    // Initialize testimonials slider
    const testimonialQuotes = document.querySelectorAll('.testimonial-quote');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    let currentQuote = 0;

    if (testimonialQuotes.length > 0) {
        // Initial setup
        testimonialQuotes.forEach((quote, i) => {
            if (i !== 0) quote.classList.remove('active');
        });

        // Next button
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                testimonialQuotes[currentQuote].classList.remove('active');
                testimonialDots[currentQuote].classList.remove('active');

                currentQuote = (currentQuote + 1) % testimonialQuotes.length;

                testimonialQuotes[currentQuote].classList.add('active');
                testimonialDots[currentQuote].classList.add('active');
            });
        }

        // Previous button
        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                testimonialQuotes[currentQuote].classList.remove('active');
                testimonialDots[currentQuote].classList.remove('active');

                currentQuote = (currentQuote - 1 + testimonialQuotes.length) % testimonialQuotes.length;

                testimonialQuotes[currentQuote].classList.add('active');
                testimonialDots[currentQuote].classList.add('active');
            });
        }

        // Dot navigation
        testimonialDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                testimonialQuotes[currentQuote].classList.remove('active');
                testimonialDots[currentQuote].classList.remove('active');

                currentQuote = i;

                testimonialQuotes[currentQuote].classList.add('active');
                testimonialDots[currentQuote].classList.add('active');
            });
        });

        // Auto-rotate testimonials
        setInterval(() => {
            testimonialQuotes[currentQuote].classList.remove('active');
            testimonialDots[currentQuote].classList.remove('active');

            currentQuote = (currentQuote + 1) % testimonialQuotes.length;

            testimonialQuotes[currentQuote].classList.add('active');
            testimonialDots[currentQuote].classList.add('active');
        }, 8000);
    }
});