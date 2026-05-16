/* ═══════════════════════════════════════════════════════
   SHYNE & JOSHUA — WEDDING INVITATION
   script.js — Redesigned Mobile-First Edition
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   1. HERO CINEMATIC REVEAL
────────────────────────────────────────── */
(function initHeroReveal() {
  const reveals = document.querySelectorAll('.cinematic-reveal');
  reveals.forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('revealed'), delay + 300);
  });
})();


/* ──────────────────────────────────────────
   2. STICKY NAV — scroll-triggered styling + active link
────────────────────────────────────────── */
(function initStickyNav() {
  const nav = document.getElementById('stickyNav');
  const links = document.querySelectorAll('.nav-link[data-section]');
  const drawerLinks = document.querySelectorAll('.drawer-link[data-section]');
  const hamburger = document.getElementById('navHamburger');
  const drawer = document.getElementById('navDrawer');
  const backTop = document.getElementById('backTop');
  if (!nav) return;

  // Scroll-triggered nav styling + back-to-top
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        nav.classList.toggle('scrolled', scrolled > 40);
        if (backTop) backTop.classList.toggle('visible', scrolled > 300);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      drawer.setAttribute('aria-hidden', !isOpen);
    });

    // Close drawer on link click
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = [...links, ...drawerLinks];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allNavLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  // Back to top
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


/* ──────────────────────────────────────────
   3. SCROLL PROGRESS BAR
────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ──────────────────────────────────────────
   4. INTERSECTION OBSERVER — scroll animations
────────────────────────────────────────── */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  targets.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   5. COUNTDOWN TIMER
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
    if (!el || el.textContent === val) return;
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.textContent = val;
        el.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }

  function tick() {
    const diff = WEDDING - new Date();
    if (diff <= 0) {
      setNum(cdDays,  '000');
      setNum(cdHours, '00');
      setNum(cdMins,  '00');
      setNum(cdSecs,  '00');
      return;
    }
    setNum(cdDays,  pad(Math.floor(diff / 86400000), 3));
    setNum(cdHours, pad(Math.floor((diff % 86400000) / 3600000)));
    setNum(cdMins,  pad(Math.floor((diff % 3600000)  / 60000)));
    setNum(cdSecs,  pad(Math.floor((diff % 60000)    / 1000)));
  }
  tick();
  setInterval(tick, 1000);
})();


/* ──────────────────────────────────────────
   6. SLIDESHOW — with swipe support
────────────────────────────────────────── */
(function initSlideshow() {
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.dot');
  const prevBtn  = document.getElementById('slidePrev');
  const nextBtn  = document.getElementById('slideNext');
  if (!slides.length) return;

  let current = 0;
  let timer   = null;
  let startX  = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) { dots[current].classList.remove('active'); dots[current].setAttribute('aria-selected', 'false'); }
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) { dots[current].classList.add('active'); dots[current].setAttribute('aria-selected', 'true'); }
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4800);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide));
      startAuto();
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  // Touch swipe
  const wrap = document.getElementById('slidesWrap');
  if (wrap) {
    wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const dx = startX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) { goTo(current + (dx > 0 ? 1 : -1)); startAuto(); }
    }, { passive: true });
  }

  startAuto();
})();


