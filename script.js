/* ═══════════════════════════════════════════════════════
   SHYNE & JOSHUA — WEDDING INVITATION
   script.js — Cinematic Mobile Edition
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   1. HERO CINEMATIC REVEAL
────────────────────────────────────────── */
(function initHeroReveal() {
  const reveals = document.querySelectorAll('.cinematic-reveal');
  reveals.forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('revealed'), delay + 200);
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
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();


/* ──────────────────────────────────────────
   3. INTERSECTION OBSERVER — multi-type animations
────────────────────────────────────────── */
(function initScrollAnimations() {
  const selectors = '.fade-scene, .slide-left, .slide-right, .scale-reveal, .blur-reveal';
  const targets = document.querySelectorAll(selectors);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   4. SECTION NAV DOTS — highlight active scene
────────────────────────────────────────── */
(function initSectionNav() {
  const scenes = document.querySelectorAll('.scene');
  if (!scenes.length) return;

  // Build the nav
  const nav = document.createElement('nav');
  nav.className = 'section-nav';
  nav.setAttribute('aria-label', 'Section navigation');

  scenes.forEach((scene, i) => {
    const btn = document.createElement('button');
    btn.className = 'section-nav-dot';
    btn.setAttribute('aria-label', `Go to section ${i + 1}`);
    btn.addEventListener('click', () => {
      scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    nav.appendChild(btn);
  });

  document.body.appendChild(nav);
  const dots = nav.querySelectorAll('.section-nav-dot');

  // Observe scenes for active state
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const idx = Array.from(scenes).indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      });
    },
    { threshold: [0.4, 0.6] }
  );

  scenes.forEach(s => observer.observe(s));
  if (dots.length) dots[0].classList.add('active'); // default first
})();


/* ──────────────────────────────────────────
   5. STORY LINE SEQUENTIAL REVEAL
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
          setTimeout(() => line.classList.add('visible'), 80 + i * 200);
        });
        observer.disconnect();
      }
    },
    { threshold: 0.06 }
  );
  observer.observe(section);
})();


/* ──────────────────────────────────────────
   6. COUNTDOWN TIMER
────────────────────────────────────────── */
(function initCountdown() {
  const WEDDING = new Date('2026-12-04T15:00:00+08:00');
  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');
  if (!cdDays) return;

  function pad(n, len = 2) { return String(n).padStart(len, '0'); }

  function setNum(el, val) {
    if (el.textContent === val) return;
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      el.textContent = val;
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  }

  function tick() {
    const diff = WEDDING - new Date();
    if (diff <= 0) {
      [cdDays, cdHours, cdMins, cdSecs].forEach((el, i) => setNum(el, i === 0 ? '000' : '00'));
      return;
    }
    setNum(cdDays,  pad(Math.floor(diff / 86400000), 3));
    setNum(cdHours, pad(Math.floor((diff % 86400000) / 3600000)));
    setNum(cdMins,  pad(Math.floor((diff % 3600000) / 60000)));
    setNum(cdSecs,  pad(Math.floor((diff % 60000) / 1000)));
  }
  tick();
  setInterval(tick, 1000);
})();


/* ──────────────────────────────────────────
   7. SLIDESHOW — with Ken Burns effect
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

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(parseInt(dot.dataset.slide));
      timer = setInterval(() => goTo(current + 1), 4500);
    });
  });

  timer = setInterval(() => goTo(current + 1), 4500);
})();


/* ──────────────────────────────────────────
   8. GUESTBOOK
────────────────────────────────────────── */
(function initGuestbook() {
  const nameInput   = document.getElementById('guestName');
  const msgInput    = document.getElementById('guestMessage');
  const submitBtn   = document.getElementById('guestSubmit');
  const entriesEl   = document.getElementById('guestbookEntries');
  const charCountEl = document.getElementById('charCount');
  if (!submitBtn) return;

  const STORAGE_KEY = 'wedding_shyne_joshua_guestbook_v2';
  const loadEntries = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
  const saveEntries = (e) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); } catch {} };
  const fmt = (iso) => new Date(iso).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
  const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  function renderEntry(entry, prepend = false) {
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `<p class="entry-name">${esc(entry.name)}</p><p class="entry-message">${esc(entry.message)}</p><p class="entry-time">${fmt(entry.ts)}</p>`;
    prepend ? entriesEl.insertBefore(div, entriesEl.firstChild) : entriesEl.appendChild(div);
  }

  loadEntries().slice().reverse().forEach(e => renderEntry(e));
  if (msgInput && charCountEl) {
    msgInput.addEventListener('input', () => { charCountEl.textContent = `${msgInput.value.length} / 300`; });
  }

  function shake(el) {
    el.style.transition = 'transform 0.06s ease';
    el.style.borderBottomColor = 'rgba(196,134,122,0.7)';
    const vals = [5,-5,4,-4,2,-2,0];
    let i = 0;
    const iv = setInterval(() => {
      el.style.transform = `translateX(${vals[i]}px)`;
      if (++i >= vals.length) { clearInterval(iv); el.style.transform=''; setTimeout(()=>{ el.style.borderBottomColor=''; el.style.transition=''; },1200); }
    }, 55);
  }

  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const msg  = msgInput.value.trim();
    if (!name) shake(nameInput);
    if (!msg)  shake(msgInput);
    if (!name || !msg) return;

    const entry = { name, message: msg, ts: new Date().toISOString() };
    const entries = loadEntries();
    entries.push(entry);
    saveEntries(entries);
    renderEntry(entry, true);

    nameInput.value = '';
    msgInput.value = '';
    if (charCountEl) charCountEl.textContent = '0 / 300';

    const orig = submitBtn.textContent;
    submitBtn.textContent = 'Message Sent ✦';
    submitBtn.style.cssText = 'border-color:var(--gold-muted);color:var(--gold-muted);background:var(--gold-dim);';
    setTimeout(() => { submitBtn.textContent = orig; submitBtn.style.cssText = ''; }, 3000);
  });
})();


