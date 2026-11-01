# Project images

The profile cards use the portfolio's dark green and real project views. Margin and Relay are illustrated previews; the Margin example uses fictional data. Fjord Fleet Pricing shows a simulated university case. StrikeSignal is a dated product capture. ProcuraIQ uses the pitch-cover image supplied by Melvin. The earlier start-screen option remains in `source/`.

Source images are in `source/`; the templates and copy are in `render-project-cards.mjs`. To regenerate, run `npm install`, `npx playwright install chromium`, then `npm run render` from this folder. The completed desktop and mobile images are written to `../assets/projects/` with `-retina-v3` filenames at device scale 2. Margin and Relay use freshly captured 2x application views, with dedicated compact sources for mobile.

## Archived GIF experiment

`capture-demos.mjs` records the existing illustrated Margin and Relay demos, separately at desktop and compact sizes. Run with `DEMO_URL` pointing to the portfolio's `/in-the-works` route; the default is localhost:5320. `PLAYWRIGHT_MODULE` optionally selects an existing Playwright module. It writes temporary frames under `/private/tmp/profile-demo-frames`. Then run `python3 encode-demo-loops.py` with `FFMPEG` pointing to an ffmpeg executable. The resulting 12-second GIFs animate only the application view, with a brief fade between replays. Mobile cards use a taller preview area for readability.

The README now uses sharp PNG cards for Margin and Relay in all motion modes. Their links open the animated demos on the portfolio. The GIF exports are retained as an unused experiment; small UI text did not hold up at GitHub display size. The coastal banner still selects a static image when reduced motion is requested. Versioned ProcuraIQ and website images prevent stale GitHub image caching. The ProcuraIQ pitch is contained in the same card template as other projects. `personal-gull.png` is a cropped capture of the portfolio ASCII canvas with overlaid copy hidden. No private application data is used.
