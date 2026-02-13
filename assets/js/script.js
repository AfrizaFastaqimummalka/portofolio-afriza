/**
 * Portfolio Website - Main JavaScript
 * Handles navigation, slider, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVIGATION
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // PROJECT SLIDER
    // ============================================
    
    class ProjectSlider {
        constructor(sliderElement) {
            this.slider = sliderElement;
            this.slides = this.slider.querySelector('.project-slides');
            this.slideItems = this.slides.querySelectorAll('.project-slide');
            this.dots = this.slider.querySelectorAll('.slider-dot');
            this.prevBtn = this.slider.querySelector('.slider-arrow.prev');
            this.nextBtn = this.slider.querySelector('.slider-arrow.next');
            this.currentIndex = 0;
            this.totalSlides = this.slideItems.length;
            this.autoplayInterval = null;
            
            this.init();
        }
        
        init() {
            // Only initialize if there are slides
            if (this.totalSlides === 0) return;
            
            // Show first slide
            this.showSlide(0);
            
            // Event listeners
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.showSlide(index));
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.isInViewport()) {
                    if (e.key === 'ArrowLeft') this.prevSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                }
            });
            
            // Touch/Swipe support
            this.addSwipeSupport();
            
            // Start autoplay
            this.startAutoplay();
            
            // Pause autoplay on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        showSlide(index) {
            // Wrap around
            if (index >= this.totalSlides) {
                this.currentIndex = 0;
            } else if (index < 0) {
                this.currentIndex = this.totalSlides - 1;
            } else {
                this.currentIndex = index;
            }
            
            // Move slides
            const offset = -this.currentIndex * 100;
            this.slides.style.transform = `translateX(${offset}%)`;
            
            // Update dots
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
        
        nextSlide() {
            this.showSlide(this.currentIndex + 1);
        }
        
        prevSlide() {
            this.showSlide(this.currentIndex - 1);
        }
        
        startAutoplay() {
            this.stopAutoplay(); // Clear any existing interval
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000); // Change slide every 5 seconds
        }
        
        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }
        
        isInViewport() {
            const rect = this.slider.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        addSwipeSupport() {
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            this.slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
            
            const handleSwipe = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            };
            
            this.handleSwipe = handleSwipe;
        }
    }
    
    // Initialize all sliders
    const sliders = document.querySelectorAll('.project-slider');
    sliders.forEach(slider => new ProjectSlider(slider));
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .contact-method, .social-link');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ============================================
    // SCROLL TO TOP
    // ============================================
    
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--color-accent-cyan);
            color: var(--color-bg-primary);
            border: 2px solid var(--color-accent-cyan);
            border-radius: 4px;
            font-size: 1.5rem;
            font-weight: bold;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0, 240, 255, 0.4);
        }
        
        @media (max-width: 640px) {
            .scroll-to-top {
                bottom: 1rem;
                right: 1rem;
                width: 45px;
                height: 45px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ============================================
    // TYPING EFFECT (Optional)
    // ============================================
    
    const roleElement = document.querySelector('.hero-role');
    if (roleElement) {
        const roles = [
            roleElement.textContent,
            'Web Developer',
            'Problem Solver',
            'Code Enthusiast'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function typeRole() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                roleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                roleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500;
            }
            
            setTimeout(typeRole, typingSpeed);
        }
        
        // Uncomment to enable typing effect
        // setTimeout(typeRole, 1000);
    }
    
    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    
    console.log('%c👨‍💻 Portfolio Website', 'font-size: 20px; font-weight: bold; color: #00f0ff;');
    console.log('%cBuilt with ❤️ using PHP, CSS, and JavaScript', 'font-size: 14px; color: #a855f7;');
    console.log('%cInterested in working together? Let\'s connect!', 'font-size: 12px; color: #6b6b6b;');
    
});