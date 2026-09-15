/* Motion owns transforms only after GSAP is available; content remains usable without it. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');
  const loader = document.querySelector('.preloader');
  const transition = document.querySelector('.page-transition');
  const media = gsap.matchMedia();
  let introPlayed = false;
  let heroReady = false;
  // Keep each word's natural kerning/width stable while animating individual glyphs.
  document.querySelectorAll('.word-create, .word-design').forEach(word => {
    const characters = [...word.textContent].map(letter => {
      const glyph = document.createElement('i');
      glyph.className = 'roll-letter';
      glyph.textContent = letter;
      return glyph;
    });
    word.replaceChildren(...characters);
  });

  media.add('(prefers-reduced-motion: no-preference)', () => {
    heroReady = false;
    const intro = gsap.timeline({ defaults: { duration: .8, ease: 'power3.out' }, onComplete: () => { heroReady = true; } });
    if (!introPlayed) {
      introPlayed = true;
      loader.style.display = 'flex';
      gsap.set(transition, { display: 'flex' });
      // Explicitly reset pixel translation so it cannot add to percentage travel.
      gsap.set('.page-transition > div', { y: 0, yPercent: 100 });
      // A short brand introduction, not a simulated download percentage.
      intro.from('.preloader-brand', { y: 25, autoAlpha: 0, duration: .5 })
        .from('.preloader-line', { scaleX: 0, transformOrigin: 'left', duration: .65 }, .15)
        .addLabel('cover', .55)
        .to('.page-transition > div', { y: 0, yPercent: 0, duration: .85, stagger: .12, ease: 'power2.inOut' }, 'cover')
        .addLabel('covered')
        .set(loader, { display: 'none' }, 'covered')
        .addLabel('uncover', 'covered+=.05')
        .to('.page-transition > div', { y: 0, yPercent: -101, duration: 1, stagger: .12, ease: 'power2.inOut' }, 'uncover');
      // Keep the wrapper mounted; the panels leave by travelling beyond the viewport.
    }
    intro.addLabel('reveal', intro.labels.uncover !== undefined ? intro.labels.uncover + .25 : 0)
      .from('.header .brand, .header nav a, .project-link, .menu-toggle', { y: -14, autoAlpha: 0, stagger: .065, clearProps: 'all' }, 'reveal')
      .from('#hero-title > span', { y: 55, autoAlpha: 0, stagger: .14, duration: 1, clearProps: 'all' }, 'reveal+=.1')
      .from('.hero-art', { y: 35, scale: .97, autoAlpha: 0, duration: 1.2, clearProps: 'all' }, 'reveal+=.28')
      .from('.hero-description, .hero-actions, .hero-meta', { y: 20, autoAlpha: 0, stagger: .13, clearProps: 'all' }, 'reveal+=.5')
      .from('.circle-badge, .hero-side', { autoAlpha: 0, duration: .7, clearProps: 'opacity,visibility' }, 'reveal+=.7')
      .from('.orange-marks i', { scale: 0, autoAlpha: 0, stagger: .09, clearProps: 'all' }, 'reveal+=.8');

    gsap.to('.circle-badge svg', { rotation: 360, transformOrigin: '50% 50%', duration: 20, repeat: -1, ease: 'none' });
    gsap.to('.client-track', { xPercent: -50, duration: 25, repeat: -1, ease: 'none' });

    document.querySelectorAll('.panel, .journal, footer').forEach(section => {
      const elements = [...section.children].filter(el => !el.matches('.geometry'));
      gsap.from(elements, {
        y: 34, autoAlpha: 0, duration: .95, stagger: .13, ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: section, start: 'top 88%', once: true }
      });
    });
    gsap.fromTo('.geometry', { y: 28, rotation: -5 }, {
      y: -12, rotation: 4, ease: 'none',
      scrollTrigger: { trigger: '.services', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });

    const word = document.querySelector('.headline-accent');
    gsap.set('.word-design', { visibility: 'visible' });
    const swap = gsap.timeline({ paused: true, defaults: { duration: .52, ease: 'power3.inOut', stagger: .065 } })
      .to('.word-create .roll-letter', { yPercent: -115 }, 0)
      .fromTo('.word-design .roll-letter', { yPercent: 115 }, { yPercent: 0 }, 0);
    const enter = () => swap.play();
    const leave = () => { if (!word.matches(':focus')) swap.reverse(); };
    const blur = () => { if (!word.matches(':hover')) swap.reverse(); };
    word.addEventListener('pointerenter', enter);
    word.addEventListener('pointerleave', leave);
    word.addEventListener('focus', enter);
    word.addEventListener('blur', blur);
    // Dynamic callbacks control existing timelines rather than creating untracked tweens.
    const finish = () => { intro.progress(1); loader.style.display = 'none'; transition.style.display = 'none'; };
    const escape = event => { if (event.key === 'Escape') finish(); };
    document.addEventListener('keydown', escape);
    return () => {
      loader.style.display = 'none';
      transition.style.display = 'none';
      document.removeEventListener('keydown', escape);
      word.removeEventListener('pointerenter', enter);
      word.removeEventListener('pointerleave', leave);
      word.removeEventListener('focus', enter);
      word.removeEventListener('blur', blur);
    };
  });
  const refresh = () => ScrollTrigger.refresh();
  media.add('(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const hero = document.querySelector('.hero');
    const art = hero.querySelector('.hero-art');
    // Reusable tweens keep pointer updates light. Start only after the entrance finishes.
    const tiltX = gsap.quickTo(art, 'rotationX', { duration: .8, ease: 'power3.out' });
    const tiltY = gsap.quickTo(art, 'rotationY', { duration: .8, ease: 'power3.out' });
    const shiftX = gsap.quickTo(art, 'x', { duration: .8, ease: 'power3.out' });
    const move = event => {
      if (!heroReady || event.pointerType !== 'mouse') return;
      const rect = hero.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      tiltX(-y * 2.5);
      tiltY(x * 3.5);
      shiftX(x * 5);
    };
    const reset = () => { if (heroReady) { tiltX(0); tiltY(0); shiftX(0); } };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
    };
  });
  // One persistent companion follows the pointer and banks toward its travel direction.
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const trail = document.createElement('div');
    trail.className = 'cat-trail';
    trail.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.src = 'public/images/cats/superhero-cat.png';
    img.alt = '';
    img.draggable = false;
    img.style.width = '48px';
    trail.append(img);
    document.body.append(trail);
    gsap.set(img, { xPercent: -50, yPercent: -50 });
    const setX = gsap.quickSetter(img, 'x', 'px');
    const setY = gsap.quickSetter(img, 'y', 'px');
    const setRotation = gsap.quickSetter(img, 'rotation', 'deg');
    let x = 0, y = 0, targetX = 0, targetY = 0;
    let angle = 0, targetAngle = 0, active = false, initialized = false;
    const stop = () => { active = false; gsap.ticker.remove(tick); };
    const tick = (_time, delta) => {
      const follow = 1 - Math.exp(-Math.min(delta, 64) / 95);
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      const turn = ((targetAngle - angle + 540) % 360) - 180;
      angle += turn * follow;
      setX(x); setY(y); setRotation(angle);
      if (Math.hypot(targetX - x, targetY - y) < .1 && Math.abs(turn) < .1) stop();
    };
    const move = event => {
      if (event.pointerType !== 'mouse') return;
      const nextX = event.clientX + 24, nextY = event.clientY + 25;
      if (!initialized) {
        x = nextX; y = nextY;
        setX(x); setY(y);
        initialized = true;
        gsap.set(trail, { opacity: 1 });
      } else {
        const dx = nextX - targetX, dy = nextY - targetY;
        if (Math.hypot(dx, dy) > 2) {
          // The artwork faces diagonally upward-right; offset its native heading.
          targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 35;
        }
      }
      targetX = nextX; targetY = nextY;
      if (!active) { active = true; gsap.ticker.add(tick); }
    };
    const visibility = () => { if (document.hidden) stop(); };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    return () => {
      stop();
      window.removeEventListener('pointermove', move);
      document.removeEventListener('visibilitychange', visibility);
      trail.remove();
    };
  });
  // The duplicate is visual only; the original heading remains the accessible text.
  const spotlights = document.querySelectorAll('.featured h2, .services h2, .studio h2, .journal h2, footer h2');
  spotlights.forEach(heading => {
    const light = document.createElement('span');
    light.className = 'heading-light';
    light.setAttribute('aria-hidden', 'true');
    light.innerHTML = heading.innerHTML;
    heading.classList.add('spotlight-heading');
    heading.append(light);
  });
  media.add('(hover: hover) and (pointer: fine)', () => {
    const cleanups = [];
    spotlights.forEach(heading => {
      const light = heading.querySelector('.heading-light');
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fade = gsap.to(light, { opacity: 1, duration: reduced ? 0 : .25, paused: true });
      const move = event => {
        const bounds = heading.getBoundingClientRect();
        // Only paint the masked text; no layout or transform changes on pointer movement.
        light.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
        light.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
      };
      const enter = event => { move(event); fade.play(); };
      const leave = () => fade.reverse();
      heading.addEventListener('pointerenter', enter);
      heading.addEventListener('pointermove', move);
      heading.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        heading.removeEventListener('pointerenter', enter);
        heading.removeEventListener('pointermove', move);
        heading.removeEventListener('pointerleave', leave);
      });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  });
  document.fonts.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', refresh, { once: true });
  });
})();
