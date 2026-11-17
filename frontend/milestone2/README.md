# G13 — Milestone 2 (T-1, T-2, T-3)

This is a separate React implementation. The existing promotional website files in `frontend/` and the repository root are intentionally unchanged.

## Requirements
- Node.js 18+ and npm
- Internet connection for Google Fonts

## Run locally
```bash
cd frontend/milestone2
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Completed tasks
- **T-1:** React hero section, navigation, world/features sections, responsive mobile-first layout.
- **T-2:** Six-character slider with arrows, pagination dots, Framer Motion transitions, and drag/swipe gestures.
- **T-3:** Combat mechanic tabs and interactive configurator (loadout + intensity). It sends a JSON event to `POST /events`; if the backend is not running, the demo safely stores the event in localStorage.

## Backend note
The `/events` endpoint is not implemented in this milestone. The frontend falls back to local demo storage and clearly reports this state.
