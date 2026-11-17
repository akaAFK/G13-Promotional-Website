/* G13 MVP API client — talks to the FastAPI backend through the nginx /api proxy. */
(() => {
  const BASE = '/api';

  async function request(path, options = {}) {
    const response = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || `Request failed (${response.status})`);
    }
    return data;
  }

  const api = {
    subscribe: (email) => request('/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source: 'landing' }),
    }),

    checkout: (email, edition) => request('/checkout', {
      method: 'POST',
      body: JSON.stringify({ email, edition }),
    }),

    confirmPayment: (orderId, cardNumber) => request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, card_number: cardNumber }),
    }),

    getOrder: (orderId) => request(`/orders/${encodeURIComponent(orderId)}`),

    recommend: (interests, topK = 2) => request('/recommend', {
      method: 'POST',
      body: JSON.stringify({ interests, top_k: topK }),
    }),

    async chat(message, history, sessionId, onChunk) {
      const response = await fetch(`${BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, session_id: sessionId }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || `Chat failed (${response.status})`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        onChunk(chunk, full);
      }
      return full;
    },
  };

  window.G13Api = api;
})();