/* ──────────────────────────────────────────
   9. MUSIC TOGGLE
────────────────────────────────────────── */
(function initMusic() {
  const btn   = document.getElementById('musicBtn');
  const audio = document.getElementById('weddingAudio');
  const icon  = document.getElementById('musicIcon');
  const label = document.getElementById('musicLabel');
  if (!btn || !audio) return;

  let playing = false;

  function fadeIn(a) {
    a.volume = 0;
    a.play().catch(() => {});
    let v = 0;
    const ramp = setInterval(() => {
      v = Math.min(v + 0.04, 0.55);
      a.volume = v;
      if (v >= 0.55) clearInterval(ramp);
    }, 80);
  }
  function fadeOut(a) {
    let v = a.volume;
    const ramp = setInterval(() => {
      v = Math.max(v - 0.04, 0);
      a.volume = v;
      if (v <= 0) { clearInterval(ramp); a.pause(); }
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
   10. FLOATING ROSE PETALS CANVAS
────────────────────────────────────────── */
(function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.style.display='none'; return; }

  const ctx = canvas.getContext('2d');
  let W, H, petals = [], raf;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = [
    'rgba(196,134,122,0.5)', 'rgba(220,175,140,0.45)',
    'rgba(200,164,106,0.4)', 'rgba(228,198,165,0.4)', 'rgba(210,155,125,0.38)',
  ];

  function Petal() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = -20 - Math.random() * 120;
      this.size = 3 + Math.random() * 6;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = 0.35 + Math.random() * 0.55;
      this.angle = Math.random() * Math.PI * 2;
      this.angleVel = (Math.random() - 0.5) * 0.018;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleInc = 0.02 + Math.random() * 0.02;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = 0.25 + Math.random() * 0.5;
    };
    this.reset();
    this.y = Math.random() * H;
  }

  for (let i = 0; i < 20; i++) petals.push(new Petal());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.wobble += p.wobbleInc;
      p.x += p.vx + Math.sin(p.wobble) * 0.35;
      p.y += p.vy;
      p.angle += p.angleVel;
      if (p.y > H + 30 || p.x < -30 || p.x > W + 30) p.reset();
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else loop();
  });
  loop();
})();


/* ──────────────────────────────────────────
   11. PARALLAX — subtle depth on scenes
────────────────────────────────────────── */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return; // skip on mobile for perf

  const heroBg = document.querySelector('.hero-bg-anim');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroBg) heroBg.style.transform = `translateY(${y * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ──────────────────────────────────────────
   12. TOUCH SWIPE — hint for mobile nav
────────────────────────────────────────── */
(function initSwipeHint() {
  let startY = 0;
  let startTime = 0;

  document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dy = startY - e.changedTouches[0].clientY;
    const dt = Date.now() - startTime;
    // fast swipe — let snap handle it naturally
    if (Math.abs(dy) > 40 && dt < 400) {
      e.preventDefault && e.preventDefault();
    }
  }, { passive: true });
})();
