/* =========================================================
   COMMON SCRIPT
   Shared across every page (index.html, aboutme.html, project.html).
   Load this before any page-specific script (main.js / about.js / project.js).

   1. splitLetters()      - wraps a heading's text in .letter spans
   2. revealLetters()     - the drop/rise-in stagger animation for those
   3. observeTitle()      - reveals a split heading once it scrolls into view
   4. revealOnScroll()    - generic fade/mask reveal for any list of elements,
                            each animating independently as IT scrolls into
                            view (not all at once) - used by story.js for
                            image masks.
   5. splitWords()        - wraps a paragraph's text in .word spans
   6. revealWordsOnScroll()- word-by-word reveal for body copy, each
                            paragraph triggering its own stagger the
                            moment IT scrolls into view.
   7. initFooterClock()   - live India-time readout in the shared footer
   ========================================================= */

function splitLetters(el) {
  const text = el.textContent;
  el.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.classList.add('letter');
    // A lone space as the entire content of an inline-block box gets
    // trimmed to zero width by the browser; U+00A0 renders the same
    // but isn't collapsible, so word gaps (e.g. "ANUJ DEBNATH") survive.
    span.textContent = char === ' ' ? ' ' : char;
    el.appendChild(span);
  });
  return el.querySelectorAll('.letter');
}

// `hide: true` reverses the same stagger back to its resting position
// instead of to 0% - `hiddenY` lets a caller whose CSS starts the
// letters somewhere other than -120% (e.g. .footer-wordmark, which
// rises from below at 120%) reverse to the correct place.
// ease is power2.inOut (not power2.out) so both legs - dropping in
// AND retreating back out - start and end smoothly instead of the
// retreat snapping off at full speed.
function revealLetters(letters, opts = {}) {
  gsap.to(letters, {
    y: opts.hide ? (opts.hiddenY ?? '-120%') : '0%',
    duration: 0.8,
    ease: 'power2.inOut',
    stagger: { each: 0.05, from: 'center' }
  });
}

// Titles below the fold reveal once scrolled into view; reuses the
// same stagger/ease as an on-load hero entrance for a consistent feel.
// Pass `bidirectional: true` to also retreat the title back to its
// hidden position when scrolled back UP past it, instead of the
// default one-shot reveal - used on the landing page so scrolling up
// past a title un-reveals it, mirroring the entrance. Deliberately
// direction-gated: an IntersectionObserver alone can't tell WHY a
// target stopped intersecting, only that it did - stops firing this
// way, when scrolling down further, will also carry it out through
// the top of the viewport, which isn't "scrolling back up past it" and
// shouldn't retreat, just leave revealed as it scrolls out of frame.
function observeTitle(letters, opts = {}) {
  const target = letters[0]?.parentElement;
  if (!target) return;
  let lastScrollY = window.scrollY;
  const observer = new IntersectionObserver((entries) => {
    const scrolledUp = window.scrollY < lastScrollY;
    lastScrollY = window.scrollY;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealLetters(letters);
        if (!opts.bidirectional) observer.unobserve(target);
      } else if (opts.bidirectional && scrolledUp) {
        revealLetters(letters, { hide: true, hiddenY: opts.hiddenY });
      }
    });
  }, { threshold: 0.4 });
  observer.observe(target);
}

// Generic scroll reveal: each element in `elements` animates from
// `fromVars` to `toVars` independently, the moment IT crosses into
// view - so a long page of copy/images reveals progressively as you
// scroll rather than all firing together on load.
function revealOnScroll(elements, fromVars, toVars, opts = {}) {
  const list = Array.from(elements);
  if (!list.length) return;
  gsap.set(list, fromVars);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, toVars);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin ?? '0px 0px -60px 0px' });
  list.forEach(el => observer.observe(el));
}

