/* =========================================================
   ABOUT PAGE SCRIPT
   On-load entrance for the intro hero (name letters + image mask),
   the same two-step timeline as the index.html hero. Everything
   below the intro reveals on scroll via js/story.js.
   ========================================================= */

const aboutTitleLetters = splitLetters(document.getElementById('about-title'));
// Footer wordmark: same split-letter reveal as index.html, triggered
// on scroll since it sits at the bottom of the page.
const footerWordmarkLetters = splitLetters(document.getElementById('footer-wordmark'));
observeTitle(footerWordmarkLetters);

const aboutTl = gsap.timeline();
const aboutImageMaskEl = document.getElementById('aboutImageMask');
const aboutImageReveal = { reveal: 100 };

aboutTl
  .add(() => revealLetters(aboutTitleLetters))
  .to(aboutImageReveal, {
    reveal: 0,
    duration: 1,
    ease: 'power3.inOut',
    onUpdate: () => { aboutImageMaskEl.style.clipPath = `inset(0% 0% ${aboutImageReveal.reveal}% 0%)`; }
  }, '+=0.3');

// Reveals every child of `container` together as one staggered batch
// the moment the container itself scrolls into view, rather than each
// child triggering independently (js/common.js's revealOnScroll does
// the latter - fine for a long page of paragraphs, but a `stagger` on
// a single-element tween is a no-op, so a tight row like a tag list or
// a process flow needs its own container-level observer instead).
function revealGroupOnScroll(container, children, fromVars, toVars) {
  if (!container || !children.length) return;
  gsap.set(children, fromVars);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(children, toVars);
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
  observer.observe(container);
}

// Disciplines - the filter row and the tools row each reveal together,
// nudging up slightly with a short stagger.
revealGroupOnScroll(
  document.querySelector('.discipline-filters'),
  document.querySelectorAll('.discipline-filter'),
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }
);
revealGroupOnScroll(
  document.querySelector('.tools-row'),
  document.querySelectorAll('.tool-tag'),
  { opacity: 0, y: 10 },
  // clearProps strips the inline opacity/transform GSAP leaves behind
  // once the tween finishes - without it those inline styles (higher
  // specificity than any class selector) would permanently pin every
  // tag at opacity 1 / no transform, silently defeating the
  // .is-match / .has-active-filter dim-and-highlight rules in
  // about.css the moment a discipline filter is clicked.
  { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.03, clearProps: 'opacity,transform' }
);

// Process - same idea, one step after another across the row/column.
revealGroupOnScroll(
  document.querySelector('.process-flow'),
  document.querySelectorAll('.process-step'),
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }
);

// Discipline filters - clicking one highlights (via .is-match) the
// tools below that list it in their data-disciplines attribute;
// clicking the active filter again clears the selection. Only one
// filter is active at a time.
const disciplineFilters = document.querySelectorAll('.discipline-filter');
const toolsRow = document.querySelector('.tools-row');
const toolTags = document.querySelectorAll('.tool-tag');

disciplineFilters.forEach(filterBtn => {
  filterBtn.addEventListener('click', () => {
    const discipline = filterBtn.dataset.discipline;
    const wasActive = filterBtn.classList.contains('is-active');

    disciplineFilters.forEach(btn => btn.classList.remove('is-active'));

    if (wasActive) {
      toolsRow.classList.remove('has-active-filter');
      toolsRow.removeAttribute('data-active');
      toolTags.forEach(tag => tag.classList.remove('is-match'));
      return;
    }

    filterBtn.classList.add('is-active');
    toolsRow.classList.add('has-active-filter');
    toolsRow.dataset.active = discipline;
    toolTags.forEach(tag => {
      const disciplines = (tag.dataset.disciplines || '').split(' ');
      tag.classList.toggle('is-match', disciplines.includes(discipline));
    });
  });
});

// "Recent work" cursor dot - the ITC image is a link straight to the
// case study (see aboutme.html), so js/common.js's initImageLightbox
// deliberately skips it, leaving it with no cursor at all (native
// pointer hidden via .story-image img { cursor: none }, css/story.css).
// A plain black dot follows the mouse instead, active only while
// hovering that one link.
const cursorDot = document.getElementById('cursorDot');
const recentWorkLink = document.querySelector('a.story-image--full');

if (cursorDot && recentWorkLink) {
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });

  recentWorkLink.addEventListener('mouseenter', () => cursorDot.classList.add('is-active'));
  recentWorkLink.addEventListener('mouseleave', () => cursorDot.classList.remove('is-active'));
}

