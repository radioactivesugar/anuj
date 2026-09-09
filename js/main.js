/* =========================================================
   MAIN SCRIPT (index.html only)
   Shared utilities (splitLetters/revealLetters/observeTitle/
   revealOnScroll/initFooterClock) now live in js/common.js, which is
   loaded before this file.
   1. Hero section        - ported from landing.html
   2. Work section        - featured grid reveal + Archive timeline
                             (Archive block ported from timeline.html)
   ========================================================= */
// Shared by both the hero section's skill nodes and the archive
// timeline below - the same 5 categories, same colors, in both
// places (timeline.csv's own Type column uses these exact names).
const archiveCategories = [
  'Visual Journalism',
  'Graphic Design',
  'Game Design',
  'Web Development',
  'Creatives'
];

const archiveCategoryColors = {
  'Visual Journalism': '#e05d5d',
  'Graphic Design': '#2b9348',
  'Game Design': '#e3a008',
  'Web Development': '#3182ce',
  'Creatives': '#805ad5'
};

// Split every section title up front so layout doesn't shift later.
const heroLetters = splitLetters(document.getElementById('hero-title'));
const workLetters = splitLetters(document.getElementById('work-title'));
const contactLetters = splitLetters(document.getElementById('contact-title'));
// Footer wordmark reuses the same split, but css/contact.css flips its
// starting position so it rises up from below instead of dropping in.
const footerWordmarkLetters = splitLetters(document.getElementById('footer-wordmark'));

// Every title reveals/retreats as it scrolls in and out of view
// (observeTitle comes from js/common.js) - hero-title happens to
// already be in view at load, so this still plays as an immediate
// entrance there, but now also drops back up if scrolled fully past
// and re-enters on the way back, same as the titles below the fold.
observeTitle(heroLetters, { bidirectional: true });
observeTitle(workLetters, { bidirectional: true });
observeTitle(contactLetters, { bidirectional: true });
observeTitle(footerWordmarkLetters, { bidirectional: true, hiddenY: '120%' });

// Lines up the "A" that ends "BASED IN INDIA" with the right edge of
// the "R" that ends "DESIGNER" - not the title/wrapper/section's own
// edge, and not the subtitle's own start either. DESIGNER is centered
// within the full-width .hero-title-wrapper (css `.section-title`'s
// justify-content:center), so its rendered position moves with
// viewport width/font-size and can't be reached with CSS alone;
// #heroSubtitleLastLetter (wrapping just that final "A") gives a
// measurable point on the subtitle's side the same way heroLetters'
// last entry (from splitLetters - already applied to the whole title
// for its own drop-in reveal) does on the title's. Re-measures from
// wherever the subtitle currently sits, so it converges correctly on
// repeated calls (e.g. on resize) regardless of the starting position.
// Skipped below the 576px breakpoint, where css/hero.css switches the
// subtitle to a static, centered layout instead (not enough room
// beside DESIGNER there).
function alignHeroSubtitleToTitle() {
  if (window.innerWidth <= 576) return;
  const wrapper = document.querySelector('.hero-title-wrapper');
  const subtitle = document.querySelector('.hero-subtitle');
  const subtitleLastLetter = document.getElementById('heroSubtitleLastLetter');
  const titleLastLetter = heroLetters[heroLetters.length - 1];
  if (!wrapper || !subtitle || !subtitleLastLetter || !titleLastLetter) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const currentSubtitleLeft = subtitle.getBoundingClientRect().left - wrapperRect.left;
  const delta = titleLastLetter.getBoundingClientRect().right - subtitleLastLetter.getBoundingClientRect().left;
  subtitle.style.left = `${currentSubtitleLeft + delta}px`;
}

alignHeroSubtitleToTitle();
window.addEventListener('resize', alignHeroSubtitleToTitle);
// Re-measure once the real webfonts (css/style.css @font-face, all
// font-display: swap) have actually swapped in - the first call above
// runs against fallback-font metrics, which render DESIGNER/BASED IN
// INDIA at slightly different widths than the real fonts do.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(alignHeroSubtitleToTitle);
}

/* ---------------------------------------------------------
   1. Hero section (ported from landing.html)
   --------------------------------------------------------- */
const heroImageMaskEl = document.getElementById('heroImageMask');
const heroImageReveal = { reveal: 100 };

// Timed to land just after the hero title's own reveal (0.8s duration
// + the 0.3s gap the two used to share on one timeline), now that the
// title's animation is driven by observeTitle above instead.
gsap.to(heroImageReveal, {
  reveal: 0,
  duration: 1,
  ease: 'power3.inOut',
  delay: 1.1,
  onUpdate: () => { heroImageMaskEl.style.clipPath = `inset(0% 0% ${heroImageReveal.reveal}% 0%)`; }
});

