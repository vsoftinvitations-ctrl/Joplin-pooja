/**
 * ============================================================================
 * 3D ROLLING GALLERY (Pure Images & Scroll-Driven)
 * ============================================================================
 * No background blur, no buttons - pure images rolling in and out in 3D as
 * the user scrolls through the gallery section.
 */

export const GALLERY_ITEMS = [
  {
    src: "/assets/gllry.png",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry1.jpeg",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry2.jpeg",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry3.jpeg",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry4.jpeg",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry5.jpeg",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry6.jpeg",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry7.jpeg",
    alt: "Jorlin & Pooja"
  },
  {
    src: "/assets/gllry8.jpeg",
    alt: "Jorlin & Pooja"
  }
];

export function renderRollingGallery() {
  const cardsHtml = GALLERY_ITEMS.map((item, index) => {
    return `
      <div class="rolling-card ${index === 0 ? 'active' : ''}" data-index="${index}">
        <div class="rolling-card-inner">
          <img src="${item.src}" alt="${item.alt}" class="rolling-photo photo-${index}" loading="lazy" decoding="async" />
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="gallery-scroll-section" id="rolling-gallery-section">
      <div class="gallery-scroll-track" id="rolling-gallery-track">
        <div class="gallery-sticky-viewport">
          <div class="wrap" style="max-width: 640px; width: 100%;">
            <p class="label r">Moments of Love</p>
            <h2 class="serif r rolling-gallery-title">Our Story in Frames</h2>
            
            <div class="rolling-stage-container r">
              <div class="rolling-stage" id="rolling-stage">
                ${cardsHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initRollingGallery() {
  const track = document.getElementById('rolling-gallery-track');
  const stage = document.getElementById('rolling-stage');
  const cards = document.querySelectorAll('.rolling-card');

  if (!track || !stage || cards.length === 0) return;

  let currentIndex = 0;
  const total = cards.length;
  let isProgrammaticScroll = false;

  // Set comfortable scroll runway: ~80vh per photo
  track.style.height = `${Math.max(total * 80, 240)}vh`;

  function updateActiveCard(newIndex) {
    if (newIndex < 0 || newIndex >= total) return;
    if (newIndex === currentIndex) return;

    cards.forEach((card, i) => {
      card.classList.remove('active', 'rolled-out', 'rolled-back');
      if (i === newIndex) {
        card.classList.add('active');
      } else if (i < newIndex) {
        card.classList.add('rolled-out');
      } else {
        card.classList.add('rolled-back');
      }
    });

    currentIndex = newIndex;
  }

  // 1. Scroll-Driven Progression
  let ticking = false;
  function handleScroll() {
    if (isProgrammaticScroll) return;

    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrolled = -rect.top;
    const maxScroll = trackHeight - windowHeight;

    if (maxScroll <= 0) return;

    const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

    // Target index across scroll progress
    let targetIndex = Math.min(Math.floor(progress * total), total - 1);

    if (targetIndex !== currentIndex) {
      updateActiveCard(targetIndex);
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 2. Mobile Touch Swipe Support
  let touchStartX = 0;
  let touchStartY = 0;
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0 && currentIndex < total - 1) {
          scrollToCard(currentIndex + 1);
        } else if (deltaX > 0 && currentIndex > 0) {
          scrollToCard(currentIndex - 1);
        }
      }
    }
  }, { passive: true });

  function scrollToCard(targetIndex) {
    updateActiveCard(targetIndex);

    const rect = track.getBoundingClientRect();
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const trackTop = currentScrollY + rect.top;
    const trackHeight = track.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = trackHeight - windowHeight;

    if (maxScroll > 0) {
      isProgrammaticScroll = true;
      const targetScroll = trackTop + (targetIndex / (total - 1)) * maxScroll;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 700);
    }
  }
}
