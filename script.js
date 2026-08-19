/* ═══════════════════════════════════════════════════════
   JOSHUA & SHYNE — script.js
   Calm, restrained interactions only.
═══════════════════════════════════════════════════════ */
'use strict';

/* Mark JS as active — CSS only hides .reveal-io content when this class
   is present, so the site is never blank if a script error occurs. */
document.documentElement.classList.add('js');

/* Safety net: if anything below throws or the observer never fires for
   a given element, force it visible after a few seconds so nothing is
   ever permanently stuck invisible. */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal-io:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 4000);
});

/* ── 1. INTRO SCREEN ── */
(function initIntro(){
  const intro = document.getElementById('intro');
  const enterBtn = document.getElementById('introEnter');
  if (!intro) return;
  document.body.style.overflow = 'hidden';

  function dismiss(){
    if (intro.classList.contains('hiding')) return;
    intro.classList.add('hiding');
    document.body.style.overflow = '';
    setTimeout(() => intro.classList.add('gone'), 1000);
  }
  if (enterBtn) enterBtn.addEventListener('click', dismiss);
})();

/* ── 2. MUSIC TOGGLE ── */
(function initMusic(){
  const btn = document.getElementById('musicBtn');
  const label = document.getElementById('musicLabel');
  const audio = document.getElementById('weddingAudio');
  if (!btn || !audio) return;
  let playing = false;

  btn.addEventListener('click', () => {
    if (playing){
      audio.pause();
      btn.classList.remove('playing');
      label.textContent = 'Music';
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
      label.textContent = 'Playing';
    }
    playing = !playing;
  });
})();

/* ── 3. NAV: scroll state, drawer, active link ── */
(function initNav(){
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
      ticking = false;
    });
  }, { passive:true });

  if (burger && drawer){
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      drawer.setAttribute('aria-hidden', !open);
    });
    drawer.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const links = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        links.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
      }
    });
  }, { threshold:0.4 });
  sections.forEach(s => obs.observe(s));
})();

/* ── 4. THREAD SCROLL PROGRESS ── */
(function initThread(){
  const fill = document.getElementById('threadFill');
  if (!fill) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.height = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    });
  }, { passive:true });
})();

/* ── 5. SCROLL REVEALS (fade-up, one-time) ── */
(function initReveals(){
  const targets = document.querySelectorAll('.reveal-io');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('visible'), i % 4 * 60);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
  targets.forEach(el => obs.observe(el));
})();

/* ── 6. HERO PARALLAX (subtle, single layer) ── */
(function initParallax(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const photo = document.querySelector('.hero-photo img');
  if (!photo) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const shift = Math.min(window.scrollY * 0.12, 60);
      photo.style.transform = `translateY(${shift}px) scale(1.06)`;
      ticking = false;
    });
  }, { passive:true });
})();

