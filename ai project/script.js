// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Card hover effects with mouse position tracking
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Button click effect
document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Page load animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});