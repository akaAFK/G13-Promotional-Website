(() => {
  const viewport = document.getElementById('sliderViewport');
  const track = document.getElementById('sliderTrack');
  const cards = Array.from(track.querySelectorAll('.character-card'));
  const dotsWrap = document.getElementById('sliderDots');
  const prev = document.getElementById('prevSlide');
  const next = document.getElementById('nextSlide');
  const current = document.getElementById('slideCurrent');
  let page = 0;
  let pages = 1;
  let visible = 3;
  let cardStep = 0;
  let pointerStart = null;

  function getVisibleCount() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 760) return 2;
    if (window.innerWidth <= 1050) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Go to character group ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function measure() {
    visible = getVisibleCount();
    pages = Math.ceil(cards.length / visible);
    cardStep = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
    page = Math.min(page, pages - 1);
    buildDots();
    update();
  }

  function update() {
    track.style.transform = `translate3d(${-page * visible * cardStep}px, 0, 0)`;
    [...dotsWrap.children].forEach((dot, index) => {
      dot.classList.toggle('active', index === page);
      dot.setAttribute('aria-current', index === page ? 'true' : 'false');
    });
    prev.disabled = page === 0;
    next.disabled = page === pages - 1;
    current.textContent = String(Math.min(page * visible + 1, cards.length)).padStart(2, '0');
  }

  function goTo(nextPage) {
    page = Math.max(0, Math.min(pages - 1, nextPage));
    update();
  }

  prev.addEventListener('click', () => goTo(page - 1));
  next.addEventListener('click', () => goTo(page + 1));

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStart = event.clientX;
  });
  viewport.addEventListener('pointermove', (event) => {
    if (pointerStart === null) return;
    if (Math.abs(event.clientX - pointerStart) > 8) {
      viewport.classList.add('is-dragging');
    }
  });
  function finishSwipe(event) {
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    if (Math.abs(delta) > 42) goTo(page + (delta < 0 ? 1 : -1));
    pointerStart = null;
    viewport.classList.remove('is-dragging');
  }
  viewport.addEventListener('pointerup', finishSwipe);
  viewport.addEventListener('pointercancel', finishSwipe);
  viewport.addEventListener('pointerleave', (event) => {
    if (pointerStart !== null && event.pointerType === 'mouse') finishSwipe(event);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measure, 100);
  });
  measure();

  // Combat mechanic tabs
  const tabs = Array.from(document.querySelectorAll('.mechanic-tab'));
  const panels = Array.from(document.querySelectorAll('.mechanic-panel'));
  function activateTab(name) {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.id === `panel-${name}`;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex].dataset.tab);
    });
  });

  // Mobile navigation
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    mainNav.classList.toggle('open', open);
  });
  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
  }));

  // Trailer modal (placeholder until production footage is supplied)
  const modal = document.getElementById('trailerModal');
  const trailerButton = document.getElementById('trailerButton');
  const closeModal = document.getElementById('closeModal');
  let previousFocus = null;
  function openModal() {
    previousFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeModal.focus();
  }
  function hideModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (previousFocus) previousFocus.focus();
  }
  trailerButton.addEventListener('click', openModal);
  closeModal.addEventListener('click', hideModal);
  modal.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', hideModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) hideModal();
  });
  document.getElementById('modalSignup').addEventListener('click', hideModal);

  // --- G13 atmospheric embers: lightweight Canvas 2D (no WebGL / dependencies) ---
  const particleCanvas = document.getElementById('g13Particles');
  const heroSection = document.querySelector('.hero-section');
  const heroArtFrame = document.querySelector('.hero-art-frame');

  if (particleCanvas && heroSection) {
    const ctx = particleCanvas.getContext('2d', { alpha: true });
    if (ctx) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const particles = [];
      const pointer = { x: 0.5, y: 0.45, targetX: 0.5, targetY: 0.45 };
      let width = 0;
      let height = 0;
      let dpr = 1;
      let frameId = 0;
      let lastFrame = 0;
      let inView = true;
      const mobile = window.matchMedia('(max-width: 760px)').matches;
      const particleCount = reducedMotion ? 22 : (mobile ? 34 : 76);
      const rand = (min, max) => min + Math.random() * (max - min);

      function createParticle(initial = false) {
        return {
          x: rand(0, width || window.innerWidth),
          y: initial ? rand(0, height || window.innerHeight) : (height || window.innerHeight) + rand(4, 60),
          radius: rand(0.55, 1.8),
          speed: rand(0.12, 0.48),
          drift: rand(-0.22, 0.22),
          phase: rand(0, Math.PI * 2),
          alpha: rand(0.25, 0.82),
          gold: Math.random() > 0.68,
          spark: Math.random() > 0.86
        };
      }

      function resizeCanvas() {
        const rect = heroSection.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        particleCanvas.width = Math.round(width * dpr);
        particleCanvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!particles.length) {
          for (let i = 0; i < particleCount; i += 1) particles.push(createParticle(true));
        }
        drawFrame(0, true);
      }

      function drawFrame(time, staticFrame = false) {
        ctx.clearRect(0, 0, width, height);
        const parallaxX = (pointer.x - 0.5) * 8;
        const parallaxY = (pointer.y - 0.5) * 6;

        for (const p of particles) {
          if (!staticFrame && !reducedMotion) {
            p.y -= p.speed;
            p.x += p.drift + Math.sin(time * 0.0007 + p.phase) * 0.12;
            if (p.y < -8 || p.x < -12 || p.x > width + 12) Object.assign(p, createParticle());
          }
          const twinkle = reducedMotion ? 1 : (0.72 + Math.sin(time * 0.002 + p.phase) * 0.22);
          const alpha = p.alpha * twinkle;
          const color = p.gold ? '212,175,55' : '235,91,43';
          ctx.beginPath();
          ctx.fillStyle = `rgba(${color},${alpha})`;
          ctx.shadowBlur = p.spark ? 13 : 7;
          ctx.shadowColor = p.gold ? 'rgba(212,175,55,.5)' : 'rgba(220,55,25,.55)';
          ctx.arc(p.x + parallaxX * 0.12, p.y + parallaxY * 0.12, p.radius, 0, Math.PI * 2);
          ctx.fill();

          if (p.spark && !reducedMotion) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(235,115,48,${alpha * 0.48})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.drift * 7, p.y + 5 + p.speed * 8);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
      }

      function animate(time) {
        if (!inView || document.hidden) {
          frameId = 0;
          return;
        }
        if (time - lastFrame >= 1000 / 60) {
          lastFrame = time;
          pointer.x += (pointer.targetX - pointer.x) * 0.055;
          pointer.y += (pointer.targetY - pointer.y) * 0.055;
          drawFrame(time);
          if (heroArtFrame && !reducedMotion && !mobile) {
            heroArtFrame.style.setProperty('--hero-shift-x', `${(pointer.x - 0.5) * 10}px`);
            heroArtFrame.style.setProperty('--hero-shift-y', `${(pointer.y - 0.5) * 7}px`);
          }
        }
        frameId = window.requestAnimationFrame(animate);
      }

      function startAnimation() {
        if (!reducedMotion && inView && !document.hidden && !frameId) {
          frameId = window.requestAnimationFrame(animate);
        }
      }
      function stopAnimation() {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
      }

      heroSection.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const rect = heroSection.getBoundingClientRect();
        pointer.targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        pointer.targetY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      }, { passive: true });
      heroSection.addEventListener('pointerleave', () => {
        pointer.targetX = 0.5;
        pointer.targetY = 0.45;
      }, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAnimation();
        else startAnimation();
      });
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          if (inView) startAnimation();
          else stopAnimation();
        }, { threshold: 0.01 });
        observer.observe(heroSection);
      }
      window.addEventListener('resize', resizeCanvas, { passive: true });
      resizeCanvas();
      if (reducedMotion) drawFrame(0, true);
      else startAnimation();
    }
  }

})();
