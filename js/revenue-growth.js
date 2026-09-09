/* =========================================================
   REVENUE GROWTH DATA SHEET
   Wires the in-frame layer toolbar (css/revenue-growth.css
   .sheet-btn, built into the .sheet-frame titlebar area) to the
   Excel-style preview of 02.csv below it - clicking a button
   highlights the column(s) of the sheet that layer of information
   actually comes from, tinted with that button's own
   primary/secondary colour. Single-select: clicking the active
   button again clears the highlight rather than leaving it stuck on.
   Mirrors js/lightrock.js.
   ========================================================= */

const revenueGrowthDataCards = document.querySelectorAll('.sheet-btn');
const revenueGrowthSheetCells = document.querySelectorAll('#revenueGrowthSheet [data-col]');
const revenueGrowthToolbar = document.querySelector('.sheet-frame__toolbar');

const clearRevenueGrowthHighlight = () => {
  revenueGrowthSheetCells.forEach(cell => {
    cell.classList.remove('is-highlighted--primary', 'is-highlighted--secondary');
  });
  revenueGrowthDataCards.forEach(card => {
    card.classList.remove('is-active');
    card.setAttribute('aria-pressed', 'false');
  });
};

revenueGrowthDataCards.forEach(card => {
  card.addEventListener('click', () => {
    // First click anywhere in the toolbar: the attention-grabbing
    // glow has done its job, so stop pulsing next to a table someone
    // is now actually trying to read.
    revenueGrowthToolbar.classList.add('has-interacted');

    const wasActive = card.classList.contains('is-active');
    const columns = card.dataset.columns.split(',');
    const highlightClass = `is-highlighted--${card.dataset.layer}`;

    clearRevenueGrowthHighlight();
    if (wasActive) return;

    card.classList.add('is-active');
    card.setAttribute('aria-pressed', 'true');

    // Deferred to the next frame so the browser registers the classes
    // as freshly removed above before they're reapplied here - without
    // this, switching straight from one highlighted column to another
    // that shares a cell never restarts the CSS flash animation, since
    // both removal and addition would land in the same style pass.
    requestAnimationFrame(() => {
      revenueGrowthSheetCells.forEach(cell => {
        if (columns.includes(cell.dataset.col)) cell.classList.add(highlightClass);
      });
    });
  });
});

// Same fade+rise the DESIGN section's stack images use, since a
// data-grid frame has no <img> to mask-reveal like .story-image.
revealOnScroll(
  document.querySelectorAll('.sheet-frame'),
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
);
