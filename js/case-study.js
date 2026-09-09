/* =========================================================
   CASE STUDY SCRIPT
   Shared by every case-study page (project.html, airtel.html,
   undersea-cables.html, ...). Every page's hero must use the ids
   #case-study-title and #caseStudyHeroImage for this to find them.
   On-load entrance for the hero (title letters + image mask), the
   same two-step timeline as the index.html hero. Story content and
   the pager preview images reveal on scroll via js/story.js.
   Also drives a subtle scroll parallax on images that visually
   overlap a heading, via the GSAP ScrollTrigger plugin.
   ========================================================= */

const caseStudyTitleLetters = splitLetters(document.getElementById('case-study-title'));
// Footer wordmark: same split-letter reveal as index.html, triggered
// on scroll since it sits at the bottom of the page.
const footerWordmarkLetters = splitLetters(document.getElementById('footer-wordmark'));
observeTitle(footerWordmarkLetters);

const caseStudyTl = gsap.timeline();
const caseStudyHeroImageEl = document.getElementById('caseStudyHeroImage');
const caseStudyHeroImageReveal = { reveal: 100 };

caseStudyTl
  .to(caseStudyHeroImageReveal, {
    reveal: 0,
    duration: 1,
    ease: 'power3.inOut',
    onUpdate: () => { caseStudyHeroImageEl.style.clipPath = `inset(0% 0% ${caseStudyHeroImageReveal.reveal}% 0%)`; }
  })
  .add(() => revealLetters(caseStudyTitleLetters), '-=0.5');

/* ---------------------------------------------------------
   Parallax for images overlapping a heading/text.
   This scroll-linked `y` (a transform) and the mask reveal's
   `clip-path` (js/story.js) are entirely separate CSS properties, so
   they compose on the same element with no wrapper div needed.
   The hero image is deliberately excluded: .case-study-hero__meta is
   bottom-aligned to it with plain CSS (`bottom: 0`), which only
   works against the image's untransformed layout box - a parallax
   `y` on top of that would desync the two. */
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const parallaxTargets = document.querySelectorAll('.story-image--parallax');

  parallaxTargets.forEach(el => {
    gsap.to(el, {
      y: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/* ---------------------------------------------------------
   Custom "expand" cursor over the BACK/NEXT pager previews -
   same component + wiring as index.html's featured work cards
   (js/main.js), just targeting .case-study-pager-preview instead
   of .work-card (see css/case-study.css .custom-cursor).
   --------------------------------------------------------- */
const customCursor = document.getElementById('customCursor');
const pagerPreviews = document.querySelectorAll('.case-study-pager-preview');

if (customCursor && pagerPreviews.length) {
  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  });

  pagerPreviews.forEach(preview => {
    preview.addEventListener('mouseenter', () => customCursor.classList.add('is-active'));
    preview.addEventListener('mouseleave', () => customCursor.classList.remove('is-active'));
  });
}
