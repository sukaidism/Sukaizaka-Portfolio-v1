# Paul Calma — Portfolio

A responsive portfolio built with Vite, HTML, CSS, and JavaScript. Based on the Figma `FINAL_LAYOUT` frame, with the three original project collages, animated carousel, contact reference adaptation, and a minimal footer.

## Run locally

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

```sh
npm run build
npm run preview
```

## Personalize

- Update contact placeholders in `src/content.js`, then set `isPlaceholder` to `false`.
- Add project URLs in `src/content.js`. Missing URLs are marked “Coming soon” until configured.
- The contact banner uses introductory copy, with no testimonial.
- Fonts and Figma assets are stored locally; the site does not depend on temporary Figma URLs.
- The Nowduke font was copied from your installed font. Confirm your font license covers web use before publishing.

## Interaction

The translucent navigation stays fixed at the top, with section anchors offset below it and soft gradient highlights for active, hovered, and focused links. Sections use the available viewport height; artwork scales against both width and height to avoid oversized desktop layouts.

The hero opens with a short splash and a staggered title/portrait entrance. Section content fades into view, and the hero title has subtle parallax. Projects uses a pinned viewport: scrolling shrinks and fades the title, then reveals the carousel in the same space. Scrolling back reverses the sequence. The “Scroll to explore” button also supports click and keyboard access. Reduced motion shows a static heading and the carousel immediately. Motion is handled in `src/motion.js`, with styles in `src/enhancements.css`.

The project carousel wraps in both directions, animates each navigation, and supports arrows on either side of the artwork, keyboard arrows, Home/End, direct project indicators, and touch swipes. Inactive slides are hidden from assistive technology.

Skills are displayed once in two stationary groups: Programming Language (JavaScript, PHP, Python) and Frameworks & Tools (AWS Management Console, Git, Laravel, Figma, Cisco Networking, Playwright). Cards gently lift and their oval outlines rotate on hover. Reduced-motion preferences disable these effects along with the splash, parallax, reveals, and carousel animation.

Skill icons reuse the Figma assets; the additional Laravel icon comes from the Devicon project.

## Browser verification

Start the development server, then run `npm test` for interactions and `npm run test:layout` for viewport sizing and the Projects scroll sequence. Tests use the locally installed Microsoft Edge browser and save screenshots in `test-results/`.
