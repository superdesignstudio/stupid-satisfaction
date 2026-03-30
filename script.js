/* ============================================
   STUPID SATISFACTION — INTERACTIONS
   ============================================ */

// --- Custom cursor ---
const cursor = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand cursor on hoverable elements
document.querySelectorAll('a, .person-card, .hero-tag, .hero-letter, .gallery-thumb').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
});

// --- Hero letters: scatter on mouse proximity ---
const heroLetters = document.querySelectorAll('.hero-letter');

document.addEventListener('mousemove', (e) => {
  heroLetters.forEach(letter => {
    const rect = letter.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX * distX + distY * distY);
    const maxDist = 200;

    if (dist < maxDist) {
      const speed = parseFloat(letter.dataset.speed) || 0.04;
      const force = (1 - dist / maxDist) * 30;
      const moveX = -(distX / dist) * force * speed * 8;
      const moveY = -(distY / dist) * force * speed * 8;
      const rotate = (distX / dist) * force * speed * 3;
      letter.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
    } else {
      letter.style.transform = 'translate(0, 0) rotate(0deg)';
    }
  });
});

// --- Aggressive glitch system ---
const line1Letters = document.querySelectorAll('.hero-line-1 .hero-letter');
const line2Letters = document.querySelectorAll('.hero-line-2 .hero-letter');
const allHeroLetters = [...line1Letters, ...line2Letters];
const heroTitle = document.querySelector('.hero-title');

// Single letter glitch — frequent
function glitchSingleLetter() {
  const letter = allHeroLetters[Math.floor(Math.random() * allHeroLetters.length)];
  const originalColor = letter.style.color || '';
  const originalFilter = letter.style.filter || '';

  const effects = [
    // Color flash white
    () => { letter.style.color = 'var(--white)'; },
    // Color flash blue (chromatic)
    () => { letter.style.color = 'var(--blue)'; },
    // Blur
    () => { letter.style.filter = 'blur(2px)'; },
    // Invert
    () => { letter.style.filter = 'invert(1)'; },
    // Opacity flicker
    () => { letter.style.opacity = '0'; },
  ];

  const effect = effects[Math.floor(Math.random() * effects.length)];
  letter.style.transform = `translate(${(Math.random() - 0.5) * 12}px, ${(Math.random() - 0.5) * 8}px) skewX(${(Math.random() - 0.5) * 20}deg)`;
  effect();

  setTimeout(() => {
    letter.style.color = originalColor;
    letter.style.filter = originalFilter;
    letter.style.opacity = '';
    letter.style.transform = 'translate(0, 0) skewX(0deg)';
  }, 80 + Math.random() * 80);
}

// Burst glitch — hits 3-5 letters at once
function glitchBurst() {
  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    setTimeout(() => glitchSingleLetter(), i * 30);
  }
}

// Full line shift — whole line jumps
function glitchLineShift() {
  const line = Math.random() > 0.5 ? document.querySelector('.hero-line-1') : document.querySelector('.hero-line-2');
  const shiftX = (Math.random() - 0.5) * 20;
  const skew = (Math.random() - 0.5) * 5;

  line.style.transition = 'none';
  line.style.transform = `translateX(${shiftX}px) skewX(${skew}deg)`;
  line.style.textShadow = `${-shiftX * 0.3}px 0 var(--blue), ${shiftX * 0.3}px 0 var(--red)`;

  setTimeout(() => {
    line.style.transition = 'transform 0.15s, text-shadow 0.15s';
    line.style.transform = '';
    line.style.textShadow = '';
  }, 60 + Math.random() * 60);
}

// Flicker — whole title blinks
function glitchFlicker() {
  heroTitle.style.opacity = '0.1';
  setTimeout(() => { heroTitle.style.opacity = '1'; }, 40);
  setTimeout(() => { heroTitle.style.opacity = '0.3'; }, 80);
  setTimeout(() => { heroTitle.style.opacity = '1'; }, 120);
}

// Schedule glitches — spaced out so orange dominates
setInterval(glitchSingleLetter, 3000);
setInterval(glitchBurst, 8000);
setInterval(glitchLineShift, 12000);
setInterval(glitchFlicker, 20000);

