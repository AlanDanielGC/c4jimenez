// carousel.js - Funcionalidad reusable para carruseles
class Carrusel {
    constructor(container) {
        this.container = container;
        this.carouselInner = container.querySelector('.carousel-inner');
        this.items = container.querySelectorAll('.carousel-item');
        this.prevBtn = container.querySelector('.carousel-btn.prev');
        this.nextBtn = container.querySelector('.carousel-btn.next');
        this.indicators = container.querySelectorAll('.indicator');
        
        this.currentIndex = 0;
        this.totalItems = this.items.length;
        this.autoAdvance = true;
        this.interval = null;
        
        this.init();
    }
    
    init() {
        // Event listeners para botones
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Auto avanzar cada 5 segundos
        if (this.autoAdvance) {
            this.startAutoAdvance();
        }
        
        // Pausar auto-avance al hacer hover
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoAdvance();
        });
        
        this.container.addEventListener('mouseleave', () => {
            if (this.autoAdvance) {
                this.startAutoAdvance();
            }
        });
    }
    
    updateCarousel() {
        this.carouselInner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    startAutoAdvance() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoAdvance() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Inicializar todos los carruseles en la página
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new Carrusel(carousel);
    });
});