/* ──────────────────────────────────────────
   7. RSVP FORM
────────────────────────────────────────── */
(function initRSVP() {
  const step1       = document.getElementById('rsvpStep1');
  const confirm     = document.getElementById('rsvpConfirm');
  const submitBtn   = document.getElementById('rsvpSubmit');
  const resetBtn    = document.getElementById('rsvpReset');
  const nameInput   = document.getElementById('rsvpName');
  const msgInput    = document.getElementById('rsvpMessage');
  const charCount   = document.getElementById('rsvpCharCount');
  const guestField  = document.getElementById('guestCountField');
  const guestMinus  = document.getElementById('guestMinus');
  const guestPlus   = document.getElementById('guestPlus');
  const guestVal    = document.getElementById('guestVal');
  const guestHidden = document.getElementById('rsvpGuests');
  const attendRadios = document.querySelectorAll('input[name="attendance"]');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmMsg   = document.getElementById('confirmMsg');
  const confirmName  = document.getElementById('confirmName');
  const btnText      = document.getElementById('rsvpBtnText');

  if (!step1 || !submitBtn) return;

  // Show/hide guest count when attendance selected
  attendRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (guestField) guestField.hidden = radio.value !== 'yes';
    });
  });

  // Guest counter
  let guestCount = 1;
  if (guestMinus && guestPlus) {
    guestMinus.addEventListener('click', () => {
      guestCount = Math.max(1, guestCount - 1);
      guestVal.textContent = guestCount;
      if (guestHidden) guestHidden.value = guestCount;
    });
    guestPlus.addEventListener('click', () => {
      guestCount = Math.min(10, guestCount + 1);
      guestVal.textContent = guestCount;
      if (guestHidden) guestHidden.value = guestCount;
    });
  }

  // Character counter
  if (msgInput && charCount) {
    msgInput.addEventListener('input', () => {
      charCount.textContent = `${msgInput.value.length} / 300`;
    });
  }

  // Shake animation for validation
  function shake(el) {
    el.style.transition = 'transform 0.06s ease';
    el.style.borderBottomColor = 'rgba(196,134,122,0.8)';
    const vals = [6, -6, 4, -4, 2, -2, 0];
    let i = 0;
    const iv = setInterval(() => {
      el.style.transform = `translateX(${vals[i]}px)`;
      if (++i >= vals.length) {
        clearInterval(iv);
        el.style.transform = '';
        setTimeout(() => { el.style.borderBottomColor = ''; el.style.transition = ''; }, 1200);
      }
    }, 55);
  }

  // Submit
  submitBtn.addEventListener('click', () => {
    const name = nameInput ? nameInput.value.trim() : '';
    const attended = document.querySelector('input[name="attendance"]:checked');

    let valid = true;
    if (!name) { shake(nameInput); valid = false; }
    if (!attended) {
      const opts = document.querySelector('.attend-options');
      if (opts) { opts.style.outline = '1px solid rgba(196,134,122,0.5)'; setTimeout(() => { opts.style.outline = ''; }, 2000); }
      valid = false;
    }
    if (!valid) return;

    // Show loading state
    if (btnText) btnText.textContent = 'Sending…';
    submitBtn.disabled = true;

    // Simulate form submission (replace with real endpoint)
    setTimeout(() => {
      const isYes = attended.value === 'yes';
      if (confirmTitle) confirmTitle.textContent = isYes ? 'See you there! 🎉' : 'We\'ll miss you!';
      if (confirmMsg) confirmMsg.textContent = isYes
        ? `We've received your RSVP! We can't wait to celebrate this special day with you.`
        : `Thank you for letting us know. You'll be in our hearts as we celebrate.`;
      if (confirmName) confirmName.textContent = name;

      step1.hidden = true;
      confirm.hidden = false;
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Confirm RSVP';
    }, 800);
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      step1.hidden = false;
      confirm.hidden = true;
      if (nameInput) nameInput.value = '';
      if (msgInput) msgInput.value = '';
      if (charCount) charCount.textContent = '0 / 300';
      attendRadios.forEach(r => r.checked = false);
      if (guestField) guestField.hidden = true;
      guestCount = 1;
      if (guestVal) guestVal.textContent = 1;
      if (guestHidden) guestHidden.value = 1;
    });
  }
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

  function fadeIn(a) {
    a.volume = 0; a.play().catch(() => {});
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
   9. FLOATING PETALS CANVAS
────────────────────────────────────────── */
(function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.style.display = 'none'; return; }

  const ctx = canvas.getContext('2d');
  let W, H, petals = [], raf;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = [
    'rgba(196,134,122,0.45)', 'rgba(220,175,140,0.40)',
    'rgba(200,164,106,0.35)', 'rgba(228,198,165,0.38)',
  ];

  function Petal() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = -20 - Math.random() * 80;
      this.size = 3 + Math.random() * 5.5;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = 0.3 + Math.random() * 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.angleVel = (Math.random() - 0.5) * 0.016;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleInc = 0.018 + Math.random() * 0.018;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = 0.22 + Math.random() * 0.45;
    };
    this.reset();
    this.y = Math.random() * H;
  }

  for (let i = 0; i < 18; i++) petals.push(new Petal());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.wobble += p.wobbleInc;
      p.x += p.vx + Math.sin(p.wobble) * 0.3;
      p.y += p.vy;
      p.angle += p.angleVel;
      if (p.y > H + 30 || p.x < -30 || p.x > W + 30) p.reset();
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.48, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
  loop();
})();


/* ──────────────────────────────────────────
   10. SMOOTH ANCHOR LINKS
   (accounts for sticky nav height)
────────────────────────────────────────── */
(function initSmoothAnchors() {
  const NAV_H = 64;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
