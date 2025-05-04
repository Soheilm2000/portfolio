/**
 * Portfolio functionality
 * Manages portfolio image gallery and lightbox interactions
 */

// Portfolio image animation
document.addEventListener('DOMContentLoaded', () => {
    const animatePortfolioItems = () => {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const portfolioHeaders = document.querySelectorAll('.portfolio-header');

        // Create an observer for portfolio items
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.2});

        // Create an observer for portfolio headers
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    headerObserver.unobserve(entry.target);
                }
            });
        }, {threshold: 0.2});

        // Observe each portfolio item
        portfolioItems.forEach(item => {
            observer.observe(item);
        });

        // Observe each portfolio header
        portfolioHeaders.forEach(header => {
            headerObserver.observe(header);
        });
    };

    animatePortfolioItems();
});

// Portfolio lightbox functionality
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    const closeButton = document.querySelector('.lightbox-close');
    const prevButton = document.querySelector('.lightbox-prev');
    const nextButton = document.querySelector('.lightbox-next');

    let currentGallery = [];
    let currentIndex = 0;

    // Open lightbox when clicking on a portfolio item
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const gallery = item.closest('.portfolio-gallery');
            currentGallery = Array.from(gallery.querySelectorAll('.portfolio-item img'));
            currentIndex = currentGallery.indexOf(item.querySelector('img'));

            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Update lightbox content
    function updateLightbox() {
        const img = currentGallery[currentIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    }

    // Close lightbox
    closeButton.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Next image
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox();
    });

    // Previous image
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightbox();
        }
    });
});