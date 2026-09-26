import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import './style.css';
import './enhancements.css';
import './project-layout.css';
import { contact, projectLinks } from './content.js';
import { initializeMotion } from './motion.js';

const asset = (file, alt = '', className = '', extra = '') => `<img src="/assets/${file}" alt="${alt}" class="${className}" ${extra}>`;
const projectLink = (label, key) => projectLinks[key]
  ? `<a class="project-link" href="${projectLinks[key]}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">→</span></a>`
  : `<span class="project-link unavailable" aria-disabled="true" title="Project URL has not been added yet">${label} <span aria-hidden="true">→</span><small>Coming soon</small></span>`;
const icon = (name) => {
  const paths = {
    email: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
    phone: '<path d="m7 3 3 5-3 3a16 16 0 0 0 6 6l3-3 5 3-2 4C10 22 2 14 3 5Z"/>',
    location: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  };
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

const skillGroups = [
  { id: 'languages', title: 'Programming Language', items: [
    ['JavaScript', 'a7d26.svg'], ['PHP', '46517.svg'], ['Python', 'ae866.svg'],
  ] },
  { id: 'tools', title: 'Frameworks & Tools', items: [
    ['AWS Management Console', '2d3ac.svg'], ['Git', '1cf89.svg'], ['Laravel', 'laravel.svg'],
    ['Figma', 'e9035.svg'], ['Cisco Networking', '2d29a.svg'], ['Playwright', 'ee454.svg'],
  ] },
];
const skillCards = items => items.map(([name,file]) => `
  <li class="skill-card">
    <div class="skill-decoration" aria-hidden="true">${asset('97493.svg','','skill-oval')}${asset('3fe91.svg','','skill-oval tilted')}</div>
    <div class="skill-content"><div class="skill-icon">${asset(file, '', name === 'Laravel' ? 'laravel-logo' : '')}</div><span>${name}</span></div>
  </li>`).join('');

document.querySelector('#app').innerHTML = `
      <header class="site-header">
        <a href="#home" class="wordmark" aria-label="Paul Calma home">PAUL CALMA</a>
        <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation"><span></span><span></span></button>
        <nav id="navigation" aria-label="Main navigation">
          <a href="#home" aria-current="page">Home</a><a href="#about">About Me</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a>
        </nav>
      </header>
  <main>
    <section class="hero" id="home" aria-label="Paul Calma portfolio">
      <div class="hero-splash" aria-hidden="true"><span>PAUL CALMA</span><span class="splash-caption">PORTFOLIO / IT INFRASTRUCTURE</span><i></i></div>
      <div class="scene-shell hero-shell" data-scene-height="832">
        <div class="scene hero-scene">
          <div class="slashes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="pluses" aria-hidden="true"><span>+</span><span>+</span><span>+</span></div>
          ${asset('36a9a.svg','','hero-orbit orbit-left')}
          ${asset('07c83.svg','','hero-orbit orbit-right')}
          <h1>PORTFOLIO</h1>
          <div class="hero-portrait">${asset('b19ee.png','Paul Richard Calma holding a bouquet of flowers','','fetchpriority="high"')}</div>
          <p class="hero-name">PAUL RICHARD CALMA</p>
          <p class="hero-role">ASPIRING NETWORK ADMINISTRATOR</p>
        </div>
      </div>
    </section>

    <section class="about textured section-pad" id="about" aria-labelledby="about-title">
      <div class="section-eyebrow"><span>GET TO KNOW ME</span><span>02</span></div>
      <h2 id="about-title">ABOUT ME</h2>
      <div class="about-grid">
        <div class="about-photo">
          <div class="about-decoration">${asset('3d1c6.svg')}</div>
          <div class="about-photo-crop">${asset('ee894.png','Paul in a checked shirt with flowers','', 'loading="lazy"')}</div>
        </div>
        <div class="biography">
          <h3>PAUL RICHARD CALMA</h3>
          <p class="eyebrow">IT UNDERGRADUATE / IT INFRASTRUCTURE</p>
          <p>Information Technology undergraduate specializing in IT Infrastructure, with proficient knowledge in networking and cloud technologies.</p>
          <p>Experienced in UX/UI design, front-end development, data processing, and web automation through academic projects and professional work.</p>
          <p>Interested in applying both technical and user-centered approaches to the development of reliable and practical digital solutions.</p>
        </div>
      </div>
      <div class="section-rule"></div>
    </section>

    <section class="skills textured" id="skills" aria-labelledby="skills-title">
      <div class="section-pad">
        <div class="section-eyebrow"><span>MY TECHNICAL TOOLKIT</span><span>03</span></div>
        <h2 id="skills-title">SKILLS</h2>
      </div>
      <div class="skill-groups section-pad">
        ${skillGroups.map(group => `<div class="skill-group" role="group" aria-labelledby="${group.id}-title">
          <h3 class="skill-group-title eyebrow" id="${group.id}-title">${group.title}</h3>
          <ul class="skill-grid skill-grid-${group.id}">${skillCards(group.items)}</ul>
        </div>`).join('')}
      </div>
      <div class="section-rule"></div>
    </section>

    <section class="projects textured" id="projects" aria-labelledby="projects-title">
      <div class="projects-pin">
      <div class="projects-intro">
        <h2 id="projects-title">PROJECTS</h2>
        <button class="project-enter" type="button">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></button>
      </div>
      <div class="carousel" id="project-gallery" role="region" aria-roledescription="carousel" aria-label="Selected projects" tabindex="0">
        <div class="carousel-stage">
        <div class="carousel-viewport">
          <div class="carousel-track">
            <article class="project-slide finster" role="group" aria-roledescription="slide" aria-label="1 of 3: Finster">
              <div class="scene-shell project-shell fluid-project"><div class="scene slide-scene">
                <p class="project-number eyebrow">PROJECT 01</p>
                <div class="project-copy">
                  <h3>FINSTER ${asset('b8f08.svg','','title-ornament')}</h3>
                  <p>Finster is a dating application concept designed to create a safer and more trustworthy online dating experience. The platform introduces identity verification during onboarding to help reduce catfishing and increase confidence when users interact with potential matches.</p>
                  <div class="project-links">${projectLink('Figma Link','finsterFigma')}${projectLink('Demo Video','finsterDemo')}</div>
                </div>
                ${asset('dee3e.svg','','project-dots')}
                <div class="finster-collage" aria-label="Finster app screens">
                  <div class="finster-phones">
                  ${asset('24b09.png','Finster welcome screen','phone f-one','loading="lazy"')}
                  ${asset('aee98.png','Finster matching profile','phone f-two','loading="lazy"')}
                  ${asset('8a814.png','Finster match confirmation','phone f-three','loading="lazy"')}
                  ${asset('355e1.png','Finster account preferences','phone f-four','loading="lazy"')}
                  ${asset('46867.png','Finster likes screen','phone f-five','loading="lazy"')}
                  ${asset('3b01f.png','Finster conversation screen','phone f-six','loading="lazy"')}
                  </div>
                </div>
              </div></div>
            </article>
            <article class="project-slide pickerkarma" role="group" aria-roledescription="slide" aria-label="2 of 3: PickerKarma" inert aria-hidden="true">
              <div class="scene-shell project-shell" data-scene-height="832"><div class="scene slide-scene">
                <p class="project-number eyebrow">PROJECT 02</p>
                ${asset('dee3e.svg','','project-dots')}
                <div class="project-copy">
                  <h3>${asset('4b083.svg','','title-ornament reversed')} PICKERKARMA ${asset('b8f08.svg','','title-ornament')}</h3>
                  <p>PickerKarma is a centralized barangay portal system designed to streamline resident management, service requests, community activities, and administrative reporting within a single digital platform.</p>
                  <p>The system integrates third-party services and APIs to support real-world operational workflows such as payments, real-time notifications, email delivery, and external service communication.</p>
                  <div class="project-links">${projectLink('GitHub Repository','pickerkarmaGithub')}</div>
                </div>
                <div class="picker-collage">
                  <div>${asset('0144a.png','PickerKarma incident management dashboard','','loading="lazy"')}</div>
                  <div>${asset('f3407.png','PickerKarma community portal homepage','','loading="lazy"')}</div>
                  <div>${asset('17d98.png','PickerKarma document request form','','loading="lazy"')}</div>
                </div>
              </div></div>
            </article>
            <article class="project-slide sole" role="group" aria-roledescription="slide" aria-label="3 of 3: Sole" inert aria-hidden="true">
              <div class="scene-shell project-shell fluid-project"><div class="scene slide-scene">
                <div class="sole-center">
                  <div class="project-copy">
                    <p class="eyebrow">PROJECT 03</p>
                    <h3>${asset('b9328.svg','','title-ornament reversed')} SOLE ${asset('3e04f.svg','','title-ornament')}</h3>
                    <p>SOLE is a shoe e-commerce website designed for intuitive browsing, product selection, and a smooth shopping experience. Figma variables for theme and a reusable design system keep its screens consistent, while heuristic evaluation guided clear navigation and usability.</p>
                    <div class="project-links">${projectLink('Figma Link','soleFigma')}</div>
                  </div>
                </div>
                ${asset('640dc.svg','','sole-ornament')}
                <div class="sole-collage" aria-label="Sole shopping app screens">
                  <div class="sole-phone-bank sole-phones-start">
                  ${asset('49ab3.png','Sole product details','phone s-one','loading="lazy"')}
                  ${asset('92ce7.png','Sole shopping home','phone s-two','loading="lazy"')}
                  ${asset('1a361.png','Sole product search','phone s-three','loading="lazy"')}
                  </div>
                  <div class="sole-phone-bank sole-phones-end">
                  ${asset('19d0e.png','Sole order tracking','phone s-four','loading="lazy"')}
                  ${asset('82f3b.png','Sole card payment','phone s-five','loading="lazy"')}
                  ${asset('7a169.png','Sole GCash checkout','phone s-six','loading="lazy"')}
                  </div>
                </div>
              </div></div>
            </article>
          </div>
        </div>
        <div class="carousel-arrows"><button class="arrow-button" id="previous-project" aria-label="Previous project"><span aria-hidden="true">←</span></button><button class="arrow-button" id="next-project" aria-label="Next project"><span aria-hidden="true">→</span></button></div>
        </div>
        <div class="carousel-controls">
          <p class="carousel-caption"><span id="project-index">01</span><span class="caption-rule"></span><span>03</span><span id="project-name">FINSTER</span></p>
          <div class="carousel-dots" aria-label="Choose a project"><button aria-label="Show Finster" aria-current="true" data-slide="0"></button><button aria-label="Show PickerKarma" data-slide="1"></button><button aria-label="Show Sole" data-slide="2"></button></div>
        </div>
        <p class="sr-only" id="carousel-status" aria-live="polite" aria-atomic="true">Project 1 of 3: Finster</p>
      </div>
      </div>
    </section>

    <section class="contact section-pad" id="contact" aria-labelledby="contact-title">
      <div class="contact-banner">
        <div class="banner-copy"><span class="banner-star" aria-hidden="true">✳</span><div><p>Technical thinking.<br>User-centered design.<br>Practical digital solutions.</p><span class="eyebrow">PAUL RICHARD CALMA / IT INFRASTRUCTURE</span></div></div>
        <div class="banner-photo">${asset('b19ee.png','','','loading="lazy"')}</div>
      </div>
      <div class="contact-grid">
        <h2 id="contact-title">LET’S WORK<br>TOGETHER</h2>
        <div class="contact-invitation"><p>Have a project in mind?<br>I’d love to help bring your<br class="desktop-break"> vision to life.</p><a class="connect-button" href="mailto:${contact.email}">LET’S CONNECT <span aria-hidden="true">⟶</span></a></div>
        <address class="contact-details">
          <a href="mailto:${contact.email}">${icon('email')}<span>${contact.email}</span></a>
          <span>${icon('phone')}<span>${contact.phone}</span></span>
          <span>${icon('location')}<span>${contact.location}</span></span>
          <span>${icon('globe')}<span>${contact.website}</span></span>
          ${contact.isPlaceholder ? '<small class="placeholder-note">Contact details are placeholders.</small>' : ''}
        </address>
      </div>
    </section>
  </main>
  <footer><p>© ${new Date().getFullYear()} Paul Richard Calma</p><a href="#home">Back to top <span aria-hidden="true">↑</span></a></footer>
`;

// Scale only the art-directed collages. Text sections reflow on small screens.
const sceneObserver = new ResizeObserver(entries => {
  for (const { target, contentRect } of entries) {
    const scale = Math.min(contentRect.width / 1280, contentRect.height / Number(target.dataset.sceneHeight));
    target.style.setProperty('--scene-scale', scale);
    target.style.setProperty('--scene-height', `${Number(target.dataset.sceneHeight) * scale}px`);
  }
});
document.querySelectorAll('.scene-shell[data-scene-height]').forEach(el => sceneObserver.observe(el));
initializeMotion();

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label','Open navigation');
  nav.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const wasOpen = nav.classList.contains('open'); closeMenu(); if (wasOpen) menuButton.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    nav.querySelectorAll('a').forEach(a => {
      if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
document.querySelectorAll('main > section').forEach(el => sectionObserver.observe(el));

const carousel = document.querySelector('.carousel');
const viewport = document.querySelector('.carousel-viewport');
const slides = [...document.querySelectorAll('.project-slide')];
const names = ['Finster', 'PickerKarma', 'Sole'];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let runningAnimations = [];
function showProject(next, direction = next > current ? 1 : -1) {
  next = (next + slides.length) % slides.length;
  if (next === current) return;
  runningAnimations.forEach(animation => animation.cancel());
  const oldSlide = slides[current];
  const nextSlide = slides[next];
  slides.forEach((slide, i) => {
    slide.inert = i !== next;
    slide.setAttribute('aria-hidden', String(i !== next));
    slide.style.visibility = i === next ? 'visible' : 'hidden';
    slide.style.zIndex = i === next ? '2' : '0';
  });
  current = next;
  document.querySelector('#project-index').textContent = String(next + 1).padStart(2, '0');
  document.querySelector('#project-name').textContent = names[next].toUpperCase();
  document.querySelector('#carousel-status').textContent = `Project ${next + 1} of 3: ${names[next]}`;
  document.querySelectorAll('[data-slide]').forEach((button, i) => {
    if (i === next) button.setAttribute('aria-current','true');
    else button.removeAttribute('aria-current');
  });
  if (reducedMotion.matches) return;
  oldSlide.style.visibility = 'visible';
  oldSlide.style.zIndex = '1';
  const options = { duration: 650, easing: 'cubic-bezier(.22,.68,0,1)' };
  const outgoing = oldSlide.animate([{transform: 'translateX(0)'},{transform:`translateX(${-direction * 100}%)`}], options);
  const incoming = nextSlide.animate([{transform:`translateX(${direction * 100}%)`},{transform:'translateX(0)'}], options);
  const content = nextSlide.querySelector('.project-copy');
  const reveal = content.animate([{opacity:.25,translate:`${direction * 35}px 0`},{opacity:1,translate:'0 0'}], {duration:750,easing:'cubic-bezier(.22,.68,0,1)'});
  runningAnimations = [outgoing,incoming,reveal];
  outgoing.onfinish = () => { if (slides[current] !== oldSlide) oldSlide.style.visibility = 'hidden'; };
}
document.querySelector('#previous-project').addEventListener('click', () => showProject(current - 1, -1));
document.querySelector('#next-project').addEventListener('click', () => showProject(current + 1, 1));
document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => showProject(Number(button.dataset.slide))));
carousel.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); const dir = e.key === 'ArrowLeft' ? -1 : 1; showProject(current + dir, dir); }
  if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); showProject(e.key === 'Home' ? 0 : slides.length - 1); }
});
let swipeStart = null;
viewport.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') swipeStart = {x:e.clientX,y:e.clientY}; });
viewport.addEventListener('pointerup', e => {
  if (!swipeStart) return;
  const dx = e.clientX - swipeStart.x;
  const dy = e.clientY - swipeStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showProject(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  swipeStart = null;
});
viewport.addEventListener('pointercancel', () => { swipeStart = null; });
