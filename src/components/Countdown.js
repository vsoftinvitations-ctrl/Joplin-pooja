/**
 * ============================================================================
 * LUXURY WEDDING COUNTDOWN TIMER
 * ============================================================================
 * Accurate, elegant countdown timer ticking down to Jorlin & Pooja's wedding
 * ceremony on 16 November 2026 at 11:00 AM IST.
 */

// Target Wedding Ceremony: 16 November 2026, 11:00 AM IST (+05:30)
const WEDDING_TARGET_TIME = new Date('2026-11-16T11:00:00+05:30').getTime();

export function calculateTimeRemaining(target = WEDDING_TARGET_TIME) {
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isCompleted: diff <= 0
  };
}

export function renderCountdown() {
  const init = calculateTimeRemaining();
  return `
    <div class="countdown-block r">
      <div class="countdown-header">
        <p class="label" style="margin-bottom:6px">Counting Down to Forever</p>
        <h3 class="serif countdown-title">Until We Say &ldquo;I Do&rdquo;</h3>
      </div>
      <div class="countdown-container" id="wedding-countdown" role="timer" aria-label="Countdown to Wedding">
        <div class="countdown-item">
          <span class="countdown-num" id="cd-days">${init.days}</span>
          <span class="countdown-label">Days</span>
        </div>
        <span class="countdown-colon" aria-hidden="true">:</span>
        <div class="countdown-item">
          <span class="countdown-num" id="cd-hours">${init.hours}</span>
          <span class="countdown-label">Hours</span>
        </div>
        <span class="countdown-colon" aria-hidden="true">:</span>
        <div class="countdown-item">
          <span class="countdown-num" id="cd-minutes">${init.minutes}</span>
          <span class="countdown-label">Mins</span>
        </div>
        <span class="countdown-colon" aria-hidden="true">:</span>
        <div class="countdown-item">
          <span class="countdown-num" id="cd-seconds">${init.seconds}</span>
          <span class="countdown-label">Secs</span>
        </div>
      </div>
      <div class="countdown-footer-badge">
        <span>Monday, 16 November 2026 &bull; 11:00 AM</span>
      </div>
    </div>
  `;
}

export function initCountdown(targetTimestamp = WEDDING_TARGET_TIME) {
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return null;

  function update() {
    const time = calculateTimeRemaining(targetTimestamp);

    elDays.textContent = time.days;
    elHours.textContent = time.hours;
    elMinutes.textContent = time.minutes;
    elSeconds.textContent = time.seconds;

    if (time.isCompleted) {
      const container = document.getElementById('wedding-countdown');
      if (container) {
        container.setAttribute('aria-label', 'The Wedding Celebration Has Begun!');
      }
    }
  }

  // Run immediately to eliminate any delay
  update();
  const timer = setInterval(update, 1000);

  return {
    stop() {
      clearInterval(timer);
    }
  };
}
