/* ═══════════════════════════════════════════════════════
   SHYNE & JOSHUA — WEDDING INVITATION
   script.js — Dreamy Animated Edition
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   HELPERS
────────────────────────────────────────── */
function splitIntoLetters(el) {
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.transitionDelay = `${i * 55}ms`;
    el.appendChild(span);
  });
}

function splitIntoWords(el) {
  const html = el.innerHTML;
  // preserve <em> tags
  const words = html.split(/(\s+)/);
  el.innerHTML = words.map(w => {
    if (/^\s+$/.test(w)) return ' ';
    return `<span class="word">${w}</span>`;
  }).join('');
}

function typewriter(el, text, speed, done) {
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i >= text.length) { if (done) done(); return; }
    const ch = text[i++];
    if (ch === '&') {
      // handle & entity
      const end = text.indexOf(';', i);
      if (end !== -1) {
        el.innerHTML += text.slice(i - 1, end + 1);
        i = end + 1;
      } else {
        el.textContent += ch;
      }
    } else {
      el.textContent += ch;
    }
    setTimeout(tick, speed + (Math.random() * speed * 0.5));
  }
  tick();
}


/* ──────────────────────────────────────────
   1. SPLASH SCREEN — typewriter + particles + music
────────────────────────────────────────── */
(function initSplash() {
  const splash   = document.getElementById('splashScreen');
  const enterBtn = document.getElementById('splashEnter');
  const eyebrow  = document.getElementById('splashEyebrow');
  const namesEl  = document.getElementById('splashNames');
  const dateEl   = document.getElementById('splashDate');
  const ruleEl   = document.getElementById('splashRule');
  const canvasEl = document.getElementById('splashCanvas');
  const musicBtn = document.getElementById('musicBtn');
  const audio    = document.getElementById('weddingAudio');
  const icon     = document.getElementById('musicIcon');
  const lbl      = document.getElementById('musicLabel');

  let playing = false;

  // ── Particle canvas on splash ──
  if (canvasEl) {
    const ctx = canvasEl.getContext('2d');
    let W, H, particles = [], raf;
    function resize() {
      W = canvasEl.width  = canvasEl.offsetWidth;
      H = canvasEl.height = canvasEl.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COLORS = [
      'rgba(200,164,106,', 'rgba(196,134,122,', 'rgba(220,185,140,', 'rgba(228,210,170,'
    ];
    function Particle() {
      this.reset = function() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = 1 + Math.random() * 2.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -0.15 - Math.random() * 0.35;
        this.alpha = 0;
        this.targetAlpha = 0.2 + Math.random() * 0.5;
        this.life  = 0;
        this.maxLife = 120 + Math.random() * 180;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      };
      this.reset();
      this.life = Math.random() * this.maxLife;
    }
    for (let i = 0; i < 55; i++) particles.push(new Particle());

    function loopParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.life++;
        p.pulse += p.pulseSpeed;
        p.x += p.vx;
        p.y += p.vy;
        const progress = p.life / p.maxLife;
        p.alpha = progress < 0.2 ? (progress / 0.2) * p.targetAlpha
                : progress > 0.8 ? ((1 - progress) / 0.2) * p.targetAlpha
                : p.targetAlpha;
        const size = p.r * (1 + 0.15 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
        if (p.life >= p.maxLife) p.reset();
      });
      raf = requestAnimationFrame(loopParticles);
    }
    loopParticles();
    splash.addEventListener('transitionend', () => cancelAnimationFrame(raf), { once: true });
  }

  // ── Typewriter sequence ──
  function runTypewriterSequence() {
    setTimeout(() => {
      // eyebrow fades in via CSS, just set text
      if (eyebrow) eyebrow.textContent = 'You are cordially invited!';

      setTimeout(() => {
        if (!namesEl) return;
        // Type "Joshua"
        typewriter(namesEl, 'Joshua', 80, () => {
          // Add the "&" with a bloom
          const amp = document.createElement('span');
          amp.className = 'splash-amp';
          amp.innerHTML = ' &amp; ';
          namesEl.appendChild(amp);
          setTimeout(() => amp.classList.add('visible'), 50);

          // Then type "Shyne"
          const shyneSpan = document.createElement('span');
          namesEl.appendChild(shyneSpan);
          setTimeout(() => {
            typewriter(shyneSpan, 'Shyne', 80, () => {
              // Date shimmer in
              setTimeout(() => {
                if (dateEl) {
                  dateEl.textContent = 'December 4, 2026';
                  dateEl.classList.add('visible');
                  setTimeout(() => {
                    if (ruleEl) ruleEl.classList.add('visible');
                    setTimeout(() => {
                      if (enterBtn) {
                        enterBtn.classList.remove('splash-enter--hidden');
                        enterBtn.classList.add('visible');
                      }
                    }, 400);
                  }, 500);
                }
              }, 300);
            });
          }, 220);
        });
      }, 900);
    }, 400);
  }

  if (splash) {
    document.body.style.overflow = 'hidden';
    runTypewriterSequence();
  }

  // ── Music helpers ──
  function setPlayingUI() {
    if (musicBtn) musicBtn.classList.add('playing');
    if (icon) icon.textContent = '♬';
    if (lbl)  lbl.textContent  = 'Playing';
    playing = true;
  }
  function setPausedUI() {
    if (musicBtn) musicBtn.classList.remove('playing');
    if (icon) icon.textContent = '♪';
    if (lbl)  lbl.textContent  = 'Music';
    playing = false;
  }
  function fadeIn() {
    if (!audio) return;
    audio.volume = 0;
    audio.play().catch(() => {});
    let v = 0;
    const ramp = setInterval(() => {
      v = Math.min(v + 0.04, 0.55); audio.volume = v;
      if (v >= 0.55) clearInterval(ramp);
    }, 80);
    setPlayingUI();
  }
  function fadeOut() {
    if (!audio) return;
    let v = audio.volume;
    const ramp = setInterval(() => {
      v = Math.max(v - 0.04, 0); audio.volume = v;
      if (v <= 0) { clearInterval(ramp); audio.pause(); }
    }, 80);
    setPausedUI();
  }

  function dismissSplash() {
    if (!splash || splash.classList.contains('hiding')) return;
    splash.classList.add('hiding');
    setTimeout(() => splash.classList.add('gone'), 1150);
    document.body.style.overflow = '';
    fadeIn();
  }

  if (enterBtn) enterBtn.addEventListener('click', dismissSplash);
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') dismissSplash();
  }, { once: true });

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (playing) fadeOut(); else fadeIn();
    });
  }
})();


