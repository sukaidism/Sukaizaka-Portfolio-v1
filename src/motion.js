export function initializeMotion() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');
  const splash = document.querySelector('.hero-splash');
  const projects = document.querySelector('.projects');
  const projectPin = document.querySelector('.projects-pin');
  const projectIntro = document.querySelector('.projects-intro');
  const projectGallery = document.querySelector('.carousel');
  const smooth = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  let focusGallery = false;
  let introAnimations = [];

  const revealTargets = document.querySelectorAll([
    '.section-eyebrow', '#about-title', '.about-photo', '.biography',
    '#skills-title', '.skill-group',
    '.contact-banner', '.contact-grid', 'footer',
  ].join(','));
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -40px 0px', threshold: .06 });
  revealTargets.forEach(element => {
    element.classList.add('reveal');
    if (reducedMotion.matches) element.classList.add('is-visible');
    else revealObserver.observe(element);
  });

  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    header.classList.toggle('is-scrolled', scrollY > 24);
    const scale = hero.clientWidth / 1280;
    const drift = reducedMotion.matches ? 0 : Math.min(scrollY, hero.offsetHeight) * .055 / scale;
    hero.style.setProperty('--hero-parallax', `${drift}px`);
    // The title and gallery occupy the same pinned screen. Native scrolling
    // scrubs this sequence in either direction without wheel interception.
    const travel = projects.offsetHeight - projectPin.offsetHeight;
    const headerHeight = header.offsetHeight;
    const progress = reducedMotion.matches ? 1 : Math.max(0, Math.min(1,
      (headerHeight - projects.getBoundingClientRect().top) / Math.max(1, travel)));
    const titleProgress = smooth(progress / .65);
    const galleryProgress = smooth((progress - .38) / .4);
    projects.style.setProperty('--title-scale', 1 - titleProgress * .65);
    projects.style.setProperty('--title-opacity', 1 - smooth((progress - .3) / .25));
    projects.style.setProperty('--gallery-opacity', galleryProgress);
    projects.style.setProperty('--gallery-scale', .93 + galleryProgress * .07);
    projects.style.setProperty('--gallery-offset', `${(1 - galleryProgress) * 45}px`);
    projects.dataset.progress = progress.toFixed(3);
    projectIntro.inert = !reducedMotion.matches && progress > .55;
    projectGallery.inert = galleryProgress < .98;
    if (focusGallery && !projectGallery.inert) {
      projectGallery.focus({ preventScroll: true });
      focusGallery = false;
    }
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  new ResizeObserver(scheduleScroll).observe(projects);
  document.querySelector('.project-enter').addEventListener('click', () => {
    focusGallery = true;
    window.scrollTo({
      top: scrollY + projects.getBoundingClientRect().top - header.offsetHeight + (projects.offsetHeight - projectPin.offsetHeight) * .85,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
    scheduleScroll();
  });
  updateScroll();

  function finishIntro() {
    splash?.remove();
    hero.dataset.intro = 'complete';
  }
  async function startIntro() {
    // Wait for the actual portrait and display font, with a bounded fallback.
    const portrait = hero.querySelector('.hero-portrait img');
    await Promise.race([
      Promise.allSettled([portrait.decode(), document.fonts.load('32px Nowduke')]),
      new Promise(resolve => setTimeout(resolve, 1500)),
    ]);
    if (reducedMotion.matches || scrollY > hero.offsetHeight || !splash.isConnected) {
      finishIntro();
      return;
    }
    hero.dataset.intro = 'playing';
    const timing = { duration: 1100, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' };
    introAnimations = [
      splash.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { ...timing, duration: 850, delay: 400, fill: 'forwards' }),
      splash.querySelector('i').animate([{ scale: '0 1' }, { scale: '1 1' }], { duration: 550, fill: 'backwards' }),
      hero.querySelector('h1').animate([{ opacity: 0, translate: '0 85px' }, { opacity: 1, translate: '0 0' }], { ...timing, delay: 500 }),
      hero.querySelector('.hero-portrait').animate([{ opacity: 0, translate: '0 90px' }, { opacity: 1, translate: '0 0' }], { ...timing, delay: 650 }),
      ...[...hero.querySelectorAll('.hero-orbit, .pluses, .slashes, .hero-name, .hero-role')].map((element, index) => element.animate([{ opacity: 0 }, { opacity: 1 }], { ...timing, delay: 750 + index * 60 })),
    ];
    introAnimations[0].finished.then(() => splash.remove()).catch(() => {});
    await Promise.allSettled(introAnimations.map(animation => animation.finished));
    finishIntro();
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      introAnimations.forEach(animation => animation.cancel());
      finishIntro();
      revealTargets.forEach(element => element.classList.add('is-visible'));
      revealObserver.disconnect();
    }
    updateScroll();
  });
  if (reducedMotion.matches) finishIntro();
  else startIntro();
}