// Static project preview panel beside the hero image (css/hero.css's
// .hero-preview) - replaces the old legend-hover, cursor-following
// info card. Driven by the Archive timeline's own bubble hover
// instead (see initArchive() below, where archiveChart/
// archiveProjects come into scope) - updateHeroPreview just owns the
// crossfade itself, called from there. One-directional on purpose:
// only hovering a bubble changes the panel, moving off it does
// nothing, so whatever was last hovered stays shown.
const heroPreview = document.getElementById('heroPreview');
const heroPreviewFrame = document.getElementById('heroPreviewFrame');
const heroPreviewImage = document.getElementById('heroPreviewImage');
const heroPreviewTitle = document.getElementById('heroPreviewTitle');
const heroPreviewSubtitle = document.getElementById('heroPreviewSubtitle');
const heroPreviewMeta = document.getElementById('heroPreviewMeta');
const heroPreviewTextEls = [heroPreviewTitle, heroPreviewSubtitle, heroPreviewMeta];

// Crossfades the panel's text and glass frame (image included) out,
// swaps in the hovered bubble's own content, then fades back in -
// `overwrite: true` on the timeline lets a fast sweep across several
// bubbles interrupt cleanly instead of queuing up a backlog of tweens.
// .is-project on #heroPreview (css/hero.css) only toggles the frame's
// glass fill (background/border/shadow) - title/subtitle/meta keep
// the same position/size/color in both states, so this crossfade
// never shifts layout, just swaps copy and fades the frame's fill.
function updateHeroPreview(imgSrc, imgFallback, proj) {
  if (!heroPreview) return;

  gsap.timeline({ defaults: { duration: 0.25, ease: 'power1.out' }, overwrite: true })
    .to(heroPreviewTextEls, { opacity: 0 }, 0)
    .to(heroPreviewFrame, { opacity: 0 }, 0)
    .call(() => {
      heroPreview.classList.add('is-project');
      heroPreviewTitle.textContent = proj.name;
      heroPreviewSubtitle.textContent = proj.subtitle || '';
      heroPreviewMeta.textContent = proj.stack ? `Tools: ${proj.stack}` : '';
      heroPreviewImage.onerror = () => { heroPreviewImage.src = imgFallback; };
      heroPreviewImage.src = imgSrc;
    })
    .to(heroPreviewTextEls, { opacity: 1 }, '+=0.02')
    .to(heroPreviewFrame, { opacity: 1 }, '<');
}

/* ---------------------------------------------------------
   2a. Featured grid - scroll reveal
   Plain fade+rise (not the clip-path image mask other reveals use) -
   each card's own cover image lives inside it now and crossfades in
   on hover/focus via CSS alone (.featured-card__image, css/work.css).
   --------------------------------------------------------- */
const featuredCards = document.querySelectorAll('.featured-card');

revealOnScroll(
  featuredCards,
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
);

/* ---------------------------------------------------------
   2a-i. Custom "view" cursor over the featured cards - same
   white-circle-with-arrow component as the case-study pager
   previews (see css/case-study.css .custom-cursor); its own copy
   lives in css/work.css since index.html doesn't load
   case-study.css. Header nav links keep the default cursor - see
   .site-nav__link::after in css/style.css for their hover state.
   --------------------------------------------------------- */
const customCursor = document.getElementById('customCursor');
const customCursorTargets = document.querySelectorAll('.featured-card');

if (customCursor && customCursorTargets.length) {
  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  });

  customCursorTargets.forEach(target => {
    target.addEventListener('mouseenter', () => customCursor.classList.add('is-active'));
    target.addEventListener('mouseleave', () => customCursor.classList.remove('is-active'));
  });
}

/* ---------------------------------------------------------
   2b. Archive timeline + gallery (ported from timeline.html)
   Real project data lives in timeline.csv (fetched + parsed below)
   rather than being hardcoded here - edit that file to add/update
   projects, no JS changes needed for ordinary edits.
   --------------------------------------------------------- */
// timeline.csv has one project under "Product design", which isn't
// one of the 5 categories above - it lands in Creatives (closest fit:
// a personal college project, not client Graphic Design work). If a
// future CSV row uses a category outside the 5 above, it'll land here
// too - rename it to one of the 5 in the CSV to place it deliberately.
const ARCHIVE_CATEGORY_FALLBACK = 'Creatives';

