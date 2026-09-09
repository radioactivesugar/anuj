/* =========================================================
   TIMELINE DATA (fallback)
   js/main.js fetches timeline.csv directly when the site is served
   over http/https (so editing the CSV and refreshing just works).
   fetch() of a local file is blocked by the browser when the page is
   opened directly as a file:// URL (no server) - Chrome CORS policy,
   not something fixable from JS. This file is a plain-text mirror of
   timeline.csv, embedded as a JS string so a <script> tag can load it
   (script loads are not subject to that same file:// restriction).
   Used automatically as a fallback only when the fetch fails.
   Regenerate this file whenever timeline.csv changes - ask Claude to
   re-run the conversion, or do it yourself with the same escaping
   (backslash and backtick and ${ all need escaping for the template
   literal below).
   ========================================================= */
window.TIMELINE_CSV_FALLBACK = `Projects,,,,,,,
,,,,,,,
Project Name,Duration,Type,Date,impact(0-9),Small Desc,Tools Used,Link
Hades — A Gateway to Olympus,1 week,Creatives,"Jan 19, 2021",3,"Breakdown of the game feel of Hades, a 3D dungeon crawler",Writing / Medium,https://medium.com/@radioactivesugar/hades-a-gateway-to-olympus-b5bc1b4f281a
Into Other Waters — For Love & Exploration,1 week,Creatives,"Feb 16, 2021",2,"Review of an intimate, text-based exploration game about love",Writing / Medium,https://medium.com/@radioactivesugar/into-other-waters-for-love-exploration-fa8fb39eaf0f
Spiritfarer — Caring for the Lost,1 week,Creatives,"May 3, 2021",2,Analysis of Spiritfarer's themes of caregiving and loss,Writing / Medium,https://medium.com/@radioactivesugar/spiritfarer-caring-for-the-lost-3f87a324c606
Assemble with Care — and Curiosity,2 weeks,Creatives,"Aug 10, 2021",3,How the game uses intuition & curiosity to drive gameplay,Writing / Medium,https://medium.com/@radioactivesugar/assemble-with-care-and-curiosity-35ea5231799e
Zelda — A Breath of Fresh Wind,3 weeks,Creatives,"Jun 29, 2022",5,Deep dive into the design of Breath of the Wild,Writing / Medium,https://medium.com/@radioactivesugar/zelda-a-breath-of-fresh-wind-1f5192bbcc25
The Backbencher,48 hours,Game Design,"Mar 03, 2021",3,"Point-and-click; nerdy Joe tries to become a backbencher, 6 endings","Unity, Procreate",https://radioactive-sugar.itch.io/the-backbencher
Lost in Dungeon,1 day,Game Design,"Nov 23, 2021",2,Text-based dungeon adventure; survivor finds a way out,Twine,https://radioactive-sugar.itch.io/lost-in-dungeon
Crisis City,1 month,Game Design,April 2024,5,"Crisis city is a point and click turn based 2D game, where the players act as the mayor of the city to re-build it from a disaster.","Unity, Procreate",https://radioactive-sugar.itch.io/crisis-city
Press Start to Play,48 hours,Game Design,"Aug 28, 2022",7,"""Is there a game? Play to find out"" BYOG 2023 3rd Prize",Unity,https://sangeeth.itch.io/press-start-to-play
The Root of Love,48 hours,Game Design,"Feb 06, 2023",4,2D point-and-click; grow roots to connect dying plants. Global Game Jam,Unity,https://karthicc.itch.io/the-root-of-love
Top of Tetris,48 hours,Game Design,"Oct 12, 2025",4,Escape rising lava by placing Tetris-block platforms,"Unity, Asprite",https://sangeeth.itch.io/byog-2025
1 Dash,3 months,Game Design,August 2023,7,One-tap endless arcade; save lives on a hit space stationStudent Game of the year Runner Up IGDC 2023,"Unity, Asprite",https://www.youtube.com/watch?v=arjMWZCM2dw
Project Age 99,2 weeks,Game Design,May 2022,3,Digital tabletop/card game hosted on Screentop,Screentop.gg,https://screentop.gg/@RadioactiveSugar/ProjectAge99
Cricket Kings ,12 weeks,Game Design,February 2025,3,This potrait cricket game was designed for a short gamplay session.,"Unity, Figma",https://www.youtube.com/watch?v=-vrGNQJv9Io
Cricket Score Hero,12 weeks,Game Design,July 2025,5,A Cricket game that was a landscape game with  was based on historic Indian matches.,"Unity, Figma",https://www.youtube.com/watch?v=IoxbOamQVuk
Bumpy Ride,4 weeks,Game Design,September 2023,2,A 3D game ideated for the TVS X.,"Unity, Blender",https://www.youtube.com/watch?v=X-2gBo9J2JA
Publication Design,2 weeks,Graphic Design,"16th 2020
",3,Behance publication/editorial design project,"Illustrator, Indesign",https://www.behance.net/gallery/86987935/Publication-Design
Limitless Institute,3 months,Graphic Design,"16th April 2020
",4,Created Brand collaterals and worksheets for events.,"Photoshop, Illustrator",https://www.behance.net/gallery/108600321/Limitless-Institute
Nuqi Social Media,1 week,Graphic Design,Decemeber 2019,2,Social media Assets for Client projects.,Illustrator,https://www.behance.net/gallery/107182571/Nuqi-Social-Media
Packaging — Baarbara Coffee,1 month,Graphic Design,June 2018,5,Coffee packaging design,"Photoshop, Illustrator",https://www.behance.net/gallery/86774121/Packaging-Baarbara-Coffee
School Performance Booster,1 month,Creatives,May 2021,4,Client Illustration project for a medical book about school performance,Procreate,https://www.behance.net/gallery/107250139/School-Performance-Booster
Fiddling with my Mind,3 weeks,Creatives,Dec 2017,7,Illustrations created by me during college down times.,Photoshop,https://www.behance.net/gallery/107110243/Fiddling-with-my-Mind
The Hottest Chillis,1 week,Visual Journalism,Jan 2023,3,Information design created for my curiosity of chillies,Illustrator,https://www.behance.net/gallery/118467893/The-Hottest-Chillis
Product Design — Carrier,1 month,Product design,June 2017,4,Industrial design created for my cafeteria in College to move hot food containers.,"Illustrator, Photoshop, Metal Gridinng, Wood Assembly",https://www.behance.net/gallery/78810825/Product-Design-Carrier
Fabled Ciphers,3 weeks,Creatives,October 2018,6,Created as part of the Inktober challenge.,Procreate,https://www.behance.net/gallery/77935623/Fabled-Ciphers
Trapped,1 month,Creatives,Novemeber 2022,8,Stop Motion animation created using Clay as a part of a college module with the theme 'Horror'.,Stop Motion,https://www.youtube.com/watch?v=3g_hbvJ4ue8
Extractor,1 month,Creatives,Feb 2022,2,"As a part of our character design module, we had to create concepts for a fictional character. My character was the Extractor.",Clay Sculpting,
Bird Map,1 week,Web Development,Oct 2025,3,"Using data from eBirds, we created a dashboard to map the migration patterns of 5 birds in Bangalore.","HTML, eCharts, eBird API, Claude",https://webdev-anuj.vercel.app/birds
Moodstich,1 week,Web Development,July 2025,2,"As a custmoised app made for my use, this project helps track mood and visualises it using colors","HTML, eCharts, Gemini",https://webdev-anuj.vercel.app/moodstitch
56 Bhog,3 weeks,Web Development,February 2026,1,3D Website [Under Development],"HTML, GSAP, Gemini, Blender",https://webdev-anuj.vercel.app/bhog56
Undersea cables,2 weeks,Visual Journalism,Apr 2026,8,Infographic showing Undesea cables used for interent connectivity.,"eCharts, GSAP, OpenStreetMap, Leaflet, CSS, JavaScript, Figma, GitHub, Google Gemini, Claude Code",https://the-ken.com/story/meta-to-get-the-worlds-longest-internet-cable-to-india-its-100-exposed/?share_code=MUhGLzFlRWZMQnp0aGl3UHN1R0JUODl6V0IxVkpOWnZzMW95U1c0QmJmST0%3D&t=260409055633
Lighrock ,2 weeks,Visual Journalism,30 Mar 2026,4,Infographic visualising the investment pattern of LIghtrock,"eCharts, CSS, JavaScript, Figma, GitHub, Google Gemini, Claude Code",https://the-ken.com/story/a-royal-familys-billion-dollar-bet-on-indian-startups-without-a-winner/
Aquiring Bubble Chart,2 weeks,Visual Journalism,15 Apr 2026,5,Data Viz showing the 6 big families of INdia aquiring a lot of companies.,"eCharts,  CSS, JavaScript, Figma, GitHub, Google Gemini, Claude Code",https://the-ken.com/story/reliance-to-adani-conglomerates-tighten-their-grip-on-the-economy-since-2021/
NBFC Revenue Chart,1 week,Visual Journalism,6 Jul 2026,7,Infographic showing the growth rate of NBFC Loan Sharks in 1 year.,"HTML, eCharts, Figma, Claude",https://the-ken.com/story/at-rbi-licensed-nbfcs-600-annual-interest-is-board-approved-reasonable-and-perfectly-legal/
Intermission: Asian Paints,4 weeks,Visual Journalism,22 Mar 2026,9,"Origins of Asian Paints (founded 1942, Bombay garage) and how it came to control >half of India's paint market","eCharts, GSAP, CSS, JavaScript, Figma, GitHub, Google Gemini, Claude Code",https://the-ken.com/intermission/the-business-of-colour-asian-paints/
Intermission: Airtel,4 weeks,Visual Journalism,11 May 2026,9,How Bajaj Auto Finance became Bajaj Finance and built India's consumer-credit infrastructure,"eCharts, GSAP, CSS, JavaScript, Figma, GitHub, Google Gemini, Claude Code",https://the-ken.com/intermission/a-bank-in-all-but-name-bajaj-finance/
Intermission: Asian Paints,4 weeks,Visual Journalism,28 Jun 2026,9,"How Bharti Airtel survived price wars, near-bankruptcy and Reliance to become a $100bn+ company","eCharts, GSAP, CSS, JavaScript, Figma, GitHub, Google Gemini, Claude Code",https://the-ken.com/intermission/the-unkillable-network-bharti-airtel/
Intermission: Asian Paints,4 weeks,Visual Journalism,17 Aug 2026,9,How a colonial cigarette company became one of India's most valuable conglomerates,"eCharts, GSAP, CSS, JavaScript, Figma, GitHub, Google Gemini, Claude Code",https://the-ken.com/intermission/the-fmcg-company-in-a-cigarette-pack-itc/?utm_source=web&utm_medium=intermission_landing&utm_campaign=intermission_landing
Exp - #003 _ particle and audio,1 day,Creatives,Feb 2026,3,AudioReactive Experience,Touch Designer,https://www.instagram.com/p/DU6ZbCnE7r4/
Exp. #006 _ particles and noise,1 day,Creatives,March 2026,6,AudioReactive Experience,Touch Designer,https://www.instagram.com/p/DVIBwWWk9c_/
Exp 010 . hand tracking + audio & object transform .,1 week,Creatives,May 2026,7,Hand Tracking and Visualisation Experience,Touch Designer,https://www.instagram.com/p/DYxAGE6qSwN/
Astrome Fresnal Calculator,2 days,Web Development,Nov 2025,4,This is a Fresnel Visualiser created for Astrome Interview,"HTML, Leaflet, OpenStreet Maps, ChatGpt",https://astrome-test-project-9wm9.vercel.app/
Taktse Report Card,2 weeks,Visual Journalism,August 2025,4,"In collaboration with Sensorium, I generated report cards for 12 classes of student with over 250 students.","Processing, p5.js",`;
