// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initProductFilters();
    initSearchFunctionality();
    initBlogEngagement();
    initContactForm();
    initScrollIndicator();
    initHeaderScroll();
    initLoadingAnimations();
    initServiceModals();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileToggle.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    const shopButtons = document.querySelectorAll('.shop-btn, .shop-now-btn');

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Check if it's an external link (doesn't start with #)
            if (!targetId.startsWith('#')) {
                // Allow default behavior for external links
                return;
            }
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });

    // Hero buttons
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Shop')) {
                scrollToSection('#recommendations');
            } else if (this.textContent.includes('Story')) {
                scrollToSection('#about');
            }
        });
    });

    // Shop buttons
    shopButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would redirect to shop
            console.log('Redirecting to shop...');
            // For demo purposes, scroll to recommendations
            scrollToSection('#recommendations');
        });
    });
}

function scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Update Active Navigation Link
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('product-card') || 
                    entry.target.classList.contains('blog-card') || 
                    entry.target.classList.contains('service-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-content, .product-card, .blog-card, .service-card, .contact-content'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = '#' + entry.target.id;
                updateActiveNavLink(id);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        navObserver.observe(section);
    });
}

// Product Filters
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Show all products by default
    productCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products with animation
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // If search is empty, reset to current filter
            if (searchTerm === '') {
                const activeFilter = document.querySelector('.filter-btn.active');
                const activeCategory = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
                
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (activeCategory === 'all' || cardCategory === activeCategory) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                return;
            }
            
            // Search through all visible products
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
}

// Blog Engagement
function initBlogEngagement() {
    const likeButtons = document.querySelectorAll('.like-btn');
    const commentButtons = document.querySelectorAll('.comment-btn');
    const shareButtons = document.querySelectorAll('.share-btn');

    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.childNodes[1];
            let count = parseInt(countSpan.textContent.trim());
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ff6b6b';
                count++;
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                count--;
            }
            
            countSpan.textContent = ` ${count}`;
        });
    });

    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would open a comment modal
            console.log('Opening comments...');
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Simple share functionality
            if (navigator.share) {
                navigator.share({
                    title: 'Bridgette Danielle Blog Post',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    // Show feedback
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.style.color = '#4CAF50';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.color = '';
                    }, 2000);
                });
            }
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showFormMessage('Thank you! Your message has been sent.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 10px;
        text-align: center;
        font-weight: 500;
        ${type === 'success' ? 
            'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
            'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    
    const contactForm = document.querySelector('.contact-form');
    contactForm.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Loading Animations
function initLoadingAnimations() {
    // Add loading class to elements that should fade in
    const elementsToLoad = document.querySelectorAll(
        '.hero-content, .section-header, .product-card, .blog-card, .service-card'
    );
    
    elementsToLoad.forEach((element, index) => {
        element.classList.add('loading');
        element.style.animationDelay = `${index * 100}ms`;
    });
}

// Quick View Modal (for product cards)
function initQuickViewModal() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            const productDescription = productCard.querySelector('.product-description').textContent;
            
            // Create modal (simplified version)
            const modal = document.createElement('div');
            modal.className = 'quick-view-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-body">
                        <img src="${productImage}" alt="${productTitle}">
                        <div class="modal-info">
                            <h3>${productTitle}</h3>
                            <p>${productDescription}</p>
                            <button class="btn btn-primary">Shop Now</button>
                        </div>
                    </div>
                </div>
            `;
            
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(modal);
            
            // Fade in modal
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            // Close modal functionality
            const closeModal = modal.querySelector('.close-modal');
            closeModal.addEventListener('click', function() {
                modal.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
            
            // Close on outside click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(modal);
                    }, 300);
                }
            });
        });
    });
}

// Initialize quick view modal after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initQuickViewModal();
});

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffect();
});

// Utility function for debouncing
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Any scroll-based functionality that doesn't need to run on every scroll event
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Add CSS for modal styling
const modalStyles = `
.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}

.close-modal {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 2rem;
    cursor: pointer;
    color: #999;
    z-index: 1;
}

.close-modal:hover {
    color: #333;
}

.modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
}

.modal-body img {
    width: 100%;
    border-radius: 15px;
}

.modal-info h3 {
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.modal-info p {
    margin-bottom: 2rem;
    color: var(--text-light);
    line-height: 1.6;
}

@media (max-width: 768px) {
    .modal-body {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
    }
}
`;

// Inject modal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Service Modals
function initServiceModals() {
    const serviceContactBtns = document.querySelectorAll('.service-contact-btn');
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close');
    const modalServiceText = document.getElementById('modalServiceText');
    const serviceSelect = document.getElementById('serviceSelect');
    
    if (!modal) return;
    
    // Service-specific messages
    const serviceMessages = {
        'affiliate': 'Interested in affiliate and UGC brand collaborations? Let\'s discuss how we can create authentic content that resonates with my audience.',
        'coaching': 'Ready to take your content to the next level? I\'d love to help you develop a strategy that works for your unique brand.',
        'roundups': 'Looking for custom product roundups? Let\'s create curated collections that your audience will love.'
    };
    
    // Open modal when service buttons are clicked
    serviceContactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-service');
            
            // Update modal content based on service
            if (serviceMessages[service]) {
                modalServiceText.textContent = serviceMessages[service];
            }
            
            // Pre-select the service in the dropdown
            if (serviceSelect) {
                serviceSelect.value = service;
            }
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle form submission
    const contactForm = modal.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // In a real implementation, you would send this data to a server
            console.log('Form submitted:', { name, email, service, message });
            
            // Show success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            
            // Close modal and reset form
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.reset();
        });
    }
}