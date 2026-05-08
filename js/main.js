/* ── STRUCMIND.AI — MAIN.JS ──────────────────────────────── */

/* ── AUDIO ───────────────────────────────────────────────── */
function initAudio() {
  try {
    var audio = new Audio('audio/ambient.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.play().then(function() {
      var vol = 0;
      var fade = setInterval(function() {
        vol = Math.min(vol + 0.003, 0.12);
        audio.volume = vol;
        if (vol >= 0.12) clearInterval(fade);
      }, 80);
      window._siteAudio = audio;
    }).catch(function() {});
  } catch(e) {}
}

function toggleAudio() {
  var btn = document.getElementById('audio-toggle');
  if (!window._siteAudio) return;
  window._siteAudio.muted = !window._siteAudio.muted;
  var muted = window._siteAudio.muted;
  if (btn) {
    btn.textContent = muted ? '🔇' : '🔊';
    btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    btn.setAttribute('aria-label', muted ? 'Sound is off — click to turn on' : 'Sound is on — click to turn off');
  }
}

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  var dot  = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  var mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .flip-card-wrapper, .tier-card, .tag').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      dot.classList.add('expand');
      ring.classList.add('expand');
    });
    el.addEventListener('mouseleave', function() {
      dot.classList.remove('expand');
      ring.classList.remove('expand');
    });
  });
}

/* ── ENTER GATE ──────────────────────────────────────────── */
function initEnterGate() {
  var gate = document.getElementById('enter-gate');
  if (!gate) return;

  if (sessionStorage.getItem('sm_entered')) {
    gate.style.display = 'none';
    revealSite();
    return;
  }

  initLogo('enter-logo-canvas', {
    width: 280, height: 280,
    opacity: 1, speed: 0.004,
    useImage: true,
  });

  document.getElementById('enter-btn').addEventListener('click', function() {
    sessionStorage.setItem('sm_entered', 'true');
    initAudio();

    if (typeof gsap !== 'undefined') {
      gsap.to('#enter-gate', {
        opacity: 0, scale: 1.04, duration: 1.2,
        ease: 'power2.inOut',
        onComplete: function() {
          gate.style.display = 'none';
          revealSite();
        }
      });
    } else {
      gate.style.opacity = '0';
      setTimeout(function() { gate.style.display = 'none'; revealSite(); }, 600);
    }
  });
}

function revealSite() {
  document.body.style.overflow = '';
  if (typeof gsap === 'undefined') return;

  gsap.from('#navbar',       { y:-80, opacity:0, duration:1,   ease:'power3.out', delay:0.2 });
  gsap.from('.hero-label',   { opacity:0, y:20, duration:0.8, delay:0.5 });
  gsap.from('.hero-line',    { opacity:0, y:60, duration:1, stagger:0.15, ease:'power3.out', delay:0.7 });
  gsap.from('.hero-sub',     { opacity:0, y:30, duration:0.9, delay:1.1 });
  gsap.from('.hero-ctas',    { opacity:0, y:20, duration:0.8, delay:1.3 });
}

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
function initNavScroll() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive:true });

  /* Smooth scroll for anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        /* Close mobile menu if open */
        closeMobileMenu();
      }
    });
  });
}

/* ── MOBILE MENU (Nielsen H3 control + H1 status) ────────── */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileClose = document.getElementById('mobile-close');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function() {
    var willOpen = !mobileMenu.classList.contains('open');
    if (willOpen) openMobileMenu();
    else closeMobileMenu();
  });

  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

  /* H3 — ESC key closes the overlay (clear emergency exit) */
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    if (mobileMenu.classList.contains('open')) closeMobileMenu();
  });

  /* Click outside menu content closes it */
  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) closeMobileMenu();
  });
}

function openMobileMenu() {
  var mobileMenu = document.getElementById('mobile-menu');
  var hamburger  = document.getElementById('hamburger');
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  if (hamburger) {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
  }
  document.body.style.overflow = 'hidden';
  /* Focus the close button for keyboard users */
  var closeBtn = document.getElementById('mobile-close');
  if (closeBtn) closeBtn.focus();
}

function closeMobileMenu() {
  var mobileMenu = document.getElementById('mobile-menu');
  var hamburger  = document.getElementById('hamburger');
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    /* Return focus for keyboard users */
    hamburger.focus();
  }
  document.body.style.overflow = '';
}

/* ── ACTIVE NAV SCROLL-SPY (Nielsen H1: visibility of system status) */
function initScrollSpy() {
  var sections = document.querySelectorAll('section[id], div[id="hero"]');
  if (!sections.length) return;

  var navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-link[href^="#"]');
  if (!navLinks.length) return;

  function setActive(id) {
    navLinks.forEach(function(a) {
      var href = a.getAttribute('href');
      if (href === '#' + id) a.classList.add('is-active');
      else a.classList.remove('is-active');
    });
  }

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(function(s) { if (s.id) io.observe(s); });
}

/* ── GSAP SERVICES STAGGER ───────────────────────────────── */
function initServicesStagger() {
  /* Flip card scroll-in is handled by initFlipCards() IntersectionObserver */
}