/* ──────────────────────────────────────────
   2. STICKY NAV
────────────────────────────────────────── */
(function initStickyNav() {
  const nav = document.getElementById('stickyNav');
  const links = document.querySelectorAll('.nav-link[data-section]');
  const drawerLinks = document.querySelectorAll('.drawer-link[data-section]');
  const hamburger = document.getElementById('navHamburger');
  const drawer = document.getElementById('navDrawer');
  const backTop = document.getElementById('backTop');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        if (backTop) backTop.classList.toggle('visible', window.scrollY > 300);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      drawer.setAttribute('aria-hidden', !isOpen);
    });
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = [...links, ...drawerLinks];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allNavLinks.forEach(link => link.classList.toggle('active', link.dataset.section === id));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectionObserver.observe(s));

  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ──────────────────────────────────────────
   4. SCROLL ANIMATIONS — fade-up + section title line
────────────────────────────────────────── */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  targets.forEach(el => observer.observe(el));

  // Section title glow line
  const titles = document.querySelectorAll('.section-title');
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('line-visible'); titleObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  titles.forEach(el => titleObserver.observe(el));
})();


/* ──────────────────────────────────────────
   5. HERO CINEMATIC REVEAL + LETTER SPLIT
────────────────────────────────────────── */
(function initHeroReveal() {
  const reveals = document.querySelectorAll('.cinematic-reveal');
  reveals.forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('revealed'), delay + 300);
  });

  // Split hero name letters
  document.querySelectorAll('.split-letters').forEach(el => {
    splitIntoLetters(el);
  });

  // Animate letters when hero is revealed
  const namesEl = document.querySelector('.hero-names');
  if (namesEl) {
    setTimeout(() => {
      namesEl.querySelectorAll('.split-letters').forEach(el => el.classList.add('animate'));
    }, 800);
  }

  // Split closing names too
  const closingNames = document.querySelector('.closing-names');
  if (closingNames) {
    const amp = closingNames.querySelector('.closing-amp');
    const text = closingNames.innerHTML;
    // We'll animate it on scroll instead
    closingNames.classList.add('split-target');
  }
})();


/* ──────────────────────────────────────────
   6. COUNTDOWN TIMER with glow on tick
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
    el.textContent = val;
    el.classList.remove('glow');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add('glow');
  }

  function tick() {
    const diff = WEDDING - new Date();
    if (diff <= 0) {
      [cdDays, cdHours, cdMins, cdSecs].forEach(el => { if (el) el.textContent = '00'; });
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
   7. SLIDESHOW with swipe
────────────────────────────────────────── */
(function initSlideshow() {
  const slides  = document.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  if (!slides.length) return;

  let current = 0, timer = null, startX = 0;

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

  dots.forEach(dot => dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.slide)); startAuto(); }));
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

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
   8. WORD-BY-WORD STORY REVEAL
────────────────────────────────────────── */
(function initWordReveal() {
  const textEls = document.querySelectorAll('.timeline-text');
  textEls.forEach(el => {
    splitIntoWords(el);
    el.classList.add('word-reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('animate');
        const words = el.querySelectorAll('.word');
        words.forEach((w, i) => { w.style.transitionDelay = `${i * 60}ms`; });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  textEls.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   9. 3D TILT on cards
────────────────────────────────────────── */
(function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // skip on touch devices

  document.querySelectorAll('.detail-card, .gift-card, .schedule-card').forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s var(--ease-soft)';
      card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });
  });
})();


