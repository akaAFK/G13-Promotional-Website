/* G13 MVP wiring: signup, demo pre-order, ML squad recommender, streaming lore chat. */
(() => {
  const api = window.G13Api;
  if (!api) return;

  const setMessage = (el, text, state) => {
    el.textContent = text;
    el.className = `form-message${state ? ` ${state}` : ''}`;
  };

  // --- Playtest signup -> PostgreSQL + welcome email (dev-log mode) ---
  const signupForm = document.getElementById('signupForm');
  const emailInput = document.getElementById('emailInput');
  const formMessage = document.getElementById('formMessage');

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!emailInput.checkValidity()) {
      setMessage(formMessage, 'ENTER A VALID EMAIL ADDRESS TO JOIN THE LIST.', 'error');
      emailInput.focus();
      return;
    }
    setMessage(formMessage, 'SENDING SIGNAL...');
    try {
      await api.subscribe(emailInput.value.trim());
      setMessage(formMessage, 'YOU ARE ON THE LIST. WATCH THE DARK FOR A SIGNAL.', 'success');
      signupForm.reset();
    } catch (error) {
      setMessage(formMessage, `SIGNAL FAILED: ${error.message}`, 'error');
    }
  });

  // --- Demo pre-order -> order in PostgreSQL -> local Stripe-style checkout ---
  const preorderForm = document.getElementById('preorderForm');
  const preorderEmail = document.getElementById('preorderEmail');
  const preorderEdition = document.getElementById('preorderEdition');
  const preorderMessage = document.getElementById('preorderMessage');

  preorderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!preorderEmail.checkValidity()) {
      setMessage(preorderMessage, 'ENTER A VALID EMAIL ADDRESS.', 'error');
      preorderEmail.focus();
      return;
    }
    setMessage(preorderMessage, 'CREATING ORDER...');
    try {
      const order = await api.checkout(preorderEmail.value.trim(), preorderEdition.value);
      window.location.href = order.checkout_url;
    } catch (error) {
      setMessage(preorderMessage, `CHECKOUT FAILED: ${error.message}`, 'error');
    }
  });

  // --- ML recommender quiz ---
  const quiz = document.getElementById('recoQuiz');
  const results = document.getElementById('recoResults');
  const choices = new Map();

  quiz.querySelectorAll('.reco-question').forEach((question) => {
    question.querySelectorAll('.reco-options button').forEach((button) => {
      button.addEventListener('click', () => {
        question.querySelectorAll('button').forEach((item) => item.classList.remove('selected'));
        button.classList.add('selected');
        choices.set(question.dataset.question, button.dataset.keywords);
      });
    });
  });

  document.getElementById('recoSubmit').addEventListener('click', async () => {
    if (choices.size < 2) {
      results.innerHTML = '<p class="reco-hint">PICK AT LEAST TWO ANSWERS TO RUN THE ANALYSIS.</p>';
      return;
    }
    results.innerHTML = '<p class="reco-hint">READING THE CREW...</p>';
    try {
      const data = await api.recommend([...choices.values()].join(' '), 2);
      results.innerHTML = '';
      data.results.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'reco-card';
        const label = document.createElement('span');
        label.textContent = `MATCH 0${index + 1} · ${Math.round(item.match * 100)}%`;
        const name = document.createElement('strong');
        name.textContent = item.character.name;
        const role = document.createElement('small');
        role.textContent = item.character.role;
        const bio = document.createElement('p');
        bio.textContent = item.character.bio;
        card.append(label, name, role, bio);
        results.appendChild(card);
      });
    } catch (error) {
      results.innerHTML = `<p class="reco-hint reco-error">ANALYSIS FAILED: ${error.message}</p>`;
    }
  });

  // --- Streaming AI lore consultant (OpenRouter) ---
  const widget = document.getElementById('loreWidget');
  const panel = document.getElementById('lorePanel');
  const toggle = document.getElementById('loreToggle');
  const close = document.getElementById('loreClose');
  const messages = document.getElementById('loreMessages');
  const chatForm = document.getElementById('loreForm');
  const chatInput = document.getElementById('loreInput');
  const history = [];
  const sessionId = sessionStorage.getItem('g13-lore-session') || Math.random().toString(36).slice(2);
  sessionStorage.setItem('g13-lore-session', sessionId);

  function setPanel(open) {
    panel.setAttribute('aria-hidden', String(!open));
    widget.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) chatInput.focus();
  }

  toggle.addEventListener('click', () => setPanel(!widget.classList.contains('open')));
  close.addEventListener('click', () => setPanel(false));

  function addBubble(text, role) {
    const bubble = document.createElement('div');
    bubble.className = `lore-bubble ${role}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    addBubble(text, 'user');
    const answer = addBubble('...', 'bot');
    const recent = history.slice(-6);
    history.push({ role: 'user', content: text });

    try {
      const full = await api.chat(text, recent, sessionId, (_chunk, accumulated) => {
        answer.textContent = accumulated;
        messages.scrollTop = messages.scrollHeight;
      });
      answer.textContent = full || 'NO ANSWER FROM BELOW.';
      history.push({ role: 'assistant', content: answer.textContent });
    } catch (error) {
      answer.textContent = `SIGNAL LOST: ${error.message}`;
    }
  });
})();
