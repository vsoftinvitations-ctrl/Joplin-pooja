// ==========================================
// CLIENT DETAILS:
// ==========================================
const NAME_1 = "Jorlin";
const NAME_2 = "Pooja";
const WEDDING_DATE = "Monday, 16 November 2026";
const BG_IMAGE_URL = "/assets/preloder.png";
const BG_MUSIC_URL = "/wedding.mp3";
// ==========================================
let bgAudio = null;
let audioFadeInterval = null;
const TARGET_AUDIO_VOLUME = 0.28; // Soft, elegant ambient background volume

function playMusic() {
  try {
    if (!bgAudio) {
      bgAudio = document.getElementById('wedding-audio') || document.getElementById('bg-music');
      if (!bgAudio) {
        bgAudio = new Audio(BG_MUSIC_URL);
        bgAudio.id = 'bg-music';
        document.body.appendChild(bgAudio);
      }
      bgAudio.loop = true;
      bgAudio.preload = 'auto';
    }

    if (!bgAudio.src || !bgAudio.src.includes('wedding.mp3')) {
      bgAudio.src = BG_MUSIC_URL;
    }

    // If audio is already actively playing, ensure it doesn't exceed target volume
    if (!bgAudio.paused && bgAudio.currentTime > 0) {
      if (bgAudio.volume > TARGET_AUDIO_VOLUME) {
        bgAudio.volume = TARGET_AUDIO_VOLUME;
      }
      return;
    }

    bgAudio.volume = 0.04;
    const promise = bgAudio.play();
    if (promise !== undefined) {
      promise.then(() => {
        let vol = 0.04;
        if (audioFadeInterval) clearInterval(audioFadeInterval);
        audioFadeInterval = setInterval(() => {
          vol = Math.min(TARGET_AUDIO_VOLUME, vol + 0.015);
          if (bgAudio) bgAudio.volume = vol;
          if (vol >= TARGET_AUDIO_VOLUME) {
            clearInterval(audioFadeInterval);
            audioFadeInterval = null;
          }
        }, 120);
      }).catch(() => { });
    }
  } catch (e) { }
}

export function renderPreloader(customConfig = {}) {
  const name1 = customConfig.name1 || customConfig.groom || NAME_1;
  const name2 = customConfig.name2 || customConfig.bride || NAME_2;
  const date = customConfig.date || WEDDING_DATE;
  const bgImg = customConfig.bgImage || BG_IMAGE_URL;

  return `
    <div id="wedding-preloader" class="wedding-preloader" role="dialog" aria-modal="true" aria-label="Wedding Invitation">
      <!-- Fullscreen Background Image -->
      <div class="preloader-bg-media">
        <img src="${bgImg}" alt="${name1} &amp; ${name2}" class="preloader-bg-img" />
        <div class="preloader-overlay"></div>
      </div>

      <!-- Floating Gold Stardust Particles -->
      <div class="preloader-particles" aria-hidden="true">
        <span class="preloader-particle p1"></span>
        <span class="preloader-particle p2"></span>
        <span class="preloader-particle p3"></span>
        <span class="preloader-particle p4"></span>
        <span class="preloader-particle p5"></span>
        <span class="preloader-particle p6"></span>
      </div>

      <!-- Main Couple & Date Showcase (Exact Match to Reference Picture) -->
      <div class="preloader-showcase-container" id="preloader-showcase-container">
        <!-- Top Tagline with flanking lines -->
        <div class="preloader-showcase-tagline">
          <span class="preloader-tagline-line" aria-hidden="true"></span>
          <span class="preloader-tagline-text">WEDDING INVITATION</span>
          <span class="preloader-tagline-line" aria-hidden="true"></span>
        </div>

        <!-- Couple Names -->
        <div class="preloader-names-showcase">
          <div class="preloader-name">${name1}</div>
          <div class="preloader-amp">&amp;</div>
          <div class="preloader-name">${name2}</div>
        </div>

        <!-- Bottom Block: Heart Divider + Wedding Date + Subtle Tap Hint -->
        <div class="preloader-bottom-block">
          <!-- Delicate Heart Divider with flanking lines -->
          <div class="preloader-heart-divider" aria-hidden="true">
            <span class="preloader-heart-line"></span>
            <svg class="preloader-heart-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="preloader-heart-line"></span>
          </div>

          <!-- Wedding Date -->
          <div class="preloader-showcase-date">
            ${date}
          </div>

          <!-- Subtle Tap to Open Prompt -->
          <div class="preloader-tap-hint" id="preloader-enter-btn" role="button" tabindex="0" aria-label="Tap to Open Invitation">
            <span class="tap-hint-text">Tap anywhere to open</span>
            <svg class="tap-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initPreloader(onDismissCallback) {
  const preloader = document.getElementById('wedding-preloader');
  if (!preloader) return;

  let isDismissed = false;

  // Strict scroll lock while preloader is active
  document.documentElement.classList.add('preloader-active');
  document.body.classList.add('preloader-active');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  const enterBtn = document.getElementById('preloader-enter-btn');
  const showcaseContainer = document.getElementById('preloader-showcase-container');

  function preventScroll(e) {
    if (!isDismissed) {
      if (e.cancelable) {
        e.preventDefault();
      }
      return false;
    }
  }

  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });

  // Pre-load cursive font
  if (document.fonts?.load) {
    document.fonts.load('48px "Alex Brush"').catch(() => { });
    document.fonts.load('48px "Brittany Signature"').catch(() => { });
  }

  function dismiss() {
    if (isDismissed) return;
    isDismissed = true;

    // Start audio immediately on gesture
    playMusic();

    // Remove scroll prevention
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);

    // Trigger smooth, slow, elegant fade out (2.4s cinematic dissolve)
    preloader.classList.add('preloader-fade-out');
    preloader.style.pointerEvents = 'none';

    // Unlock body scrolling smoothly
    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.height = '';

    if (typeof onDismissCallback === 'function') {
      try {
        onDismissCallback();
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
    }, 2400);
  }

  // Tap button or hint to open
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismiss();
    });
    enterBtn.addEventListener('touchend', (e) => {
      e.stopPropagation();
      dismiss();
    }, { passive: true });
    enterBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        dismiss();
      }
    });
  }

  // Tapping the showcase area or anywhere on the preloader opens the invitation
  if (showcaseContainer) {
    showcaseContainer.addEventListener('click', () => {
      dismiss();
    });
  }

  preloader.addEventListener('click', () => {
    dismiss();
  });
}