// Random (but stable per-project, via the seed) placeholder photo -
// used until a real image is dropped into images/archive/ for that
// project (see the numbering assigned in initArchive() below + the
// README in that folder for the exact filename each project expects).
function getArchiveFallbackImage(id) {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/400/300`;
}

/* Minimal CSV parser: handles quoted fields, commas/newlines inside
   quotes, and "" as an escaped quote (RFC4180-ish) - enough for
   timeline.csv's mixed date formats and multi-line quoted fields
   without pulling in a library. */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const ARCHIVE_MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10, novemeber: 10,
  dec: 11, december: 11, decemeber: 11
};

// timeline.csv's Date column mixes "Mon DD, YYYY", "DD Mon YYYY" (with
// an optional "1st/2nd/3rd/16th"), and "Month YYYY" (day defaults to
// the 1st). Falls back to just the year (Jan 1) - with a console
// warning - if no month name can be found at all; see the
// "Publication Design" row, whose Date cell is just "16th 2020" in
// the CSV (missing the month) - fix that cell to get its real date.
function parseArchiveDate(raw) {
  const str = raw.trim().replace(/\s+/g, ' ');

  let m = str.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s*(\d{4})$/);
  if (m && ARCHIVE_MONTHS[m[1].toLowerCase()] !== undefined) {
    return new Date(parseInt(m[3], 10), ARCHIVE_MONTHS[m[1].toLowerCase()], parseInt(m[2], 10)).getTime();
  }

  m = str.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\.?\s+(\d{4})$/);
  if (m && ARCHIVE_MONTHS[m[2].toLowerCase()] !== undefined) {
    return new Date(parseInt(m[3], 10), ARCHIVE_MONTHS[m[2].toLowerCase()], parseInt(m[1], 10)).getTime();
  }

  m = str.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (m && ARCHIVE_MONTHS[m[1].toLowerCase()] !== undefined) {
    return new Date(parseInt(m[2], 10), ARCHIVE_MONTHS[m[1].toLowerCase()], 1).getTime();
  }

  m = str.match(/(\d{4})/);
  if (m) {
    console.warn(`[archive] couldn't fully parse date "${raw}" - defaulting to Jan 1, ${m[1]}. Check timeline.csv.`);
    return new Date(parseInt(m[1], 10), 0, 1).getTime();
  }

  console.warn(`[archive] couldn't parse date "${raw}" at all - dropping that row. Check timeline.csv.`);
  return null;
}

