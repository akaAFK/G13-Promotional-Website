from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models
from ..db import get_db
from ..schemas import SubscribeIn, SubscribeOut
from ..services.mailer import send_welcome

router = APIRouter(prefix="/api", tags=["signup"])


@router.post("/subscribe", response_model=SubscribeOut)
async def subscribe(payload: SubscribeIn, db: Session = Depends(get_db)) -> SubscribeOut:
    email = str(payload.email).strip().lower()
    existing = db.query(models.Subscriber).filter(models.Subscriber.email == email).first()
    if existing is None:
        db.add(models.Subscriber(email=email, source=payload.source))
        db.commit()

    delivery = await send_welcome(email)
    return SubscribeOut(
        ok=True,
        already_subscribed=existing is not None,
        delivery=delivery,
    )
