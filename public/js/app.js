// Extraordinary UX JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    // Responsive parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (!isMobile) { // Disable parallax on mobile for performance
            document.body.style.setProperty('--scroll', scrolled * 0.5 + 'px');
        }
    });

    // Responsive magnetic effect for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!isMobile) { // Only on desktop
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        }
    });

    // Responsive movie card effects
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        if (!isMobile) {
            // Desktop tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        }
        
        // Universal click handler
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn') && !e.target.closest('form')) {
                const detailsLink = this.querySelector('a[href*="/movies/"]');
                if (detailsLink && !detailsLink.href.includes('/edit')) {
                    createRipple(e, this);
                    setTimeout(() => {
                        window.location.href = detailsLink.href;
                    }, isMobile ? 150 : 300); // Faster on mobile
                }
            }
        });
    });

    // Ripple effect function
    function createRipple(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple ${isMobile ? '0.4s' : '0.6s'} ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), isMobile ? 400 : 600);
    }

    // Add ripple animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Smooth form interactions
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
    });

    // Checkbox animations
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.animation = 'checkboxPop 0.3s ease-out';
            }
            setTimeout(() => {
                label.style.animation = '';
            }, 300);
        });
    });

    // Add checkbox animation to CSS
    const checkboxStyle = document.createElement('style');
    checkboxStyle.textContent = `
        @keyframes checkboxPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1.02); }
        }
    `;
    document.head.appendChild(checkboxStyle);

    // Loading states with enhanced animations
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                submitBtn.style.background = 'linear-gradient(135deg, #B8860B, #8B7355)';
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all movie cards
    movieCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });

    // Enhanced responsive navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only hide navbar on mobile when scrolling down
        if (isMobile && scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        // Responsive blur effect
        const blurAmount = Math.min(scrollTop / (isMobile ? 5 : 10), isMobile ? 15 : 25);
        navbar.style.backdropFilter = `blur(${blurAmount}px) saturate(180%)`;
        
        lastScrollTop = scrollTop;
    });

    // Particle effect on hover for special elements
    function createParticles(element) {
        const particles = [];
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-gold);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
            `;
            document.body.appendChild(particle);
            particles.push(particle);
        }
        
        element.addEventListener('mouseenter', (e) => {
            particles.forEach((particle, index) => {
                const rect = element.getBoundingClientRect();
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = '1';
                particle.style.animation = `particleFloat 2s ease-out ${index * 0.1}s forwards`;
            });
        });
    }

    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(0) scale(0);
                opacity: 1;
            }
            100% {
                transform: translateY(-50px) scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // Apply particle effect to special elements
    const specialElements = document.querySelectorAll('.navbar-brand, .page-title');
    specialElements.forEach(createParticles);

    // Keyboard shortcuts with visual feedback
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showToast('Search feature coming soon!', 'info');
        }
        
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => {
                modal.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => modal.remove(), 300);
            });
        }
    });

    // Enhanced toast notifications
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(42, 42, 42, 0.9));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 15px;
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            animation: slideInToast 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            z-index: 10000;
            max-width: 350px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutToast 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // Add toast animations
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes slideInToast {
            to { transform: translateX(0); }
        }
        @keyframes slideOutToast {
            to { transform: translateX(400px); }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: scale(0.9); }
        }
    `;
    document.head.appendChild(toastStyle);

    // Responsive window resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate mobile state
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                location.reload(); // Reload to apply correct responsive behavior
            }
        }, 250);
    });

    // Touch-friendly interactions for mobile
    if (isMobile) {
        // Add touch feedback
        movieCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
        
        // Prevent hover states on mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .movie-card:hover,
                .btn:hover,
                .nav-link:hover,
                .badge:hover {
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add smooth transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }

    // Initialize everything
    console.log(`🎬 Cinémathèque initialized for ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'} device!`);
});
