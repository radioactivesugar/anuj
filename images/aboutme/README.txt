This folder holds the images for "About Me" (aboutme.html).

Filenames are fixed slots, not content-derived - drop a same-named
.png in here and it appears automatically, no code edits needed.
Anything missing is simply skipped (the box shows its plain
placeholder background instead), so nothing breaks in the meantime.
Recommended: export at 1600px on the long edge, PNG. PNGs run
larger than JPGs - if a file's much over ~1-2MB, run it through an
optimizer (e.g. TinyPNG/Squoosh) before dropping it in.

Expected filenames:

00-cover.png  <- portrait photo, intro hero (left column)

That's the only slot this page uses. The rest of the page (pull
quote, disciplines, process, tools) is type/icon-based, not photo-
based - see prompt.md for the design system this page is built from.
The "one hero visual" showcase near the bottom of the page reuses
images/project/00-cover.png rather than a slot from this folder, so
it doubles as a real link into that case study.
