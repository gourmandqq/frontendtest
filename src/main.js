import './styles/main.min.css';
import Cart from './cart.js';

class PageSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.currentIndex = -1;
        this.matches = [];
        
        this.init();
    }
    
    init() {
        this.searchButton.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });
    }
    
    search() {
        const term = this.searchInput.value.trim();
        if (!term) {
            alert('Введите поисковый запрос');
            return;
        }
        
        this.clearHighlights();
        this.matches = [];
        
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while ((node = walker.nextNode())) {
            const text = node.textContent;
            const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
            const matches = [...text.matchAll(regex)];
            
            if (matches.length > 0) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
                node.parentNode.replaceChild(span, node);
                
                const highlights = span.querySelectorAll('mark');
                highlights.forEach(mark => {
                    this.matches.push(mark);
                });
            }
        }
        
        if (this.matches.length > 0) {
            this.matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            alert(`Найдено совпадений: ${this.matches.length}`);
        } else {
            alert('Ничего не найдено');
        }
    }
    
    clearHighlights() {
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceWith(parent.textContent);
        });
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

class Slider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.pagination-dot');
        this.prevBtn = document.querySelector('.slider-arrow-prev');
        this.nextBtn = document.querySelector('.slider-arrow-next');
        this.currentSlide = 0;
        
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    updateSlider() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

class ActiveMenu {
    constructor() {
        this.menuLinks = document.querySelectorAll('.menu nav ul li a');
        this.init();
    }
    
    init() {
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.setActiveLink(link);
            });
        });
        
        this.setActiveFromHash();
        
        window.addEventListener('hashchange', () => this.setActiveFromHash());
    }
    
    setActiveLink(clickedLink) {
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        clickedLink.classList.add('active');
        
        localStorage.setItem('activeMenuLink', clickedLink.getAttribute('href'));
    }
    
    setActiveFromHash() {
        const currentHash = window.location.hash;
        if (currentHash) {
            const activeLink = document.querySelector(`.menu nav ul li a[href="${currentHash}"]`);
            if (activeLink) {
                this.setActiveLink(activeLink);
            }
        } else {
            const savedLink = localStorage.getItem('activeMenuLink');
            if (savedLink) {
                const savedLinkElement = document.querySelector(`.menu nav ul li a[href="${savedLink}"]`);
                if (savedLinkElement) {
                    this.setActiveLink(savedLinkElement);
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Slider();
    new PageSearch();
    new ActiveMenu();
    new Cart();
});