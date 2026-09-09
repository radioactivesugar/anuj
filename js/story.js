/* =========================================================
   STORY SCRIPT
   Wires up scroll reveal for the shared story-block components
   (css/story.css) used by aboutme.html and project.html.
   Depends on splitLetters/splitWords/observeTitle/revealOnScroll/
   revealWordsOnScroll from js/common.js.
   Each element animates independently the moment IT scrolls into
   view, so a long page of copy/images reveals progressively rather
   than all firing at once.
   ========================================================= */

// Lede paragraphs: words appear one by one. The about page's pull quote
// (.pull-quote) is also a .story-text__lede but gets its own
// scroll-scrubbed word reveal instead (js/about.js), so it's excluded here.
revealWordsOnScroll(document.querySelectorAll('.story-text__lede:not(.pull-quote)'));

// Regular body copy: fade + rise in as a whole paragraph.
revealOnScroll(
  document.querySelectorAll('.story-text__body'),
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
);

// Images: fade + rise in like body copy, not the hero's mask wipe -
// the wipe reads fine once (the hero) but is too much repeated down
// a whole page of images.
revealOnScroll(
  document.querySelectorAll('.story-image'),
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
);

// Doc-frame mockups (e.g. the SCRIPT section's Google-Docs stand-in)
// have no <img> to mask-reveal, so they get the same fade+rise as
// body copy instead.
revealOnScroll(
  document.querySelectorAll('.doc-frame'),
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
);

// Mid-page section headings (SCRIPT, EXPLORATIONS, Q&A, ...) get the
// same letter drop-in as the page's main title, triggered on scroll
// since these sit further down the page.
document.querySelectorAll('.story-heading').forEach(heading => {
  observeTitle(splitLetters(heading));
});

// Click-to-enlarge + custom cursor for every story image (see
// js/common.js) - skips the pager preview's image since that one's
// already a link to the next case study.
initImageLightbox('.story-image img');
