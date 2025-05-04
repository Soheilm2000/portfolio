/**
 * CSS Fog Animation
 * Creates a pure CSS fog animation as a replacement for Vanta.js
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get the fogwrapper element
    const fogwrapper = document.getElementById('fogwrapper');

    if (fogwrapper) {
        // Clear existing content
        fogwrapper.innerHTML = '';

        // Create the fog structure
        const fogHTML = `
            <div id="foglayer_01" class="fog">
                <div class="image01"></div>
                <div class="image02"></div>
            </div>
            <div id="foglayer_02" class="fog">
                <div class="image01"></div>
                <div class="image02"></div>
            </div>
            <div id="foglayer_03" class="fog">
                <div class="image01"></div>
                <div class="image02"></div>
            </div>
        `;

        // Append the fog HTML to the wrapper
        fogwrapper.innerHTML = fogHTML;

        // Make sure fogwrapper has the correct class
        fogwrapper.classList.add('fogwrapper');

        // Apply initial color based on current theme
        updateFogColors();
    }

    // Function to update fog colors based on theme
    function updateFogColors() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const fogLayers = document.querySelectorAll('.fog');

        if (fogLayers.length > 0) {
            const colors = isDarkMode ?
                {
                    filter: 'hue-rotate(240deg) brightness(0.8) saturate(1.2)',
                    background: 'linear-gradient(to bottom, rgba(13, 5, 38, 0.8), rgba(65, 47, 179, 0.3))'
                } :
                {
                    filter: 'hue-rotate(280deg) brightness(1.2) saturate(0.8)',
                    background: 'linear-gradient(to bottom, rgba(240, 240, 255, 0.8), rgba(196, 192, 255, 0.3))'
                };

            // Apply the filter to all fog layers
            fogLayers.forEach(layer => {
                layer.style.filter = colors.filter;
            });

            // Apply background gradient to fogwrapper
            fogwrapper.style.background = colors.background;
        }
    }

    // Listen for theme changes
    document.querySelector('#theme-switch').addEventListener('change', updateFogColors);
    document.querySelector('#theme-switch-mobile').addEventListener('change', updateFogColors);

    // Also update colors when panels change in portfolio
    const portfolioPanels = document.querySelectorAll('.portfolio-panel');
    if (portfolioPanels.length > 0) {
        portfolioPanels.forEach(panel => {
            // When a panel becomes active, update fog color based on panel color
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class' &&
                        panel.classList.contains('active')) {

                        const panelColor = panel.getAttribute('data-color');
                        if (panelColor) {
                            updateFogColorsFromPanel(panelColor);
                        }
                    }
                });
            });

            observer.observe(panel, {attributes: true});
        });
    }

    // Function to update fog colors based on panel color
    function updateFogColorsFromPanel(panelColor) {
        const fogLayers = document.querySelectorAll('.fog');
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (fogLayers.length > 0) {
            // Extract hue from the hex color
            const r = parseInt(panelColor.substring(1, 3), 16);
            const g = parseInt(panelColor.substring(3, 5), 16);
            const b = parseInt(panelColor.substring(5, 7), 16);

            // Calculate approximate hue (simplified)
            let hue = 0;
            if (r > g && r > b) {
                hue = 0 + (g - b) / (Math.max(r, g, b) - Math.min(r, g, b)) * 60;
            } else if (g > r && g > b) {
                hue = 120 + (b - r) / (Math.max(r, g, b) - Math.min(r, g, b)) * 60;
            } else {
                hue = 240 + (r - g) / (Math.max(r, g, b) - Math.min(r, g, b)) * 60;
            }
            if (hue < 0) hue += 360;

            // Apply the hue rotation filter
            const filter = `hue-rotate(${hue}deg) brightness(${isDarkMode ? 0.7 : 1.2}) saturate(${isDarkMode ? 1.4 : 0.8})`;
            fogLayers.forEach(layer => {
                layer.style.filter = filter;
            });

            // Create a gradient based on the panel color
            const baseColor = isDarkMode ?
                `rgba(${Math.floor(r * 0.2)}, ${Math.floor(g * 0.2)}, ${Math.floor(b * 0.2)}, 0.8)` :
                `rgba(${Math.min(255, Math.floor(r * 1.2))}, ${Math.min(255, Math.floor(g * 1.2))}, ${Math.min(255, Math.floor(b * 1.2))}, 0.8)`;

            const accentColor = isDarkMode ?
                `rgba(${Math.floor(r * 0.4)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.4)}, 0.3)` :
                `rgba(${Math.min(255, Math.floor(r * 1.1))}, ${Math.min(255, Math.floor(g * 1.1))}, ${Math.min(255, Math.floor(b * 1.1))}, 0.3)`;

            fogwrapper.style.background = `linear-gradient(to bottom, ${baseColor}, ${accentColor})`;
        }
    }
});