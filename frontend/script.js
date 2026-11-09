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

  // Front-end demo form: validates input and confirms locally; connect to a backend/CRM for real signups.
  const form = document.getElementById('signupForm');
  const emailInput = document.getElementById('emailInput');
  const message = document.getElementById('formMessage');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!emailInput.checkValidity()) {
      message.textContent = 'ENTER A VALID EMAIL ADDRESS TO JOIN THE LIST.';
      message.className = 'form-message error';
      emailInput.focus();
      return;
    }
    message.textContent = 'YOU ARE ON THE LIST. WATCH THE DARK FOR A SIGNAL.';
    message.className = 'form-message success';
    form.reset();
  });
})();
