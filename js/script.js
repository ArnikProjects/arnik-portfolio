/* ============================================
   ARNIK Portfolio - JavaScript Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initPageAnimations();
    initDropdown();
    initAccordion();
    initCopyToClipboard();
    initDiscordButton();
    initSmoothScroll();
    initImageModal();
});

/* ============================================
   Page Entrance Animations
   ============================================ */

function initPageAnimations() {
    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) {
        pageWrapper.style.opacity = '0';
        pageWrapper.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            pageWrapper.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
            pageWrapper.style.opacity = '1';
            pageWrapper.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate fade-in-up elements
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1 + 0.2}s`;
    });
}

/* ============================================
   Dropdown Toggle Animation
   ============================================ */

function initDropdown() {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (!dropdownBtn || !dropdownMenu) return;
    
    let isOpen = false;
    
    dropdownBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        
        if (isOpen) {
            dropdownBtn.classList.add('active');
            dropdownMenu.classList.add('open');
        } else {
            dropdownBtn.classList.remove('active');
            dropdownMenu.classList.remove('open');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container') && isOpen) {
            dropdownBtn.classList.remove('active');
            dropdownMenu.classList.remove('open');
            isOpen = false;
        }
    });
    
    // Close dropdown when clicking on an item
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownBtn.classList.remove('active');
            dropdownMenu.classList.remove('open');
            isOpen = false;
        });
    });
}

/* ============================================
   Accordion Logic (Only One Open at a Time)
   ============================================ */

function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length === 0) return;
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.classList.contains('active');
            
            // Close all other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    const otherContent = otherHeader.nextElementSibling;
                    if (otherContent) {
                        otherContent.classList.remove('open');
                    }
                }
            });
            
            // Toggle current accordion
            if (isOpen) {
                header.classList.remove('active');
                content.classList.remove('open');
            } else {
                header.classList.add('active');
                content.classList.add('open');
                
                // Smooth scroll to the opened accordion
                setTimeout(() => {
                    header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
}

/* ============================================
   Copy to Clipboard Functionality
   ============================================ */

function initCopyToClipboard() {
    const copyBoxes = document.querySelectorAll('.copy-box, .voltscape-ip-copy');
    
    copyBoxes.forEach(box => {
        box.addEventListener('click', async () => {
            const textToCopy = box.getAttribute('data-copy');
            const tooltip = box.querySelector('.copy-tooltip');
            
            if (!textToCopy) return;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Show tooltip
                if (tooltip) {
                    tooltip.classList.add('show');
                    
                    // Hide tooltip after 2 seconds
                    setTimeout(() => {
                        tooltip.classList.remove('show');
                    }, 2000);
                }
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    if (tooltip) {
                        tooltip.classList.add('show');
                        setTimeout(() => {
                            tooltip.classList.remove('show');
                        }, 2000);
                    }
                } catch (e) {
                    console.error('Copy failed:', e);
                }
                
                document.body.removeChild(textArea);
            }
        });
    });
}

/* ============================================
   Discord Button with Fallback
   ============================================ */

function initDiscordButton() {
    const discordBtns = document.querySelectorAll('.discord-btn');
    
    discordBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Try to open Discord app
            const discordAppUrl = 'discord://';
            const discordWebUrl = 'https://discord.com/app';
            
            // Create an iframe or use window.location to test
            const start = Date.now();
            
            // Attempt to open Discord app
            const discordWindow = window.open(discordAppUrl, '_blank');
            
            // If the app is not installed, fallback to web version
            setTimeout(() => {
                // Check if the window was blocked or if Discord app didn't open
                if (!discordWindow || discordWindow.closed || Date.now() - start < 1000) {
                    window.open(discordWebUrl, '_blank');
                }
            }, 500);
        });
    });
}

/* ============================================
   Smooth Scroll to Contact Section
   ============================================ */

function initSmoothScroll() {
    // Handle smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                smoothScrollTo(target);
            }
        });
    });
}

// Custom smooth scroll function for better control
function smoothScrollTo(element, duration = 800) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function - ease-in-out
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for performance
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

// Throttle function for scroll events
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

/* ============================================
   Hire Me Button Handler
   ============================================ */

function openGmailCompose() {
    const email = 'arnikgamer95@gmail.com';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    window.open(gmailUrl, '_blank');
}

// Attach to window for onclick handlers
window.openGmailCompose = openGmailCompose;

/* ============================================
   Image Modal / Lightbox Functionality
   ============================================ */

function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalCurrent = document.getElementById('modalCurrent');
    const modalTotal = document.getElementById('modalTotal');
    const galleryItems = document.querySelectorAll('.gui-gallery-item');
    
    if (!modal || galleryItems.length === 0) return;
    
    // Group images by gallery
    const galleries = {};
    galleryItems.forEach(item => {
        const galleryName = item.getAttribute('data-gallery') || 'default';
        if (!galleries[galleryName]) {
            galleries[galleryName] = [];
        }
        galleries[galleryName].push(item.querySelector('img').src);
    });
    
    let currentGallery = 'default';
    let currentIndex = 0;
    
    // Open modal with specific image
    function openModal(index, galleryName = 'default') {
        currentGallery = galleryName;
        currentIndex = index;
        const images = galleries[currentGallery] || galleries[Object.keys(galleries)[0]];
        
        if (modalTotal) {
            modalTotal.textContent = images.length;
        }
        
        updateModalImage();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Update modal image
    function updateModalImage() {
        const images = galleries[currentGallery] || galleries[Object.keys(galleries)[0]];
        if (modalImage && images[currentIndex]) {
            modalImage.src = images[currentIndex];
        }
        if (modalCurrent) {
            modalCurrent.textContent = currentIndex + 1;
        }
    }
    
    // Navigate to previous image
    function prevImage() {
        const images = galleries[currentGallery] || galleries[Object.keys(galleries)[0]];
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateModalImage();
    }
    
    // Navigate to next image
    function nextImage() {
        const images = galleries[currentGallery] || galleries[Object.keys(galleries)[0]];
        currentIndex = (currentIndex + 1) % images.length;
        updateModalImage();
    }
    
    // Event listeners for gallery items
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const galleryName = item.getAttribute('data-gallery') || 'default';
            const idx = parseInt(item.getAttribute('data-index')) || 0;
            openModal(idx, galleryName);
        });
    });
    
    // Close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Navigation buttons
    if (modalPrev) {
        modalPrev.addEventListener('click', prevImage);
    }
    if (modalNext) {
        modalNext.addEventListener('click', nextImage);
    }
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }
}