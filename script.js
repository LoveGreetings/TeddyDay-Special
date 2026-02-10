// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCounter();
    initializeHearts();
    initializeParticles();
});

// Initialize animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function initializeAnimations() {
    const elements = document.querySelectorAll('.story-card, .gallery-item, .message-card');
    elements.forEach(el => observer.observe(el));
}

// Days Counter
function initializeCounter() {
    // Set your special day here (format: new Date(year, month-1, day))
    const startDate = new Date(2024, 0, 1); // January 1, 2024
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const counterElement = document.getElementById('counter');
    counterElement.textContent = diffDays + ' Days';
    
    // Animate the counter
    animateCounter(counterElement, 0, diffDays);
}

function animateCounter(element, start, end) {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * easeOutQuad(progress));
        element.textContent = current + ' Days';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// Message Navigation
let currentMessage = 1;

function goToMessage(num) {
    const messages = document.querySelectorAll('.message-card');
    messages.forEach(msg => msg.classList.remove('active'));
    
    const selectedMessage = document.querySelector(`.message-card[data-message="${num}"]`);
    if (selectedMessage) {
        selectedMessage.classList.add('active');
        currentMessage = num;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index + 1 === num) {
                dot.classList.add('active');
            }
        });
    }
}

function nextMessage() {
    const messageCount = document.querySelectorAll('.message-card').length;
    currentMessage = currentMessage >= messageCount ? 1 : currentMessage + 1;
    goToMessage(currentMessage);
}

function previousMessage() {
    const messageCount = document.querySelectorAll('.message-card').length;
    currentMessage = currentMessage <= 1 ? messageCount : currentMessage - 1;
    goToMessage(currentMessage);
}

// Smooth scroll
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Interactive Hearts
function initializeHearts() {
    const heartContainer = document.getElementById('heartContainer');
    
    heartContainer.addEventListener('click', function(e) {
        const rect = heartContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        createFloatingHeart(x, y, heartContainer);
    });
    
    heartContainer.addEventListener('mousemove', function(e) {
        if (e.buttons === 1) { // Left mouse button is pressed
            const rect = heartContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (Math.random() > 0.7) { // Create hearts randomly while dragging
                createFloatingHeart(x, y, heartContainer);
            }
        }
    });
}

function createFloatingHeart(x, y, container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    container.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Floating particles in background
function initializeParticles() {
    const floatingHeartsSection = document.querySelector('.floating-hearts');
    
    // Create floating hearts/particles
    setInterval(() => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = -10 + 'px';
        particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        
        const symbols = ['💕', '💖', '✨', '🌟', '⭐'];
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        particle.style.animation = `floatDown ${Math.random() * 3 + 2}s ease-in forwards`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }, 500);
}

// Add floating animation to style
const style = document.createElement('style');
style.textContent = `
    @keyframes floatDown {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.6;
        }
        100% {
            transform: translateY(100vh) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        nextMessage();
    } else if (e.key === 'ArrowLeft') {
        previousMessage();
    }
});

// Parallax effect on scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero, .background');
    
    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});

// Add love message on page load
window.addEventListener('load', function() {
    console.log('%c💕 Happy Teddy Day! 💕', 'color: #ff1493; font-size: 20px; font-weight: bold;');
    console.log('%cThis website was made with love for the most wonderful person in the world!', 'color: #ff69b4; font-size: 14px;');
});

// Gallery hover effects
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const emotion = this.getAttribute('data-emotion');
        showEmotionMessage(emotion);
    });
});

function showEmotionMessage(emotion) {
    const messages = {
        happy: '😊 Every moment with you makes me happy!',
        love: '❤️ My love for you grows every single day!',
        adventure: '🌍 I want to explore the world with you!',
        cuddles: '🤗 I love cuddling with you!',
        laugh: '😄 Your laughter is my favorite sound!',
        future: '✨ Our future together is going to be amazing!'
    };
    
    alert(messages[emotion]);
}

// Confetti effect on special moments
function throwConfetti() {
    const confettiPieces = 50;
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = ['💕', '💖', '✨', '🧸'][Math.floor(Math.random() * 4)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.fontSize = Math.random() * 20 + 15 + 'px';
        confetti.style.opacity = Math.random() * 0.5 + 0.3;
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s ease-in forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add fall animation
const fallStyle = document.createElement('style');
fallStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(fallStyle);

// Trigger confetti on button click
const primaryBtn = document.querySelector('.btn-primary');
if (primaryBtn) {
    primaryBtn.addEventListener('click', throwConfetti);
}

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swiped left
        nextMessage();
    }
    if (touchEndX > touchStartX + 50) {
        // Swiped right
        previousMessage();
    }
}

// Create a message when the page loads
window.addEventListener('load', function() {
    // You can add a celebratory message here
    setTimeout(() => {
        createFloatingHeart(window.innerWidth / 2, window.innerHeight / 2, document.body);
    }, 500);
});

// Add accessibility features
const allButtons = document.querySelectorAll('button, a, .gallery-item, .dot');
allButtons.forEach(btn => {
    btn.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            this.click();
        }
    });
});

// Smooth page transitions
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Page unload animation
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-out';
});
