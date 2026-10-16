// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(hamburger.classList.contains('active')));
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        navbar.style.backdropFilter = 'none';
    }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!this.reportValidity()) return;
        const values = new FormData(this);
        const subject = `Website enquiry from ${values.get('name')}`;
        const body = `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nPhone: ${values.get('phone') || 'Not provided'}\n\n${values.get('message')}`;
        window.location.href = `mailto:mirriamgitau00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

// Product card animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all product cards
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Counter animation for features (if needed in future)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Add hover effect to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add image loading error handling for product images
document.querySelectorAll('.product-image img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        this.parentElement.innerHTML = '<i class="fas fa-car" style="font-size: 4rem; color: #e94560;"></i>';
        this.parentElement.style.display = 'flex';
        this.parentElement.style.alignItems = 'center';
        this.parentElement.style.justifyContent = 'center';
    });
});

// Handle logo image loading
document.querySelectorAll('.logo-icon img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        this.parentElement.style.background = 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)';
        this.parentElement.innerHTML = '<i class="fas fa-car" style="color: white; font-size: 1.5rem;"></i>';
    });
});

// Handle hero background image loading
const heroBackground = document.querySelector('.hero-background img');
if (heroBackground) {
    heroBackground.addEventListener('error', function() {
        this.parentElement.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
        this.style.display = 'none';
    });
}

// Handle about section image loading
const aboutImage = document.querySelector('.about-illustration img');
if (aboutImage) {
    aboutImage.addEventListener('error', function() {
        this.parentElement.innerHTML = '<i class="fas fa-cogs" style="font-size: 8rem; color: #e94560;"></i>';
    });
}

// Handle UNIQUE OUTLOOK image loading
const outlookImage = document.querySelector('.outlook-illustration img');
if (outlookImage) {
    outlookImage.addEventListener('error', function() {
        this.parentElement.innerHTML = '<h2 style="margin: 0; letter-spacing: 5px; background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);">UNIQUE OUTLOOK</h2>';
        this.parentElement.style.width = 'auto';
        this.parentElement.style.height = 'auto';
    });
}

// Handle background image loading error
window.addEventListener('load', function() {
    const testImage = new Image();
    testImage.src = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&h=1080&fit=crop';
    
    testImage.addEventListener('error', function() {
        document.body.classList.add('no-background-image');
    });
});

// Dynamic year in footer
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} UNIQUE AUTO SPARES. All rights reserved.`;
}

// Homepage product search functionality
const homeSearchInput = document.querySelector('#homeProductSearch');
const clearHomeSearchButton = document.querySelector('#clearHomeSearch');

if (homeSearchInput && clearHomeSearchButton) {
    homeSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const matches = cardText.includes(searchTerm);
            card.style.display = matches ? 'block' : 'none';
        });

        // Update results count if it exists
        const visibleCount = Array.from(productCards).filter(card => card.style.display !== 'none').length;
        const totalCount = productCards.length;

        if (searchTerm && visibleCount === 0) {
            let noResults = document.querySelector('.no-home-results');
            if (!noResults) {
                noResults = document.createElement('p');
                noResults.className = 'no-home-results';
                noResults.style.color = '#fbbf24';
                noResults.style.textAlign = 'center';
                noResults.style.marginTop = '1rem';
                document.querySelector('.products-grid').after(noResults);
            }
            noResults.textContent = 'No products match your search. Try different keywords or browse all products.';
        } else {
            const noResults = document.querySelector('.no-home-results');
            if (noResults) noResults.remove();
        }
    });

    clearHomeSearchButton.addEventListener('click', function() {
        homeSearchInput.value = '';
        homeSearchInput.dispatchEvent(new Event('input'));
        homeSearchInput.focus();
    });

    // Add keyboard support for Escape key
    homeSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            homeSearchInput.value = '';
            homeSearchInput.dispatchEvent(new Event('input'));
        }
    });
}
