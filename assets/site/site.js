/* Christian Jeremiah — portfolio behaviour. Small, optional: every page reads without it. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* 0. Smooth scroll (Lenis). Mouse wheel and trackpad get eased, momentum-style scrolling.
        Touch screens keep their native scrolling. Reduced motion keeps the browser's own scroll.
        Tuning lives in LENIS_CONFIG below. */
  var LENIS_CONFIG = {
    duration: 1.15,                                                  // seconds for one wheel "flick" to settle
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, // expo-out: fast start, long soft landing
    wheelMultiplier: 1,                                              // 1 = true wheel distance; 0.6 = slower, 1.4 = faster
    touchMultiplier: 1,                                              // only used if syncTouch is turned on
    smoothWheel: true,
    gestureOrientation: 'vertical',
    anchors: true,                                                   // #links glide too
    autoRaf: true                                                    // Lenis runs its own frame loop
  };
  if (window.Lenis && !reduce.matches && window.matchMedia('(pointer: fine)').matches) {
    window.lenis = new window.Lenis(LENIS_CONFIG);
  }

  /* 1. Entrances: each part blur-fades in every time it enters the view, and resets when it
        leaves, so scrolling back up and down plays the effect again. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-in', e.isIntersecting); });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* 2. The work index: the picture follows the reader through the pinned stage.
        Hovering or focusing a row also shows its picture, so every project is one touch away. */
  var work = document.querySelector('[data-work]');
  if (work) {
    var rows = Array.prototype.slice.call(work.querySelectorAll('[data-work-row]'));
    var medias = Array.prototype.slice.call(work.querySelectorAll('[data-work-media]'));
    var now = work.querySelector('[data-work-now]');
    var current = -1;

    var setActive = function (i) {
      if (i === current || i < 0 || i >= medias.length) return;
      current = i;
      medias.forEach(function (m, k) { m.classList.toggle('is-active', k === i); m.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      rows.forEach(function (r, k) { r.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      if (now) {
        now.classList.add('is-swap');
        window.setTimeout(function () {
          now.textContent = medias[i].getAttribute('data-now') || '';
          now.classList.remove('is-swap');
        }, 150);
      }
    };

    var pinned = function () { return window.matchMedia('(min-width: 861px)').matches && !reduce.matches; };

    var onScroll = function () {
      if (!pinned()) return;
      var rect = work.getBoundingClientRect();
      var span = work.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      var progress = Math.min(1, Math.max(0, -rect.top / span));
      setActive(Math.min(medias.length - 1, Math.floor(progress * medias.length)));
    };

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; onScroll(); });
    }, { passive: true });
    window.addEventListener('resize', onScroll);

    rows.forEach(function (row, i) {
      var show = function () { if (pinned()) setActive(i); };
      row.addEventListener('mouseenter', show);
      row.addEventListener('focus', show);
    });

    onScroll();
    if (!pinned()) setActive(0);
  }

  /* 2b. Theme: light or dark, remembered on this device. The early script in <head> applies it before paint. */
  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    var syncLabel = function () {
      var dark = root.dataset.theme === 'dark';
      var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
    };
    syncLabel();
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode: the choice lasts this visit only */ }
      syncLabel();
    });
  }

  /* 3. Contact: opens the visitor's own email app, addressed to the site owner. No server. */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var email = form.getAttribute('data-email') || '';
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!email) {
        var note = form.querySelector('[data-form-note]');
        if (note) note.textContent = 'The form is not connected yet. Use LinkedIn or Behance below.';
        return;
      }
      var data = new FormData(form);
      var subject = 'Hello from ' + (data.get('name') || 'your website');
      var body = (data.get('message') || '') + '\n\n— ' + (data.get('name') || '') + (data.get('email') ? ' (' + data.get('email') + ')' : '');
      window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
