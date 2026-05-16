/* ═══════════════════════════════════════════════════════
   SHYNE & JOSHUA — WEDDING INVITATION
   script.js — Premium Romantic Edition
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   1. HERO CINEMATIC REVEAL (page load)
────────────────────────────────────────── */
(function initHeroReveal() {
  const reveals = document.querySelectorAll('.cinematic-reveal');
  reveals.forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => {
      el.classList.add('revealed');
    }, delay + 200);
  });
})();


/* ──────────────────────────────────────────
   2. SCROLL PROGRESS BAR
────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();


/* ──────────────────────────────────────────
   3. INTERSECTION OBSERVER — fade-scene
────────────────────────────────────────── */
(function initFadeScenes() {
  const targets = document.querySelectorAll('.fade-scene');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );
  targets.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   4. STORY LINE SEQUENTIAL REVEAL
────────────────────────────────────────── */
(function initStoryLines() {
  const lines = document.querySelectorAll('.story-line');
  if (!lines.length) return;

  const section = document.getElementById('scene-story');
  if (!section) return;

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.classList.add('visible');
          }, 100 + i * 190);
        });
        observer.disconnect();
      }
    },
    { threshold: 0.08 }
  );

  observer.observe(section);
})();


/* ──────────────────────────────────────────
   5. COUNTDOWN TIMER
────────────────────────────────────────── */
(function initCountdown() {
  const WEDDING = new Date('2026-12-04T15:00:00+08:00'); // 3 PM PHT

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  if (!cdDays) return;

  function pad(n, len = 2) {
    return String(n).padStart(len, '0');
  }

  // Flip animation on digit change
  function setNum(el, val) {
    if (el.textContent !== val) {
      el.style.transform = 'translateY(-6px)';
      el.style.opacity   = '0';
      setTimeout(() => {
        el.textContent   = val;
        el.style.transform = 'translateY(6px)';
        setTimeout(() => {
          el.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
          el.style.transform  = 'translateY(0)';
          el.style.opacity    = '1';
        }, 20);
      }, 120);
    }
  }

  function tick() {
    const now  = new Date();
    const diff = WEDDING - now;

    if (diff <= 0) {
      [cdDays, cdHours, cdMins, cdSecs].forEach((el, i) => {
        setNum(el, i === 0 ? '000' : '00');
      });
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    setNum(cdDays,  pad(days, 3));
    setNum(cdHours, pad(hours));
    setNum(cdMins,  pad(mins));
    setNum(cdSecs,  pad(secs));
  }

  tick();
  setInterval(tick, 1000);
})();


/* ──────────────────────────────────────────
   6. PROPOSAL SLIDESHOW (auto + dots)
────────────────────────────────────────── */
(function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');

  if (!slides.length) return;

  let current = 0;
  let timer   = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() { timer = setInterval(next, 4500); }
  function stopAuto()  { clearInterval(timer); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.slide));
      startAuto();
    });
  });

  startAuto();
})();


