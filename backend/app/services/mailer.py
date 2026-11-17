"""Email delivery through the ready-made fastapi-mail package.

In DEV_MODE (default for the university MVP) no SMTP connection is opened:
messages are logged so the whole flow works without Gmail credentials.
"""

import logging
from pathlib import Path

from ..config import settings

log = logging.getLogger("g13.mail")
TEMPLATES = Path(__file__).resolve().parents[2] / "templates"


async def _deliver(subject: str, email: str, template_name: str, body: dict) -> str:
    if settings.MAIL_DEV_MODE or not (settings.GMAIL_USER and settings.GMAIL_APP_PASSWORD):
        log.info("[DEV MAIL] to=%s | subject=%s | body=%s", email, subject, body)
        return "dev-log"

    # Imported lazily so dev mode never depends on the SMTP stack at import time.
    from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

    conf = ConnectionConfig(
        MAIL_USERNAME=settings.GMAIL_USER,
        MAIL_PASSWORD=settings.GMAIL_APP_PASSWORD,
        MAIL_FROM=settings.GMAIL_USER,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
        TEMPLATE_FOLDER=TEMPLATES,
    )
    message = MessageSchema(
        subject=subject,
        recipients=[email],
        template_body=body,
        subtype=MessageType.html,
    )
    await FastMail(conf).send_message(message, template_name=template_name)
    return "sent"


async def send_welcome(email: str) -> str:
    return await _deliver(
        "G13 — YOU ARE ON THE LIST",
        email,
        "welcome.html",
        {"email": email},
    )


async def send_receipt(email: str, order: dict) -> str:
    return await _deliver(
        f"G13 — PRE-ORDER CONFIRMED ({order['id'][:8].upper()})",
        email,
        "receipt.html",
        order,
    )