/* ── FLIP CARDS ──────────────────────────────────────────── */
function initFlipCards() {
  var cards    = document.querySelectorAll('.flip-card');
  var wrappers = document.querySelectorAll('.flip-card-wrapper');
  if (!cards.length) return;

  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      var isFlipped = card.classList.contains('flipped');
      cards.forEach(function(c) { c.classList.remove('flipped'); c.style.transform = ''; c.style.animation = ''; });
      if (!isFlipped) card.classList.add('flipped');
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.flip-card-wrapper')) {
      cards.forEach(function(c) { c.classList.remove('flipped'); });
    }
  });

  wrappers.forEach(function(wrapper) {
    var card = wrapper.querySelector('.flip-card');
    wrapper.addEventListener('mousemove', function(e) {
      if (card.classList.contains('flipped')) return;
      var rect = wrapper.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.animation = 'none';
      card.style.transform = 'rotateY('+x*14+'deg) rotateX('+(-y*10)+'deg) translateY(-8px) scale(1.02)';
    });
    wrapper.addEventListener('mouseleave', function() {
      if (card.classList.contains('flipped')) return;
      card.style.transform = '';
      setTimeout(function() { if (!card.classList.contains('flipped')) card.style.animation = ''; }, 300);
    });
  });

  /* Scroll-in stagger */
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var idx = Array.from(wrappers).indexOf(entry.target);
      setTimeout(function() { entry.target.classList.add('visible'); }, idx * 50);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  wrappers.forEach(function(w) { obs.observe(w); });
}

/* ── FORM VALIDATION + SUBMISSION (Nielsen H5 prevention, H9 error recovery) */
function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
  var existing = field.parentNode.querySelector('.field-error');
  if (existing) existing.remove();
}

function setFieldError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  var existing = field.parentNode.querySelector('.field-error');
  if (existing) existing.remove();
  var errorId = (field.id || field.name) + '-error';
  field.setAttribute('aria-describedby', errorId);
  var msg = document.createElement('span');
  msg.className = 'field-error';
  msg.id = errorId;
  msg.setAttribute('role', 'alert');
  msg.textContent = message;
  field.parentNode.appendChild(msg);
}

function validateField(field) {
  if (field.disabled) return true;
  if (field.required && !field.value.trim()) {
    setFieldError(field, 'This field is required.');
    return false;
  }
  if (field.type === 'email' && field.value) {
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    if (!ok) { setFieldError(field, 'Please enter a valid email address.'); return false; }
  }
  if (field.type === 'tel' && field.value) {
    var digits = field.value.replace(/\D/g, '');
    if (digits.length < 7) { setFieldError(field, 'Please enter a valid phone number.'); return false; }
  }
  clearFieldError(field);
  return true;
}

function initFormLiveValidation() {
  var form = document.getElementById('quote-form-el');
  if (!form) return;
  var fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(function(field) {
    field.addEventListener('blur', function() { validateField(field); });
    field.addEventListener('input', function() {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var btn = form.querySelector('button[type="submit"]');

  /* H5 — validate before submitting; H9 — show clear, field-level errors */
  var fields = form.querySelectorAll('input, select, textarea');
  var firstInvalid = null;
  fields.forEach(function(f) {
    if (!validateField(f) && !firstInvalid) firstInvalid = f;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    showFormBanner(form, 'Please fix the highlighted fields and try again.', 'error');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');

  var data = new FormData(form);
  var encoded = new URLSearchParams(data).toString();

  function showSuccess() {
    form.innerHTML = '<div role="status" aria-live="polite" style="text-align:center;padding:3rem 0">' +
      '<div style="font-size:3rem;margin-bottom:1rem;color:#0066FF">✓</div>' +
      '<h3 style="font-family:\'Syne\',sans-serif;font-weight:700;font-size:1.5rem;color:#fff;margin-bottom:0.75rem">Request received!</h3>' +
      '<p style="color:rgba(255,255,255,0.45);font-size:0.9375rem;line-height:1.7">We\'ll review your details and get back to you within 24 hours.<br>If urgent, call <a href="tel:4076865270" style="color:#0066ff">407-686-5270</a>.</p>' +
      '</div>';
  }

  function showError(msg) {
    btn.textContent = 'Send Request →';
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    showFormBanner(form,
      msg || 'We could not send your request. Please try again, or contact us at 407-686-5270 / contact@strucmind.ai.',
      'error');
  }

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encoded
  })
  .then(function(res) {
    if (res.ok) showSuccess();
    else showError();
  })
  .catch(function() { showError(); });
}

function showFormBanner(form, text, kind) {
  var existing = form.querySelector('.form-banner');
  if (existing) existing.remove();
  var banner = document.createElement('div');
  banner.className = 'form-banner';
  banner.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  banner.style.cssText = 'margin-top:1rem;padding:0.85rem 1rem;border-radius:6px;font-size:0.875rem;text-align:center;' +
    (kind === 'error'
      ? 'background:rgba(255,68,68,0.08);border:1px solid rgba(255,68,68,0.3);color:#ffb0b0;'
      : 'background:rgba(0,102,255,0.08);border:1px solid rgba(0,102,255,0.3);color:#cfe0ff;');
  banner.textContent = text;
  var btn = form.querySelector('button[type="submit"]');
  if (btn) btn.parentNode.insertBefore(banner, btn.nextSibling);
  else form.appendChild(banner);
}

/* ── INIT ────────────────────────────────────────────────── */
/* H3 — User control: only lock scroll if motion is allowed AND user
   hasn't already entered. Reduced-motion users skip the gate entirely. */
var prefersReducedMotion = window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && !sessionStorage.getItem('sm_entered')) {
  document.body.style.overflow = 'hidden';
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* For reduced-motion users: skip the enter gate entirely */
  if (prefersReducedMotion) {
    var gate = document.getElementById('enter-gate');
    if (gate) gate.style.display = 'none';
    sessionStorage.setItem('sm_entered', 'true');
    document.body.style.overflow = '';
  } else {
    initEnterGate();
  }

  initCursor();
  initNavScroll();
  initMobileMenu();
  initScrollSpy();
  initFormLiveValidation();
  initHeroScene();
  initScrollReveal();
  initCounters();
  initTimelineScroll();
  initOrbitalScene();
  initFinalCTAScene();
  initServicesStagger();
  initBeforeAfter();
  initFlipCards();
});
