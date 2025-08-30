// Gallery JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    initGallery();
});

function initGallery() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentImageIndex = 0;
    let images = [];
    
    // Collect all gallery images
    function collectImages() {
        const gridItems = document.querySelectorAll('.grid-item img');
        images = Array.from(gridItems).map((img, index) => ({
            src: img.src,
            alt: img.alt,
            caption: img.closest('.grid-item').dataset.caption || img.alt,
            index: index
        }));
    }
    
    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyboard);
    }
    
    // Update lightbox content
    function updateLightbox() {
        if (images.length === 0) return;
        
        const currentImage = images[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        
        // Update navigation button states
        lightboxPrev.style.display = currentImageIndex === 0 ? 'none' : 'block';
        lightboxNext.style.display = currentImageIndex === images.length - 1 ? 'none' : 'block';
    }
    
    // Navigate to next image
    function nextImage() {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            updateLightbox();
        }
    }
    
    // Navigate to previous image
    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateLightbox();
        }
    }
    
    // Handle keyboard navigation
    function handleKeyboard(e) {
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
    }
    
    // Add click event listeners to gallery images
    function addGalleryEventListeners() {
        const gridItems = document.querySelectorAll('.grid-item');
        
        gridItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                openLightbox(index);
            });
            
            // Add hover effect for better UX
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Add lightbox event listeners
    function addLightboxEventListeners() {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', prevImage);
        lightboxNext.addEventListener('click', nextImage);
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Initialize everything
    function init() {
        collectImages();
        addGalleryEventListeners();
        addLightboxEventListeners();
        
        // Add loading animation for images
        addImageLoadingEffects();
    }
    
    // Add loading effects for better UX
    function addImageLoadingEffects() {
        const images = document.querySelectorAll('.grid-item img');
        
        images.forEach(img => {
            // Add loading state
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
            
            // Add error handling
            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
                this.style.filter = 'grayscale(100%)';
                this.alt = 'Image not available';
            });
        });
    }
    
    // Add smooth scrolling for better navigation
    function addSmoothScrolling() {
        const sections = document.querySelectorAll('.gallery-section');
        
        sections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            observer.observe(section);
        });
    }
    
    // Initialize the gallery
    init();
    addSmoothScrolling();
    
    // Add responsive behavior
    addResponsiveBehavior();
}

// Add responsive behavior for different screen sizes
function addResponsiveBehavior() {
    const galleryGrid = document.querySelectorAll('.gallery-grid');
    
    function updateGridLayout() {
        const width = window.innerWidth;
        
        galleryGrid.forEach(grid => {
            if (width <= 480) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.gap = '16px';
            } else if (width <= 768) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gap = '14px';
            } else if (width <= 1024) {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                grid.style.gap = '18px';
            } else {
                grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                grid.style.gap = '20px';
            }
        });
    }
    
    // Update on load and resize
    updateGridLayout();
    window.addEventListener('resize', updateGridLayout);
}

// Add lazy loading for better performance
function addLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Add touch support for mobile devices
function addTouchSupport() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe left/right for navigation
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next image
                if (window.currentImageIndex !== undefined) {
                    const nextBtn = document.getElementById('lightbox-next');
                    if (nextBtn && nextBtn.style.display !== 'none') {
                        nextBtn.click();
                    }
                }
            } else {
                // Swipe right - previous image
                if (window.currentImageIndex !== undefined) {
                    const prevBtn = document.getElementById('lightbox-prev');
                    if (prevBtn && prevBtn.style.display !== 'none') {
                        prevBtn.click();
                    }
                }
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    addLazyLoading();
    addTouchSupport();
});