/* ── 7. COUNTDOWN ── */
(function initCountdown(){
  const WEDDING = new Date('2026-12-04T15:00:00+08:00');
  const d = document.getElementById('cd-days');
  const h = document.getElementById('cd-hours');
  const m = document.getElementById('cd-mins');
  const s = document.getElementById('cd-secs');
  if (!d) return;
  const pad = (n, len=2) => String(n).padStart(len, '0');
  function tick(){
    const diff = WEDDING - new Date();
    if (diff <= 0){ [d,h,m,s].forEach(el => el.textContent = '00'); return; }
    d.textContent = pad(Math.floor(diff / 86400000), 3);
    h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    s.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── 8. STORY PHOTO FRAME ── */
(function initFrame(){
  const photos = document.querySelectorAll('.frame-photo');
  const dots = document.querySelectorAll('.fdot');
  const prev = document.getElementById('framePrev');
  const next = document.getElementById('frameNext');
  if (!photos.length) return;
  let current = 0, timer = null;

  function goTo(i){
    photos[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (i + photos.length) % photos.length;
    photos[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }
  function auto(){ clearInterval(timer); timer = setInterval(() => goTo(current + 1), 5200); }

  dots.forEach(dot => dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.i)); auto(); }));
  if (prev) prev.addEventListener('click', () => { goTo(current - 1); auto(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); auto(); });
  auto();
})();

/* ── 9. RSVP FORM ── */
(function initRSVP(){
  const form = document.getElementById('rsvpForm');
  const confirmBox = document.getElementById('rsvpConfirm');
  const submitBtn = document.getElementById('rsvpSubmit');
  const resetBtn = document.getElementById('rsvpReset');
  const nameInput = document.getElementById('rsvpName');
  const msgInput = document.getElementById('rsvpMessage');
  const charCount = document.getElementById('charCount');
  const guestField = document.getElementById('guestField');
  const guestMinus = document.getElementById('guestMinus');
  const guestPlus = document.getElementById('guestPlus');
  const guestVal = document.getElementById('guestVal');
  const guestHidden = document.getElementById('rsvpGuests');
  const radios = document.querySelectorAll('input[name="attendance"]');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmMsg = document.getElementById('confirmMsg');
  const confirmName = document.getElementById('confirmName');
  const btnText = document.getElementById('rsvpBtnText');
  if (!form || !submitBtn) return;

  radios.forEach(r => r.addEventListener('change', () => {
    if (guestField) guestField.hidden = r.value !== 'yes';
  }));

  let guestCount = 1;
  if (guestMinus && guestPlus){
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

  if (msgInput && charCount){
    msgInput.addEventListener('input', () => { charCount.textContent = `${msgInput.value.length} / 300`; });
  }

  function flagInvalid(el){
    el.style.borderBottomColor = '#B9867199';
    setTimeout(() => { el.style.borderBottomColor = ''; }, 1500);
  }

  submitBtn.addEventListener('click', () => {
    const name = nameInput ? nameInput.value.trim() : '';
    const attended = document.querySelector('input[name="attendance"]:checked');
    let valid = true;
    if (!name){ flagInvalid(nameInput); valid = false; }
    if (!attended) valid = false;
    if (!valid) return;

    if (btnText) btnText.textContent = 'Sending…';
    submitBtn.disabled = true;

    const data = new FormData();
    data.append('form-name', 'rsvp');
    data.append('name', name);
    data.append('attendance', attended.value === 'yes' ? 'Attending' : 'Not Attending');
    data.append('guests', guestHidden ? guestHidden.value : '1');
    data.append('message', msgInput ? msgInput.value.trim() : '');
    data.append('bot-field', '');

    fetch('/', { method:'POST', body:data })
      .then(() => {
        const isYes = attended.value === 'yes';
        if (confirmTitle) confirmTitle.textContent = isYes ? 'See you there' : "We'll miss you";
        if (confirmMsg) confirmMsg.textContent = isYes
          ? "We've received your RSVP. We can't wait to celebrate with you."
          : "Thank you for letting us know — you'll be in our hearts that day.";
        if (confirmName) confirmName.textContent = name;
        form.hidden = true;
        confirmBox.hidden = false;
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send RSVP';
      })
      .catch(() => {
        if (btnText) btnText.textContent = 'Something went wrong — try again';
        submitBtn.disabled = false;
        setTimeout(() => { if (btnText) btnText.textContent = 'Send RSVP'; }, 3000);
      });
  });

  if (resetBtn){
    resetBtn.addEventListener('click', () => {
      form.hidden = false;
      confirmBox.hidden = true;
      if (nameInput) nameInput.value = '';
      if (msgInput) msgInput.value = '';
      if (charCount) charCount.textContent = '0 / 300';
      radios.forEach(r => r.checked = false);
      if (guestField) guestField.hidden = true;
      guestCount = 1;
      if (guestVal) guestVal.textContent = 1;
      if (guestHidden) guestHidden.value = 1;
    });
  }
})();

/* ── 10. ATTENDEES TOGGLE ── */
(function initAttendees(){
  const btn = document.getElementById('attendeesToggle');
  const list = document.getElementById('attendeesList');
  if (!btn || !list) return;
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    list.setAttribute('aria-hidden', !open);
  });
})();

/* ── 11. SMOOTH ANCHOR LINKS ── */
(function initAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav') ? 76 : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior:'smooth' });
    });
  });
})();
