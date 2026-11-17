# G13 Events API

Minimal FastAPI endpoint used by the T-3 combat configurator.

## Run
```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- Health check: http://127.0.0.1:8000/health
- Event endpoint: POST http://127.0.0.1:8000/events

Events are validated and logged to the terminal. This milestone does not persist them to a database.
