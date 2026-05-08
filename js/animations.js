/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initScrollReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.dataset.delay || 0;
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el) {
    observer.observe(el);
  });
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function initCounters() {
  if (typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.result-num[data-target], .stat-num[data-target]').forEach(function(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function() {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = prefix + Math.round(this.targets()[0].val) + suffix;
          }
        });
      }
    });
  });

  /* Missed calls counter in problem section */
  document.querySelectorAll('.counter-number[data-target]').forEach(function(el) {
    var target = parseInt(el.dataset.target);
    var triggered = false;

    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          var start = 0;
          var duration = 1800;
          var startTime = null;
          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    obs.observe(el);
  });
}

/* ── BEFORE / AFTER SLIDER ───────────────────────────────── */
function initBeforeAfter() {
  var wrap   = document.querySelector('.ba-wrap');
  var handle = document.querySelector('.ba-handle');
  var after  = document.querySelector('.ba-after');
  if (!wrap || !handle || !after) return;

  var dragging = false;

  var setPos = function(pct) {
    pct = Math.min(Math.max(pct, 2), 98);
    handle.style.left = pct + '%';
    after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
  };

  setPos(50);

  /* Auto-animate on scroll into view */
  var animated = false;
  new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !animated) {
        animated = true;
        var start = null, dur = 3000;
        function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
        function frame(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var pos = p < 0.35 ? 50 + ease(p / 0.35) * (16 - 50)
                  : p < 0.68 ? 16 + ease((p - 0.35) / 0.33) * (84 - 16)
                  : 84 + ease((p - 0.68) / 0.32) * (50 - 84);
          setPos(pos);
          if (p < 1 && !dragging) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }
    });
  }, { threshold: 0.4 }).observe(wrap);

  handle.addEventListener('pointerdown', function(e) { dragging = true; e.preventDefault(); });
  window.addEventListener('pointermove', function(e) {
    if (!dragging) return;
    var rect = wrap.getBoundingClientRect();
    setPos((e.clientX - rect.left) / rect.width * 100);
  });
  window.addEventListener('pointerup', function() { dragging = false; });
}

/* ── TIMELINE SCROLL ─────────────────────────────────────── */
function initTimelineScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.to('#timeline-progress', {
    scrollTrigger: {
      trigger: '#how-it-works',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: true,
    },
    height: '100%',
    ease: 'none',
  });
}
