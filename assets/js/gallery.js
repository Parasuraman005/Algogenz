class GalleryLightbox {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightboxImage');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.lightboxCounter = document.getElementById('lightboxCounter');
    this.lightboxClose = document.getElementById('lightboxClose');
    this.lightboxPrev = document.getElementById('lightboxPrev');
    this.lightboxNext = document.getElementById('lightboxNext');
    
    this.init();
  }
  
  init() {
    // Collect all gallery images
    this.images = Array.from(document.querySelectorAll('.grid-item[data-image]'));
    
    // Add click event to each image
    this.images.forEach((item, index) => {
      item.addEventListener('click', () => this.openLightbox(index));
    });
    
    // Add event listeners for lightbox controls
    this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    this.lightboxPrev.addEventListener('click', () => this.prevImage());
    this.lightboxNext.addEventListener('click', () => this.nextImage());
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Add click outside to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });
    
    // Add touch/swipe support
    this.addTouchSupport();
  }
  
  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightbox();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateLightbox();
  }
  
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateLightbox();
  }
  
  updateLightbox() {
    const currentImage = this.images[this.currentIndex];
    const imageSrc = currentImage.getAttribute('data-image');
    const caption = currentImage.getAttribute('data-caption');
    
    this.lightboxImage.src = imageSrc;
    this.lightboxImage.alt = caption;
    this.lightboxCaption.textContent = caption;
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }
  
  handleKeydown(e) {
    if (!this.lightbox.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }
  
  addTouchSupport() {
    let startX = 0;
    let startY = 0;
    
    this.lightbox.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    this.lightbox.addEventListener('touchend', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Check if it's a horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextImage(); // Swipe left
        } else {
          this.prevImage(); // Swipe right
        }
      }
    });
  }
}

// Initialize the gallery lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GalleryLightbox();
});
