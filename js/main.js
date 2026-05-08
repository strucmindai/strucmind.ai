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
  if (btn) btn.textContent = window._siteAudio.muted ? '🔇' : '🔊';
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

/* ── MOBILE MENU ─────────────────────────────────────────── */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileClose = document.getElementById('mobile-close');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }
}

function closeMobileMenu() {
  var mobileMenu = document.getElementById('mobile-menu');
  var hamburger  = document.getElementById('hamburger');
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  document.body.style.overflow = '';
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

/* ── FORM SUBMISSION (Netlify Forms via AJAX) ────────────── */
function handleQuoteSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  var data = new FormData(form);
  var encoded = new URLSearchParams(data).toString();

  function showSuccess() {
    form.innerHTML = '<div style="text-align:center;padding:3rem 0">' +
      '<div style="font-size:3rem;margin-bottom:1rem;color:#0066FF">✓</div>' +
      '<h3 style="font-family:\'Syne\',sans-serif;font-weight:700;font-size:1.5rem;color:#fff;margin-bottom:0.75rem">Request received!</h3>' +
      '<p style="color:rgba(255,255,255,0.45);font-size:0.9375rem">We\'ll review your details and get back to you within 24 hours.</p>' +
      '</div>';
  }

  function showError(msg) {
    btn.textContent = 'Send Request →';
    btn.disabled = false;
    var note = form.querySelector('.form-error');
    if (!note) {
      note = document.createElement('p');
      note.className = 'form-error';
      note.style.cssText = 'color:#ff4444;font-size:0.875rem;margin-top:0.75rem;text-align:center';
      btn.parentNode.insertBefore(note, btn.nextSibling);
    }
    note.textContent = msg || 'Something went wrong. Please call 407-686-5270 or email contact@strucmind.ai.';
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

/* ── INIT ────────────────────────────────────────────────── */
document.body.style.overflow = 'hidden';

document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initEnterGate();
  initCursor();
  initNavScroll();
  initMobileMenu();
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
