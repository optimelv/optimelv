# Project images

The profile cards use the portfolio's dark green and real project views. Margin and Relay are illustrated previews; the Margin example uses fictional data. Fjord Fleet Pricing shows a simulated university case. StrikeSignal is a dated product capture. ProcuraIQ uses the pitch-cover image supplied by Melvin. The earlier start-screen option remains in `source/`.

Source images are in `source/`; the templates and copy are in `render-project-cards.mjs`. To regenerate, run `npm install`, `npx playwright install chromium`, then `npm run render` from this folder. The completed desktop and mobile images are written to `../assets/projects/`.
