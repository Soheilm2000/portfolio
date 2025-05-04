/**
 * Theme switching functionality
 * Handles light/dark mode transitions and preferences
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('toggle');
    const themeOverlay = document.querySelector('.theme-transition-overlay');

    // Check for saved theme preference or use device preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Apply the saved theme or device preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
    }

    // Theme toggle function
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            // Show transition overlay
            themeOverlay.classList.add('visible');

            setTimeout(() => {
                // Switch to dark theme
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');

                // Hide transition overlay after theme is applied
                setTimeout(() => {
                    themeOverlay.classList.remove('visible');
                }, 600);
            }, 400);
        } else {
            // Show transition overlay
            themeOverlay.classList.add('visible');

            setTimeout(() => {
                // Switch to light theme
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');

                // Hide transition overlay after theme is applied
                setTimeout(() => {
                    themeOverlay.classList.remove('visible');
                }, 600);
            }, 400);
        }
    });

    // Initialize animated theme toggle
    initThemeToggleAnimation();
});

// Additional theme toggle animation
function initThemeToggleAnimation() {
    const toggle = document.querySelector('.theme-toggle');

    if (toggle) {
        const stars1 = document.querySelector('.stars1');
        const stars2 = document.querySelector('.stars2');

        // Add random star positions
        if (stars1 && stars2) {
            for (let i = 0; i < 20; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.animationDuration = `${Math.random() * 3 + 1}s`;
                star.style.animationDelay = `${Math.random() * 2}s`;

                if (i % 2 === 0) {
                    stars1.appendChild(star);
                } else {
                    stars2.appendChild(star);
                }
            }
        }
    }
}