function formatArchiveDate(timestamp) {
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

async function fetchTimelineCSVText() {
  try {
    const res = await fetch('timeline.csv');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    // fetch() of a local file is blocked by the browser when this page
    // is opened directly as a file:// URL (no server) - not fixable
    // from JS. Fall back to the embedded copy from js/timeline-data.js
    // (kept in sync with timeline.csv - regenerate it if the CSV
    // changes and the site is meant to also work opened as a file).
    if (typeof window.TIMELINE_CSV_FALLBACK === 'string') {
      console.warn('[archive] fetch(timeline.csv) failed (likely opened as a file:// page) - using the embedded fallback copy from js/timeline-data.js instead. Edits to timeline.csv won\'t show up until that fallback is regenerated.', err);
      return window.TIMELINE_CSV_FALLBACK;
    }
    throw err;
  }
}

async function loadArchiveProjects() {
  const text = await fetchTimelineCSVText();
  const rows = parseCSV(text).filter(r => r.some(cell => cell.trim() !== ''));

  // Row 0 is "Projects,,,,,,," (a section label) - the real header is
  // the first row that starts with "Project Name".
  const headerIndex = rows.findIndex(r => r[0] && r[0].trim() === 'Project Name');
  const header = rows[headerIndex].map(h => h.trim());
  const dataRows = rows.slice(headerIndex + 1);

  const col = (row, name) => {
    const idx = header.indexOf(name);
    return idx === -1 ? '' : (row[idx] || '').trim();
  };

  const projects = [];
  dataRows.forEach((row, i) => {
    const name = col(row, 'Project Name');
    if (!name) return;

    const timestamp = parseArchiveDate(col(row, 'Date'));
    if (timestamp === null) return;

    const rawCategory = col(row, 'Type');
    const category = archiveCategoryColors[rawCategory] ? rawCategory : ARCHIVE_CATEGORY_FALLBACK;

    projects.push({
      id: i,
      name,
      subtitle: col(row, 'Small Desc'),
      dateStr: formatArchiveDate(timestamp),
      timestamp,
      duration: col(row, 'Duration'),
      category,
      impact: parseFloat(col(row, 'impact(0-9)')) || 1,
      stack: col(row, 'Tools Used'),
      link: col(row, 'Link'),
      color: archiveCategoryColors[category]
    });
  });

  projects.sort((a, b) => a.timestamp - b.timestamp);
  // Stamped onto each project (rather than derived from its array
  // position when needed) because echarts clones series.data
  // internally on setOption - by the time a hover handler reads
  // params.data.projectData back, it's a clone with no shared
  // identity with the objects in this array, so
  // archiveProjects.indexOf(proj) always came back -1. A plain number
  // survives that clone fine.
  projects.forEach((p, idx) => { p.imageIndex = idx + 1; });
  return projects;
}

(async function initArchive() {
  let archiveProjects;
  try {
    archiveProjects = await loadArchiveProjects();
  } catch (err) {
    console.error('[archive] failed to load timeline.csv', err);
    return;
  }
  if (!archiveProjects.length) return;

  const ARCHIVE_PAD_MS = 1000 * 60 * 60 * 24 * 45; // ~45 days breathing room either side
  const ARCHIVE_MIN_TIME = archiveProjects[0].timestamp - ARCHIVE_PAD_MS;
  const ARCHIVE_MAX_TIME = archiveProjects[archiveProjects.length - 1].timestamp + ARCHIVE_PAD_MS;

  const archiveChartDom = document.getElementById('archiveChart');
  const archiveChart = echarts.init(archiveChartDom);

  function prepareArchiveSeriesData(filteredData) {
    const sortedByImpact = [...filteredData].sort((a, b) => b.impact - a.impact);

    return sortedByImpact.map(p => ({
      name: p.name,
      value: [p.timestamp, 0, p.impact, p.category, p.id],
      projectData: p,
      itemStyle: {
        color: p.color,
        opacity: 0.6
      }
    }));
  }

  const archiveChartOption = {
    tooltip: { show: false },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '10%'
    },
    xAxis: {
      type: 'time',
      min: ARCHIVE_MIN_TIME,
      max: ARCHIVE_MAX_TIME,
      splitLine: { show: false },
      axisLine: {
        onZero: true,
        lineStyle: { color: '#1d1d1f', width: 1.5 }
      },
      axisLabel: {
        color: '#1d1d1f',
        formatter: '{yyyy}',
        verticalAlign: 'middle',
        margin: -22,
        fontSize: 11,
        fontWeight: 'bold'
      },
      axisTick: {
        alignWithLabel: true,
        length: 10,
        inside: true,
        lineStyle: { color: '#1d1d1f', width: 1.5 }
      }
    },
    yAxis: {
      type: 'value',
      min: -10,
      max: 10,
      show: false
    },
    series: [{
      type: 'scatter',
      symbolSize: function (data) {
        return data[2] * 7;
      },
      data: prepareArchiveSeriesData(archiveProjects),
      animationDuration: 400,
      emphasis: {
        scale: 1.12,
        itemStyle: {
          opacity: 0.6,
          shadowBlur: 8,
          shadowColor: 'rgba(0,0,0,0.15)'
        }
      }
    }]
  };

  archiveChart.setOption(archiveChartOption);

  // Hovering a bubble drives the .hero-preview panel above (css/
  // hero.css) instead of a tooltip - image numbered by the project's
  // chronological position in archiveProjects (same convention the
  // old gallery used: images/archive/01.png is the earliest project,
  // etc. - see images/archive/README.txt), falling back to a stable
  // placeholder photo if that slot has no real image yet. Deliberately
  // one-directional: there's no mouseout handler, so moving off a
  // bubble leaves the panel showing whatever was last hovered instead
  // of reverting to the default copy.
  archiveChart.on('mouseover', 'series', function (params) {
    const proj = params.data.projectData;
    const src = `images/archive/${String(proj.imageIndex).padStart(2, '0')}.png`;
    updateHeroPreview(src, getArchiveFallbackImage(proj.id), proj);
  });

  // Clicking a bubble jumps down to the Work section (css/style.css's
  // scroll-behavior: smooth animates it) instead of linking out to a
  // project page directly - the timeline lives up in the hero/about
  // section, so this is just "show me the projects".
  archiveChart.on('click', 'series', function () {
    window.location.hash = 'works';
  });

  let selectedArchiveCategories = new Set(['All']);
  const archiveFilterButtons = document.querySelectorAll('.archive-filter-btn');

  archiveFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;

      if (cat === 'All') {
        selectedArchiveCategories.clear();
        selectedArchiveCategories.add('All');
      } else {
        selectedArchiveCategories.delete('All');
        if (selectedArchiveCategories.has(cat)) {
          selectedArchiveCategories.delete(cat);
          if (selectedArchiveCategories.size === 0) selectedArchiveCategories.add('All');
        } else {
          selectedArchiveCategories.add(cat);
        }
      }

      archiveFilterButtons.forEach(b => {
        if (selectedArchiveCategories.has(b.dataset.category)) {
          b.classList.add('is-active');
        } else {
          b.classList.remove('is-active');
        }
      });

      const activeProjects = archiveProjects.filter(p =>
        selectedArchiveCategories.has('All') || selectedArchiveCategories.has(p.category)
      );

      archiveChart.setOption({
        series: [{
          data: prepareArchiveSeriesData(activeProjects)
        }]
      });
    });
  });

  window.addEventListener('resize', () => {
    archiveChart.resize();
  });
})();

// Footer live clock (initFooterClock) is started from js/common.js.
