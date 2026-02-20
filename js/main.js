/**
 * SABRI NATURO - Main JavaScript
 * Handles navigation, animations, and interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initAnimations();
    initVideoFeed();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav__toggle');
    const nav = document.querySelector('.nav');
    
    // Mobile menu toggle
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
            navToggle.classList.toggle('nav__toggle--active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu when clicking a link
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                navToggle.classList.remove('nav__toggle--active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    // Header scroll effect
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // Active link highlighting
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav__link').forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('nav__link--active');
        }
    });
}

/**
 * Scroll-based effects
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Intersection Observer for animations
 */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Add stagger animation to children if needed
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('is-visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Video Feed from Social Networks
 */
function initVideoFeed() {
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) return;
    
    // Load videos from configuration
    loadVideos();
}

/**
 * Load videos from JSON configuration
 */
async function loadVideos() {
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) return;
    
    try {
        const response = await fetch('data/videos.json');
        const data = await response.json();
        
        if (data.videos && data.videos.length > 0) {
            renderVideos(data.videos, videoGrid);
        }
    } catch (error) {
        console.log('Videos configuration not found, using placeholder');
        // Render placeholder if no config
        renderPlaceholderVideos(videoGrid);
    }
}

/**
 * Render videos in the grid
 */
function renderVideos(videos, container) {
    container.innerHTML = '';
    
    videos.slice(0, 8).forEach(video => {
        const card = createVideoCard(video);
        container.appendChild(card);
    });
}

/**
 * Create a video card element
 */
function createVideoCard(video) {
    const card = document.createElement('a');
    card.className = 'video-card';
    card.href = video.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    
    const platformIcons = {
        instagram: '📷',
        tiktok: '🎵',
        youtube: '▶️',
        facebook: '📘'
    };
    
    card.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
        <div class="video-card__overlay">
            <span class="video-card__platform">${platformIcons[video.platform] || '🎬'}</span>
            <span class="video-card__title">${video.title}</span>
        </div>
        <div class="video-card__play">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        </div>
    `;
    
    return card;
}

/**
 * Render placeholder videos
 */
function renderPlaceholderVideos(container) {
    const placeholders = [
        { title: 'Routine Yoga Matinale', platform: 'instagram' },
        { title: 'Conseil Naturo #1', platform: 'tiktok' },
        { title: 'Méditation Guidée', platform: 'youtube' },
        { title: 'Live Q&A', platform: 'facebook' }
    ];
    
    container.innerHTML = '';
    
    placeholders.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card video-card--placeholder';
        card.innerHTML = `
            <div class="video-card__overlay">
                <span class="video-card__platform">${getPlatformIcon(video.platform)}</span>
                <span class="video-card__title">${video.title}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function getPlatformIcon(platform) {
    const icons = {
        instagram: '📷',
        tiktok: '🎵',
        youtube: '▶️',
        facebook: '📘'
    };
    return icons[platform] || '🎬';
}

/**
 * Form validation helper
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-error');
        } else {
            field.classList.remove('is-error');
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.classList.add('is-error');
        }
    }
    
    return isValid;
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