/* ──────────────────────────────────────────
   7. GUESTBOOK (localStorage)
────────────────────────────────────────── */
(function initGuestbook() {
  const nameInput   = document.getElementById('guestName');
  const msgInput    = document.getElementById('guestMessage');
  const submitBtn   = document.getElementById('guestSubmit');
  const entriesEl   = document.getElementById('guestbookEntries');
  const charCountEl = document.getElementById('charCount');

  if (!submitBtn) return;

  const STORAGE_KEY = 'wedding_shyne_joshua_guestbook_v2';

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderEntry(entry, prepend = false) {
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <p class="entry-name">${escHtml(entry.name)}</p>
      <p class="entry-message">${escHtml(entry.message)}</p>
      <p class="entry-time">${formatTime(entry.ts)}</p>
    `;
    if (prepend) {
      entriesEl.insertBefore(div, entriesEl.firstChild);
    } else {
      entriesEl.appendChild(div);
    }
  }

  // Render stored entries
  loadEntries().slice().reverse().forEach(e => renderEntry(e));

  // Character counter
  if (msgInput && charCountEl) {
    msgInput.addEventListener('input', () => {
      charCountEl.textContent = `${msgInput.value.length} / 300`;
    });
  }

  // Shake animation for invalid fields
  function shakeField(el) {
    el.style.transition = 'transform 0.08s ease, border-color 0.4s';
    el.style.borderBottomColor = 'rgba(196, 134, 122, 0.7)';
    const shakes = [4, -4, 3, -3, 2, -2, 0];
    let i = 0;
    const interval = setInterval(() => {
      el.style.transform = `translateX(${shakes[i]}px)`;
      i++;
      if (i >= shakes.length) {
        clearInterval(interval);
        el.style.transform = '';
        setTimeout(() => {
          el.style.borderBottomColor = '';
          el.style.transition = '';
        }, 1200);
      }
    }, 60);
  }

  // Submit
  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const msg  = msgInput.value.trim();

    if (!name) shakeField(nameInput);
    if (!msg)  shakeField(msgInput);
    if (!name || !msg) return;

    const entry = { name, message: msg, ts: new Date().toISOString() };
    const entries = loadEntries();
    entries.push(entry);
    saveEntries(entries);

    renderEntry(entry, true);

    nameInput.value  = '';
    msgInput.value   = '';
    if (charCountEl) charCountEl.textContent = '0 / 300';

    // Success state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Message Sent ✦';
    submitBtn.style.cssText = 'border-color: var(--gold-muted); color: var(--gold-muted); background: var(--gold-dim);';
    setTimeout(() => {
      submitBtn.textContent  = originalText;
      submitBtn.style.cssText = '';
    }, 3000);
  });
})();


/* ──────────────────────────────────────────
   8. MUSIC TOGGLE
────────────────────────────────────────── */
(function initMusic() {
  const btn   = document.getElementById('musicBtn');
  const audio = document.getElementById('weddingAudio');
  const icon  = document.getElementById('musicIcon');
  const label = document.getElementById('musicLabel');

  if (!btn || !audio) return;

  let playing = false;

  function fadeIn(audioEl) {
    audioEl.volume = 0;
    audioEl.play().catch(() => {
      // Autoplay blocked — silently fail
    });
    let v = 0;
    const ramp = setInterval(() => {
      v = Math.min(v + 0.04, 0.55);
      audioEl.volume = v;
      if (v >= 0.55) clearInterval(ramp);
    }, 80);
  }

  function fadeOut(audioEl) {
    let v = audioEl.volume;
    const ramp = setInterval(() => {
      v = Math.max(v - 0.04, 0);
      audioEl.volume = v;
      if (v <= 0) {
        clearInterval(ramp);
        audioEl.pause();
      }
    }, 80);
  }

  btn.addEventListener('click', () => {
    if (!playing) {
      fadeIn(audio);
      btn.classList.add('playing');
      if (icon)  icon.textContent  = '♬';
      if (label) label.textContent = 'Playing';
    } else {
      fadeOut(audio);
      btn.classList.remove('playing');
      if (icon)  icon.textContent  = '♪';
      if (label) label.textContent = 'Music';
    }
    playing = !playing;
  });
})();


/* ──────────────────────────────────────────
   9. FLOATING ROSE PETALS CANVAS
────────────────────────────────────────── */
(function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H, petals = [], raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PETAL_COUNT = 22;
  const COLORS = [
    'rgba(196, 134, 122, 0.5)',
    'rgba(220, 175, 140, 0.45)',
    'rgba(200, 164, 106, 0.4)',
    'rgba(228, 198, 165, 0.4)',
    'rgba(210, 155, 125, 0.38)',
  ];

  function Petal() {
    this.reset = function() {
      this.x    = Math.random() * W;
      this.y    = -20 - Math.random() * 120;
      this.size = 4 + Math.random() * 7;
      this.vx   = (Math.random() - 0.5) * 0.7;
      this.vy   = 0.4 + Math.random() * 0.6;
      this.angle     = Math.random() * Math.PI * 2;
      this.angleVel  = (Math.random() - 0.5) * 0.018;
      this.wobble    = Math.random() * Math.PI * 2;
      this.wobbleInc = 0.02 + Math.random() * 0.02;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity   = 0.3 + Math.random() * 0.5;
    };
    this.reset();
    this.y = Math.random() * H; // scatter initially
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    // Oval petal shape
    ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    petals.forEach(p => {
      p.wobble    += p.wobbleInc;
      p.x         += p.vx + Math.sin(p.wobble) * 0.4;
      p.y         += p.vy;
      p.angle     += p.angleVel;

      if (p.y > H + 30 || p.x < -30 || p.x > W + 30) {
        p.reset();
      }

      drawPetal(p);
    });

    raf = requestAnimationFrame(loop);
  }

  // Only animate when tab is visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      loop();
    }
  });

  loop();
})();


/* ──────────────────────────────────────────
   10. SMOOTH ANCHOR SCROLL
────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
