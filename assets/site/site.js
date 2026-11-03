/* Christian Jeremiah — portfolio behaviour. Small, optional: every page reads without it. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* 1. Entrances: each part of a section rises once, as it enters. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var pending = reveals.slice();
  var show = function (el) { el.classList.add('is-in'); };

  /* Anything already above the reader has been passed, so it is shown: a jump to the
     bottom of the page (or a find-in-page) never leaves hidden text behind. */
  var sweepPassed = function () {
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().bottom < 0) { show(el); return false; }
      return true;
    });
  };

  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    var sweepTicking = false;
    window.addEventListener('scroll', function () {
      if (sweepTicking) return;
      sweepTicking = true;
      window.requestAnimationFrame(function () { sweepTicking = false; sweepPassed(); });
    }, { passive: true });
    sweepPassed();
  } else {
    reveals.forEach(show);
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