// Image mask reveal: a clip-path wipe (top to bottom), not a scaleY
// transform - transforming the mask box stretches the <img> inside
// it too. Tweens a plain number rather than the clip-path string
// directly: the browser collapses equal inset() values down to a
// shorter serialized form (e.g. "inset(0% 0% 100% 0%)" becomes
// "inset(0% 0% 100%)" once computed, since left/right are equal),
// so a string tween from that collapsed form to a differently-
// shaped target string can end up with mismatched value counts and
// silently stall instead of animating. A numeric proxy + onUpdate
// sidesteps that - the clip-path string is rebuilt fresh every
// frame from a plain number GSAP is free to tween normally.
// The clip-path is applied to the <img> itself, not the observed
// wrapper - a fully clipped target (0% visible area) reports an
// intersection ratio of 0 forever, since Chrome's IntersectionObserver
// factors the target's own CSS clip into that ratio, so it can never
// cross the threshold and the observer callback never fires again.
function revealImageOnScroll(elements, opts = {}) {
  const list = Array.from(elements);
  if (!list.length) return;
  list.forEach(el => {
    const img = el.querySelector('img') || el;
    img.style.clipPath = 'inset(0% 0% 100% 0%)';
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const img = target.querySelector('img') || target;
        const proxy = { reveal: 100 };
        gsap.to(proxy, {
          reveal: 0,
          duration: opts.duration ?? 0.9,
          ease: opts.ease ?? 'power3.inOut',
          onUpdate: () => { img.style.clipPath = `inset(0% 0% ${proxy.reveal}% 0%)`; }
        });
        observer.unobserve(target);
      }
    });
  }, { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin ?? '0px 0px -60px 0px' });
  list.forEach(el => observer.observe(el));
}

// Wraps every word in its own inline-block span (needed for GSAP to
// move/fade them individually) while leaving the whitespace between
// them as plain text nodes, so normal word-wrapping still works.
// Walks the DOM recursively rather than flattening to textContent, so
// any inline markup already inside the paragraph (an icon <svg>, a
// colored <span>) survives untouched instead of being wiped out.
function splitWords(el) {
  function walk(node) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(token => {
          if (token === '') return;
          if (/^\s+$/.test(token)) {
            frag.appendChild(document.createTextNode(token));
          } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = token;
            frag.appendChild(span);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('word')) {
        walk(child);
      }
    });
  }
  walk(el);
  return el.querySelectorAll('.word');
}

// Each paragraph gets its own word-split + its own trigger, so a long
// page of copy reveals word-by-word, paragraph-by-paragraph as you
// scroll - never all at once.
function revealWordsOnScroll(paragraphs, opts = {}) {
  Array.from(paragraphs).forEach(p => {
    const words = splitWords(p);
    if (!words.length) return;
    gsap.set(words, { opacity: 0, y: 6 });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(words, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power1.out',
            stagger: 0.025
          });
          observer.unobserve(p);
        }
      });
    }, { threshold: opts.threshold ?? 0.3, rootMargin: opts.rootMargin ?? '0px 0px -40px 0px' });
    observer.observe(p);
  });
}

function initFooterClock() {
  const footerClockEl = document.getElementById('footerClock');
  if (!footerClockEl) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    footerClockEl.textContent = `INDIA: (GMT+5:30) ${timeStr}`;
  }

  update();
  setInterval(update, 30000);
}

initFooterClock();

// Click-to-enlarge, with a custom solid-white cursor badge standing in
// for the native pointer: a "+" while hovering a thumbnail, morphing
// to "-" for the whole enlarged overlay, since clicking anywhere in
// it (image or backdrop) closes the zoom. Skips images inside an <a>
// (e.g. the pager preview) so the click keeps navigating instead of
// also opening the overlay.
function initImageLightbox(selector) {
  const images = Array.from(document.querySelectorAll(selector)).filter(img => !img.closest('a'));
  if (!images.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = '<img class="lightbox__img" alt="">';
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('.lightbox__img');

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="custom-cursor__bar custom-cursor__bar--h"></span><span class="custom-cursor__bar custom-cursor__bar--v"></span>';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  function open(img) {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    cursor.classList.add('is-zoomed');
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    cursor.classList.remove('is-zoomed', 'is-active');
  }

  images.forEach(img => {
    img.addEventListener('click', () => open(img));
    img.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    img.addEventListener('mouseleave', () => {
      if (!lightbox.classList.contains('is-open')) cursor.classList.remove('is-active');
    });
  });

  lightbox.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
  lightbox.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  lightbox.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}
