// Navigation scroll effect
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards, why cards, steps, and FAQ items
document.querySelectorAll('.feature-card, .why__card, .step, .faq__item').forEach(el => {
    observer.observe(el);
});

// Screenshots carousel
const screenshotsTrack = document.getElementById('screenshotsTrack');
const screenshotsDots = document.querySelectorAll('.screenshots__dot');
const slides = screenshotsTrack ? screenshotsTrack.querySelectorAll('.screenshots__slide') : [];

function getActiveSlide() {
    const trackRect = screenshotsTrack.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let minDist = Infinity;
    slides.forEach((slide, i) => {
        const rect = slide.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - center);
        if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
}

function scrollToSlide(i) {
    if (slides[i]) {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

if (screenshotsTrack && slides.length) {
    // Dots
    screenshotsDots.forEach((dot, i) => {
        dot.addEventListener('click', () => scrollToSlide(i));
    });

    // Arrows
    document.getElementById('screenshotsPrev').addEventListener('click', () => {
        scrollToSlide(Math.max(0, getActiveSlide() - 1));
    });
    document.getElementById('screenshotsNext').addEventListener('click', () => {
        scrollToSlide(Math.min(slides.length - 1, getActiveSlide() + 1));
    });

    // Update dots on scroll
    let scrollTimeout;
    screenshotsTrack.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const active = getActiveSlide();
            screenshotsDots.forEach((d, i) => {
                d.classList.toggle('screenshots__dot--active', i === active);
            });
        }, 50);
    });

    // Click slide → open lightbox
    slides.forEach((slide) => {
        slide.addEventListener('click', () => {
            const img = slide.querySelector('img');
            openLightbox(img.src, img.alt);
        });
    });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxIndex = 0;

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Find index
    slides.forEach((s, i) => {
        if (s.querySelector('img').src === src) lightboxIndex = i;
    });
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxNav(dir) {
    lightboxIndex = Math.max(0, Math.min(slides.length - 1, lightboxIndex + dir));
    const img = slides[lightboxIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
}

if (lightbox) {
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => lightboxNav(-1));
    document.getElementById('lightboxNext').addEventListener('click', () => lightboxNav(1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'ArrowRight') lightboxNav(1);
    });
}

// Smooth scroll for anchor links (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