/* ──────────────────────────────────────────
   10. CLOSING NAMES — letter reveal on scroll
────────────────────────────────────────── */
(function initClosingReveal() {
  const el = document.querySelector('.closing-names');
  if (!el) return;

  // Grab the amp span before splitting
  const ampSpan = el.querySelector('.closing-amp');
  const ampHTML = ampSpan ? ampSpan.outerHTML : '&';

  // Build letter spans preserving the amp, grouped by word so line-wraps
  // only happen between words, never inside a name.
  const rawText = el.textContent; // "Joshua & Shyne"
  el.innerHTML = '';
  const words = rawText.split(' ');
  let globalIndex = 0;
  words.forEach((word, wi) => {
    const wordWrap = document.createElement('span');
    wordWrap.className = 'closing-word';
    [...word].forEach((ch) => {
      const s = document.createElement('span');
      if (ch === '&') {
        s.innerHTML = ampHTML;
      } else {
        s.textContent = ch;
      }
      s.classList.add('letter');
      s.style.transitionDelay = `${globalIndex * 60}ms`;
      wordWrap.appendChild(s);
      globalIndex++;
    });
    el.appendChild(wordWrap);
    if (wi < words.length - 1) {
      el.appendChild(document.createTextNode('\u00A0'));
      globalIndex++;
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { el.classList.add('animate'); observer.unobserve(el); }
    });
  }, { threshold: 0.4 });
  observer.observe(el);
})();


/* ──────────────────────────────────────────
   11. RSVP FORM
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

  attendRadios.forEach(radio => {
    radio.addEventListener('change', () => { if (guestField) guestField.hidden = radio.value !== 'yes'; });
  });

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

  if (msgInput && charCount) {
    msgInput.addEventListener('input', () => { charCount.textContent = `${msgInput.value.length} / 300`; });
  }

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

    if (btnText) btnText.textContent = 'Sending…';
    submitBtn.disabled = true;

    const formData = new FormData();
    formData.append('form-name', 'rsvp');
    formData.append('name', name);
    formData.append('attendance', attended.value === 'yes' ? 'Attending' : 'Not Attending');
    formData.append('guests', guestHidden ? guestHidden.value : '1');
    formData.append('message', msgInput ? msgInput.value.trim() : '');
    formData.append('bot-field', '');

    fetch('/', { method: 'POST', body: formData })
      .then(() => {
        const isYes = attended.value === 'yes';
        if (confirmTitle) confirmTitle.textContent = isYes ? 'See you there!' : 'We\'ll miss you!';
        if (confirmMsg) confirmMsg.textContent = isYes
          ? 'We\'ve received your RSVP! We can\'t wait to celebrate this special day with you.'
          : 'Thank you for letting us know. You\'ll be in our hearts as we celebrate.';
        if (confirmName) confirmName.textContent = name;
        step1.hidden = true;
        confirm.hidden = false;
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Confirm RSVP';
      })
      .catch(() => {
        if (btnText) btnText.textContent = 'Something went wrong — try again';
        submitBtn.disabled = false;
        setTimeout(() => { if (btnText) btnText.textContent = 'Confirm RSVP'; }, 3000);
      });
  });

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
   12. FLOATING PETALS CANVAS (main page)
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
  const COLORS = ['rgba(196,134,122,0.45)', 'rgba(220,175,140,0.40)', 'rgba(200,164,106,0.35)', 'rgba(228,198,165,0.38)'];
  function Petal() {
    this.reset = function() {
      this.x = Math.random() * W; this.y = -20 - Math.random() * 80;
      this.size = 3 + Math.random() * 5.5; this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = 0.3 + Math.random() * 0.5; this.angle = Math.random() * Math.PI * 2;
      this.angleVel = (Math.random() - 0.5) * 0.016; this.wobble = Math.random() * Math.PI * 2;
      this.wobbleInc = 0.018 + Math.random() * 0.018;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = 0.22 + Math.random() * 0.45;
    };
    this.reset(); this.y = Math.random() * H;
  }
  for (let i = 0; i < 18; i++) petals.push(new Petal());
  function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.wobble += p.wobbleInc; p.x += p.vx + Math.sin(p.wobble) * 0.3;
      p.y += p.vy; p.angle += p.angleVel;
      if (p.y > H + 30 || p.x < -30 || p.x > W + 30) p.reset();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.48, p.size, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    });
    raf = requestAnimationFrame(loop);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else loop(); });
  loop();
})();


/* ──────────────────────────────────────────
   13. SMOOTH ANCHOR LINKS
────────────────────────────────────────── */
(function initSmoothAnchors() {
  const NAV_H = 64;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - NAV_H, behavior: 'smooth' });
    });
  });
})();


/* ──────────────────────────────────────────
   14. ATTENDEES TOGGLE
────────────────────────────────────────── */
(function initAttendeesToggle() {
  const btn  = document.getElementById('attendeesToggle');
  const wrap = document.getElementById('attendeesList');
  if (!btn || !wrap) return;
  btn.addEventListener('click', () => {
    const isOpen = wrap.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    wrap.setAttribute('aria-hidden', !isOpen);
  });
})();