// Pull quote - words fade in one by one (10% -> 100% opacity) tracking
// the scrollbar directly, rather than story.js's default one-shot
// reveal-on-entry (see the :not(.pull-quote) exclusion in story.js).
// A scroll-scrubbed color fill on the parent <p> runs alongside it -
// color lives on the <p> and the split .word spans inherit it via
// currentColor, so the two tweens never touch the same property and
// compose cleanly.
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  const pullQuoteEl = document.querySelector('.pull-quote');
  if (pullQuoteEl) {
    const pullQuoteWords = splitWords(pullQuoteEl);
    gsap.set(pullQuoteWords, { opacity: 0.1 });

    const pullQuoteTl = gsap.timeline({
      scrollTrigger: {
        trigger: pullQuoteEl,
        start: 'top 85%',
        end: 'top 35%',
        scrub: true
      }
    });

    pullQuoteTl
      .to(pullQuoteEl, {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000000',
        ease: 'none'
      }, 0)
      .to(pullQuoteWords, {
        opacity: 1,
        ease: 'none',
        stagger: 0.15
      }, 0);
  }
}

// Resume popup - opens resume.html (a fixed-size A4 print page,
// 793x1123px at 96dpi) in an iframe instead of letting the link
// navigate. The iframe always renders resume.html at that true size;
// scale shrinks/grows it with a CSS transform. Zoom starts at
// "fit" (the whole page visible) and the user can zoom in/out from
// there with the toolbar controls, +/-/0 keys, or ctrl/cmd+scroll;
// the frame-wrap becomes a scrollable viewport once zoomed past fit
// rather than fighting the page's own mm-based print layout with
// responsive CSS.
const resumeLink = document.getElementById('resumeLink');
const resumeModal = document.getElementById('resumeModal');
const resumeModalBackdrop = document.getElementById('resumeModalBackdrop');
const resumeModalClose = document.getElementById('resumeModalClose');
const resumeFrame = document.getElementById('resumeFrame');
const resumeFrameWrap = document.getElementById('resumeFrameWrap');
const resumeZoomIn = document.getElementById('resumeZoomIn');
const resumeZoomOut = document.getElementById('resumeZoomOut');
const resumeZoomLevel = document.getElementById('resumeZoomLevel');

if (resumeLink && resumeModal && resumeFrame && resumeFrameWrap) {
  const RESUME_W = 793;
  const RESUME_H = 1123;
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 3;
  const ZOOM_FACTOR = 1.2;

  let fitScale = 1;
  let scale = 1;

  function getViewport() {
    const toolbarH = resumeModal.querySelector('.resume-modal__toolbar').offsetHeight;
    const maxW = window.innerWidth * 0.9;
    const maxH = window.innerHeight * 0.92 - toolbarH;
    return { maxW, maxH };
  }

  function render() {
    const { maxW, maxH } = getViewport();
    resumeFrameWrap.style.width = `${maxW}px`;
    resumeFrameWrap.style.height = `${maxH}px`;
    resumeFrame.style.transform = `scale(${scale})`;
    resumeFrameWrap.classList.toggle('is-zoomed', scale > fitScale + 0.001);
    if (resumeZoomLevel) resumeZoomLevel.textContent = `${Math.round(scale * 100)}%`;
    if (resumeZoomOut) resumeZoomOut.disabled = scale <= MIN_SCALE + 0.001;
    if (resumeZoomIn) resumeZoomIn.disabled = scale >= MAX_SCALE - 0.001;
  }

  function setScale(next) {
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    render();
  }

  function zoomIn() { setScale(scale * ZOOM_FACTOR); }
  function zoomOut() { setScale(scale / ZOOM_FACTOR); }
  function resetZoom() {
    const { maxW, maxH } = getViewport();
    fitScale = Math.min(maxW / RESUME_W, maxH / RESUME_H, 1);
    setScale(fitScale);
  }

  function openResumeModal() {
    if (!resumeFrame.src) resumeFrame.src = 'resume.html';
    resetZoom();
    resumeModal.classList.add('is-open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    resumeModal.classList.remove('is-open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  resumeLink.addEventListener('click', (e) => {
    e.preventDefault();
    openResumeModal();
  });
  resumeModalClose.addEventListener('click', closeResumeModal);
  resumeModalBackdrop.addEventListener('click', closeResumeModal);
  if (resumeZoomIn) resumeZoomIn.addEventListener('click', zoomIn);
  if (resumeZoomOut) resumeZoomOut.addEventListener('click', zoomOut);
  if (resumeZoomLevel) resumeZoomLevel.addEventListener('click', resetZoom);

  document.addEventListener('keydown', (e) => {
    if (!resumeModal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeResumeModal();
    else if (e.key === '+' || e.key === '=') zoomIn();
    else if (e.key === '-' || e.key === '_') zoomOut();
    else if (e.key === '0') resetZoom();
  });

  resumeFrameWrap.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else if (e.deltaY > 0) zoomOut();
  }, { passive: false });

  window.addEventListener('resize', () => {
    if (resumeModal.classList.contains('is-open')) render();
  });
}
