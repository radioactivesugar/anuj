This folder holds the cover image for each Archive timeline project
(the horizontal gallery on the homepage, under the bubble chart).

Filenames are fixed slots numbered by chronological position - not
derived from the project name anymore - matching the convention used
in images/project/, images/aboutme/, etc. Position 1 is the earliest
project on the timeline, position 43 the most recent. Drop a matching
.png in here and it's picked up automatically, no code changes
needed. Anything missing falls back to a plain placeholder photo, so
nothing breaks in the meantime.

This list is generated from timeline.csv's Date column - if a row's
date changes, or a row is added/removed, every position after it
shifts by one. Regenerate this list (ask Claude, or re-sort the CSV
by date yourself) whenever timeline.csv changes.

Expected filenames, from the current timeline.csv, oldest to newest:

01.png  <- Product Design — Carrier (2017-06)
02.png  <- Fiddling with my Mind (2017-12)
03.png  <- Packaging — Baarbara Coffee (2018-06)
04.png  <- Fabled Ciphers (2018-10)
05.png  <- Nuqi Social Media (2019-12)
06.png  <- Publication Design (2020-01, see note below - real date unconfirmed)
07.png  <- Limitless Institute (2020-04-16)
08.png  <- Hades — A Gateway to Olympus (2021-01-19)
09.png  <- Into Other Waters — For Love & Exploration (2021-02-16)
10.png  <- The Backbencher (2021-03-03)
11.png  <- School Performance Booster (2021-05)
12.png  <- Spiritfarer — Caring for the Lost (2021-05-03)
13.png  <- Assemble with Care — and Curiosity (2021-08-10)
14.png  <- Lost in Dungeon (2021-11-23)
15.png  <- Extractor (2022-02)
16.png  <- Project Age 99 (2022-05)
17.png  <- Zelda — A Breath of Fresh Wind (2022-06-29)
18.png  <- Press Start to Play (2022-08-28)
19.png  <- Trapped (2022-11)
20.png  <- The Hottest Chillis (2023-01)
21.png  <- The Root of Love (2023-02-06)
22.png  <- 1 Dash (2023-08)
23.png  <- Bumpy Ride (2023-09)
24.png  <- Crisis City (2024-04)
25.png  <- Cricket Kings (2025-02)
26.png  <- Cricket Score Hero (2025-07)
27.png  <- Moodstich (2025-07)
28.png  <- Taktse Report Card (2025-08)
29.png  <- Bird Map (2025-10)
30.png  <- Top of Tetris (2025-10-12)
31.png  <- Astrome Fresnal Calculator (2025-11)
32.png  <- 56 Bhog (2026-02)
33.png  <- Exp - #003 _ particle and audio (2026-02)
34.png  <- Exp. #006 _ particles and noise (2026-03)
35.png  <- Intermission: Asian Paints [Asian Paints episode] (2026-03-22)
36.png  <- Lighrock (2026-03-30)
37.png  <- Undersea cables (2026-04)
38.png  <- Aquiring Bubble Chart (2026-04-15)
39.png  <- Exp 010 . hand tracking + audio & object transform . (2026-05)
40.png  <- Intermission: Bajaj Finance (2026-05-11)
41.png  <- Intermission: Asian Paints [Bharti Airtel episode] (2026-06-28)
42.png  <- NBFC Revenue Chart (2026-07-06)
43.png  <- Intermission: Asian Paints [ITC episode] (2026-08-17)

--- Still worth fixing in timeline.csv (unrelated to filenames now) ---

Three rows (35, 41, 43 above) share the exact Project Name
"Intermission: Asian Paints", but their descriptions are clearly 3
different episodes - only row 35 is actually about Asian Paints; 41
is the Bharti Airtel episode and 43 is the ITC episode. This no
longer breaks image filenames (they're numbered by position now, not
by name), but the timeline tooltip's title still shows the wrong name
for 2 of the 3. Rename those rows' Project Name to match their real
subject.

The "Publication Design" row's Date cell is just "16th 2020" (missing
the month name) - it's currently defaulting to Jan 1, 2020 (slot 06
above). Fix that cell to its real date (e.g. "16th April 2020",
matching the format used elsewhere) to place it correctly - which
would also shift slot 06 onward by one position.
