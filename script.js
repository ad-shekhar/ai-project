// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Card hover effects with mouse position tracking
document.querySelectorAll('.game-card').forEach(card => {
    let timeoutId;
    
    card.addEventListener('mousemove', (e) => {
        if (timeoutId) clearTimeout(timeoutId);
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;

        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });
    });

    card.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            
            // Reset transition after animation
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        }, 100);
    });
});

// Button click effect with ripple
document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - radius;
        const y = e.clientY - rect.top - radius;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});

// Page load animation with staggered reveal
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.game-card');
    const title = document.querySelector('.title');
    
    // Animate title first
    title.style.opacity = '0';
    title.style.transform = 'translateY(-20px)';
    
    requestAnimationFrame(() => {
        title.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    });
    
    // Then animate cards with stagger
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 200 + (100 * index)); // Increased initial delay for title to finish
    });
});

// Prevent default on play button clicks to handle navigation
document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const href = button.getAttribute('href');
        setTimeout(() => {
            window.location.href = href;
        }, 300); // Delay to allow ripple effect to show
    });
});