// Rare extra chaos
setInterval(() => {
  if (Math.random() > 0.8) {
    glitchBurst();
    glitchLineShift();
  }
}, 15000);

// --- Hero: live coordinate display ---
const heroCoord = document.getElementById('heroCoord');
if (heroCoord) {
  document.addEventListener('mousemove', (e) => {
    const x = String(e.clientX).padStart(4, '0');
    const y = String(e.clientY).padStart(4, '0');
    heroCoord.textContent = `X:${x} Y:${y}`;
  });
}

// --- Hero: live clock ---
const heroTime = document.getElementById('heroTime');
if (heroTime) {
  function updateTime() {
    const now = new Date();
    heroTime.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// --- Scroll reveal ---
const revealElements = [
  ...document.querySelectorAll('.section-label'),
  ...document.querySelectorAll('.project-image-container'),
  ...document.querySelectorAll('.project-info'),
  ...document.querySelectorAll('.manifesto-text'),
  ...document.querySelectorAll('.person-card'),
  ...document.querySelectorAll('.contact-strip'),
];

revealElements.forEach(el => el.classList.add('reveal'));

// Stagger person cards
const personCards = document.querySelectorAll('.person-card');
personCards.forEach((card, i) => {
  card.classList.add('reveal-skew');
  card.style.transitionDelay = `${i * 0.15}s`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-skew').forEach(el => observer.observe(el));

// --- Section label text rotation on scroll ---
const sectionLabels = document.querySelectorAll('.label-text');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  sectionLabels.forEach(label => {
    const rect = label.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = (window.innerHeight - rect.top) / window.innerHeight;
      label.style.transform = `rotate(-90deg) translateX(${progress * 10}px)`;
    }
  });
});

// --- "More coming" marquee speed on scroll ---
const moreComing = document.querySelector('.more-coming');
if (moreComing) {
  window.addEventListener('scroll', () => {
    const rect = moreComing.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = 1 - rect.top / window.innerHeight;
      moreComing.style.setProperty('--marquee-speed', `${15 - progress * 10}s`);
    }
  });
}

// --- Footer scroll position ---
const footerScroll = document.getElementById('footerScroll');
if (footerScroll) {
  window.addEventListener('scroll', () => {
    footerScroll.textContent = `SCROLL_POS: ${Math.round(window.scrollY)}`;
  });
}

// --- Easter egg: Konami code shows a flash ---
let konamiProgress = 0;
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
  if (e.keyCode === konamiCode[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === konamiCode.length) {
      konamiProgress = 0;
      document.body.style.transition = 'background 0.1s';
      document.body.style.background = 'var(--red)';
      setTimeout(() => {
        document.body.style.background = 'var(--black)';
      }, 150);
      setTimeout(() => {
        document.body.style.background = 'var(--yellow)';
      }, 300);
      setTimeout(() => {
        document.body.style.background = 'var(--black)';
        document.body.style.transition = '';
      }, 450);
    }
  } else {
    konamiProgress = 0;
  }
});

// --- Smooth scroll for potential nav links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Image gallery ---
const galleryImgs = document.querySelectorAll('.gallery-img');
const galleryThumbs = document.querySelectorAll('.gallery-thumb, .gallery-btn');
const galleryCounter = document.querySelector('.gallery-current') || document.querySelector('#galleryNum');

if (galleryImgs.length && galleryThumbs.length) {
  let currentSlide = 0;
  let autoplayInterval;

  function goToSlide(index) {
    galleryImgs.forEach(img => img.classList.remove('active'));
    galleryThumbs.forEach(thumb => thumb.classList.remove('active'));
    galleryImgs[index].classList.add('active');
    galleryThumbs[index].classList.add('active');
    if (galleryCounter) {
      galleryCounter.textContent = String(index + 1).padStart(2, '0');
    }
    currentSlide = index;
  }

  galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      goToSlide(parseInt(thumb.dataset.index));
      resetAutoplay();
    });
    thumb.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    thumb.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });

  // Click on main image to advance
  const galleryMain = document.querySelector('.gallery-main') || document.querySelector('#galleryFrame');
  if (galleryMain) {
    galleryMain.addEventListener('click', () => {
      goToSlide((currentSlide + 1) % galleryImgs.length);
      resetAutoplay();
    });
  }

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % galleryImgs.length);
    }, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();
}
