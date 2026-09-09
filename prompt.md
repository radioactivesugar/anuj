# Design System & Visual Language

Reference doc for this portfolio's design system — typography, color, layout,
motion, and the reusable components every page is built from. This is the
file mentioned in the Intermission case studies: the standardized set of
variables and conventions used to turn a one-off Gemini-generated prototype
into something that actually fits the site. Read this before adding a new
page or component; extend it (don't fork it) when you add something new.

---

## 1. Philosophy

- **Editorial, not corporate.** Big drop-cap-style type, generous whitespace,
  content read top-to-bottom like a magazine feature — not a SaaS landing
  page.
- **Monochrome base, color as data.** The site itself is grayscale (black
  text, light grey surfaces). Color is reserved for meaning: the five
  Archive category colors, and nothing else. Don't introduce a new brand
  color for decoration — if something needs color, it should be because it's
  *classifying* something.
- **One idea per screen.** Sections reveal progressively as you scroll,
  each element animating independently the moment it enters view, never all
  at once. The page should feel like it's being drawn in front of you, not
  loaded.
- **Real content over placeholder chrome.** Every image is a fixed,
  documented filename slot (`images/<page>/01.png`, ...) that degrades
  gracefully when missing (`onerror="this.remove()"`), never a broken-image
  icon. Ship the layout before the photography exists.

---

## 2. Design tokens

All defined in `css/style.css`'s `:root`. Use the token, not the raw value.

### Color

```css
--bg-color: #f4f4f4;        /* page background */
--bg-color-alt: #f5f5f7;
--text-color: #000000;      /* primary text / headings */
--text-muted: #555555;      /* body copy */
--text-faint: #6e6e73;      /* captions, dates, secondary meta */
--card-bg: #e2e2e2;
--card-bg-alt: #d9d9d9;
--card-bg-strong: #d1d1d6;  /* image placeholder background */
--card-border: #cccccc;
--dot-color: #888888;
--line-color: #1d1d1f;      /* near-black, used for rules/axis lines/icons */
```

**The five Archive/category colors** (`js/main.js`'s `archiveCategoryColors`
and mirrored in `css/style.css` as tokens — see §7) are the *only* accent
colors on the site:

| Category | Hex |
|---|---|
| Visual Journalism | `#e05d5d` |
| Graphic Design | `#2b9348` |
| Game Design | `#e3a008` |
| Web Development | `#3182ce` |
| Creatives | `#805ad5` |

If a new component needs to signal a category, use one of these five — don't
invent a sixth.

### Typography

Three fonts, three jobs. Never mix their roles.

```css
--font-heading: 'Anta', ...      /* section titles, wordmarks, headings */
--font-body: 'DM Sans', ...      /* lede/body copy */
--font-caption: 'Fragment Mono', ... /* dates, meta, labels, code, UI chrome */
--font-ui: -apple-system, ...    /* nav brand/links only — deliberately NOT
                                     one of the three above, per landing.jpg */
```

- **Anta** — display headings only. One weight (400) shipped; the CSS reset
  strips the browser's default heading bold so it never fake-bolds.
- **DM Sans** — all prose. `.story-text__lede` (bigger, tighter line-height)
  for the opening sentence of a section; `.story-text__body` (smaller,
  `--text-muted`) for everything after it.
- **Fragment Mono** — anything that reads as *metadata* or *UI*: dates,
  durations, tool lists, tags, doc-frame filenames, axis labels, tooltips.
  If it's a fact about the content rather than the content itself, it's
  Fragment Mono.

### Layout

```css
--max-width: 1240px;
--section-pad-x: 4rem;   /* 2rem at ≤992px, 1.5rem at ≤576px */
```

Every section is `.section` (max-width + centered + horizontal padding).
Nothing wider than 1240px except deliberately full-bleed elements (the idle
background wash, the custom cursor).

---

## 3. Motion language

Everything animates via GSAP, driven by `IntersectionObserver` — never on a
fixed page-load timer for below-the-fold content. Utilities live in
`js/common.js` and are shared by every page.

| Utility | What it does | Used for |
|---|---|---|
| `splitLetters(el)` + `revealLetters(letters)` | wraps text in `.letter` spans, animates `translateY(-120%) → 0%` | Every heading (`.section-title`, `.story-heading`) |
| `observeTitle(letters, opts)` | fires `revealLetters` when the heading scrolls into view; `{bidirectional:true}` also retreats it when scrolled back out | Landing-page titles (hero/work/contact) |
| `revealOnScroll(elements, from, to)` | generic fade+rise, each element triggering independently | `.story-text__body`, `.doc-frame`, decorative rails |
| `revealWordsOnScroll(paragraphs)` | splits into `.word` spans, staggers them in | `.story-text__lede` |
| `revealImageOnScroll(elements)` | clip-path wipe reveal (top→bottom), same mechanism as the hero image mask | `.story-image` |
| `initImageLightbox(selector)` | click-to-enlarge with a custom cursor badge | every `.story-image img` |
| `initFooterClock()` | live India-time readout | shared footer |

**Timing convention:** `duration: 0.8s`, `ease: 'power2.inOut'` for letter
reveals (in *and* out — inOut so a reversed/retreating animation doesn't
snap off at full speed); `0.9s`/`power3.inOut` for image mask wipes;
`stagger: { each: 0.05, from: 'center' }` for letters, `0.025–0.08` for
words/cards. Scroll-triggered `IntersectionObserver`s use `threshold: 0.2–0.4`
and a `rootMargin` that fires slightly *before* the element is fully in
view (`0px 0px -60px 0px`), so the reveal feels anticipatory, not late.

**Don't animate on a scroll-scrub.** Scroll-linked 1:1 scrubbing
(`ScrollTrigger`'s `scrub: true`) was tried for the landing titles and
reverted — it reads as choppy/mechanical for this kind of type animation.
Stick to threshold-triggered eased tweens.

**The image-mask trick** (used everywhere an image "wipes" into view):
tween a plain numeric proxy, not the `clip-path` string directly — the
browser can collapse an `inset()` value's redundant sides on read-back
(`inset(0% 0% 100% 0%)` → `inset(0% 0% 100%)`), and a string tween between
mismatched-length values silently stalls. Always rebuild the `clip-path`
string fresh every frame from a plain number in `onUpdate`.

**Glass panels get a scale+opacity settle-in**, not a slide — see §5.

**Respect `prefers-reduced-motion: reduce`** on every purely-decorative
`@keyframes` animation (idle bobbing, ambient drift). Scroll-triggered
content reveals stay (they're how content becomes visible at all), just
without extras like the custom cursor.

---

## 4. Spacing rhythm

- `.story-block`, `.story-text-block`, `.story-image-row`,
  `.story-columns`: **6rem** vertical margin by default — this is the
  page's base rhythm between major beats.
- A heading immediately before a block: the heading's own `margin-bottom`
  does the spacing (`.story-block--flush-top` zeroes the block's own
  top margin so they don't double up).
- Mobile (`≤900px`) roughly halves these — **4rem**/**2rem** — and every
  side-by-side layout (`.story-block`, `.story-columns`, `.story-image-row`)
  stacks to a single column.

---

## 5. Component library

### Section shell
`.section` → `.section-header-block` (centered title+subtitle) or a custom
hero. `.section-title` is the big Anta headline, always center-`justify`d by
default (heading-specific classes like `.hero-title`/`.case-study-hero__title`
override to left-aligned where the layout needs it).

### Text
`.story-text__lede` (bigger, DM Sans) → `.story-text__body` (smaller, muted)
is the standard paragraph pairing. `.meta-list` is the Fragment Mono
date/org/stack stack (each line a block-level `<span>`, 0.5rem apart) — used
in the case-study hero, work cards, and pager previews.

### Images
`.story-image` is the base unit: `4:3` by default, `border-radius: 8px`,
`box-shadow`, mask-reveals on scroll, opens in the shared lightbox on click.
Modifiers: `--full` (21:9, full-bleed), `--tall` (3:4), `--landscape`
(matches a specific source image's own ratio rather than cropping),
`--mobile`/`--ipad` (device screenshot ratios), `--rise` (negative
margin-top to tuck under a heading), `--parallax` (opt into the scroll-linked
drift in `js/case-study.js`).

Compose images with `.story-block` (text + one image, `--reverse` flips
sides), `.story-image-row` (2–4 images in a line), `.story-columns` (2–3
text columns, no images), or `.story-gallery-grid` (4-up grid with an
editorial scatter offset on alternating tiles).

### Overlapping headings
`.story-overlap` + `.story-overlap__heading`: a heading absolutely
positioned to overlap the top or bottom edge of the image/row beneath it
(`.story-heading--integration`, `--qa`, the pager's `.next-header`/
`.back-header`). Falls back to a normal stacked heading below `900px` — the
overlap is a desktop-only flourish.

### Doc-frame
`.doc-frame`: a minimal fake app-window mockup (titlebar + icon + filename +
page) standing in for a script/data excerpt until real content replaces it.
Same `4:3` box as `.story-image` so it sits evenly in a `.story-image-row`.
`.doc-frame__note` (red) + `.doc-frame__highlight` (yellow highlight span)
for an annotated revision note; `.doc-frame__code` for a monospace data dump
instead of prose.

### Callouts
`.story-callout--dark` (purple gradient, for a "here's the AI tool I used"
beat) / `--warm` (cream gradient). `.hl` for an inline highlight that adapts
to the callout's theme, `.accent-purple`/`.accent-orange` for a named tool
mention, `.inline-code` for a literal token like `` `prompt.md` ``.

### Glass / floating panels
The recurring "glassmorphism" treatment for anything that floats above
content — the Archive tooltip, the Archive panel background, the hero
skill-node info card:

```css
background-color: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(20–26px) saturate(180%);
-webkit-backdrop-filter: blur(20–26px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.75);
border-radius: 14–20px;
box-shadow:
  0 12–24px 30–48px rgba(0, 0, 0, 0.08–0.1),
  0 2px 8–10px rgba(0, 0, 0, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.85);
```

Larger surfaces (the Archive panel) use the higher end of the blur/shadow
range; small floating cards (tooltips) use the lower end. If a card has a
child flush against its edges (no padding), add `overflow: hidden` or the
child's square corners will poke past the card's rounded ones.

### Buttons / links
`.link-arrow`: uppercase, underlined, Fragment Mono-adjacent weight, paired
with a trailing `&#8599;` (↗) glyph, `opacity: 0.6` on hover. Used for every
outbound/social link. Don't invent a filled-button style — this site has no
solid CTA buttons, only text links.

### Featured grid
`.featured-card`: text-only editorial grid (label / title / description),
full-bleed via the negative-margin breakout trick (`100vw` + `left/right:50%`
+ matching negative margins) so it reaches the true viewport edges instead
of stopping at `--max-width`. Cover images never sit in the grid itself —
they only appear as a cursor-following preview (`#featuredCursor`): a plain
arrow badge by default anywhere over the grid, swapping to a small black dot
+ that card's own cover (`data-cover`) while over a specific card. One
deliberate one-off: `.featured-card__title` uses a system serif
(Georgia/Times New Roman) — the only serif on the site; every other heading
is Anta. Don't extend the serif elsewhere without a similarly deliberate
reason.

### Archive timeline
The one place data visualization and the design system meet directly:
eCharts scatter plot on a single-row timeline, bubbles sized by an
`impact(0-9)` field, colored by category, with the glass tooltip pinned near
the top of the chart (not tracking the cursor's y — every bubble sits
vertically centered in a short chart, so a tooltip that follows the cursor
down routinely lands back on top of the thing it's describing) and a
horizontally-scrolling gallery of cards synced to the hovered bubble.

### Case-study hero + pager
`.case-study-hero`: image (60%) + title overlapping its top-right corner +
meta list bottom-aligned to the image, independent of subtitle height.
`.case-study-pager`: BACK/NEXT preview cards at the foot of every case
study, chained in series order — each card shows the *linked* page's own
cover image (`images/<target-page>/00-cover.png`), not a local one, and its
label/image/body are all centered as one block.

---

## 6. Page & file conventions

- **One CSS file per concern, shared across pages**: `style.css` (tokens +
  shell), `hero.css`, `work.css`, `contact.css`, `story.css`, `case-study.css`
  (+ `case-study-alt.css` for the iframe-embed variant used by
  undersea-cables/lightrock/revenue-growth), `about.css`.
- **One CSS/JS file per page for page-only overrides** (`bajaj-finance.css`,
  `itc-prototypes.css`) — keep these small; if a rule would be useful on a
  second page, promote it into the shared file instead of duplicating it.
- **`js/common.js` loads first, always** — every page-specific script
  (`main.js`, `story.js`, `about.js`, `case-study.js`) depends on its
  utilities and assumes they're already defined.
- **Images live in `images/<page>/`**, numbered by position on the page
  (`00-cover.png`, `01.png`, `02.png`, ...), never named after their
  content — a `README.txt` in each folder documents which slot is which.
  Missing files degrade silently (`onerror="this.remove()"`); nothing ever
  shows a broken-image icon. When a slot becomes unused (e.g. a pager card
  switches to reusing another page's cover), remove it from the README
  rather than leaving a stale "expected filename" nobody will ever fill.
- **CDN-only dependencies, no build step.** GSAP, ECharts — plain `<script>`
  tags, pinned versions. No `npm install`, no bundler. If a library only
  ships as CommonJS, vendor the one file you need into `js/vendor/` and
  convert its single export line to ESM by hand rather than reaching for a
  bundler.

---

## 7. Extending the system

Before adding a new component, check: does this already exist as a
`.story-*` block, a glass panel, or a pill/tag pattern? Compose from what's
here before inventing new CSS.

When you do need something new:

1. **Type**: pick one of the three fonts by *role* (heading/body/caption),
   never by taste.
2. **Color**: grayscale by default; reach for one of the five category
   colors only if the element is classifying content, never for decoration.
3. **Motion**: threshold-triggered, eased, independent-per-element reveal —
   not a scroll-scrub, not everything firing on load.
4. **Spacing**: 6rem between major beats on desktop, halved on mobile.
5. **Name it** `.page-prefix__component` or promote it to a shared class if
   it'll be reused, and add a one-line comment explaining *why* it exists if
   the reason isn't obvious from the code itself.
6. **Write it down here** if it's a genuinely new pattern (not just a new
   instance of an existing one), so the next page built on this system
   starts from the same shared language instead of drifting from it.
