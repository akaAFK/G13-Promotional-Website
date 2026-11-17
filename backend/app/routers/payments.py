from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models
from ..db import get_db
from ..schemas import CheckoutIn, CheckoutOut, ConfirmIn, OrderOut
from ..services import mock_stripe
from ..services.mailer import send_receipt

router = APIRouter(prefix="/api", tags=["payments"])


def _to_out(order: models.Order) -> OrderOut:
    return OrderOut(
        id=order.id,
        email=order.email,
        edition=order.edition,
        amount_cents=order.amount_cents,
        status=order.status,
        paid_at=order.paid_at.isoformat() if order.paid_at else None,
    )


def _settle(db: Session, order_id: str, card_number: str) -> dict:
    order = db.get(models.Order, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="ORDER_NOT_FOUND")
    if order.status != "paid":
        if not mock_stripe.card_is_valid(card_number):
            raise HTTPException(
                status_code=402,
                detail="CARD_DECLINED — USE TEST CARD 4242 4242 4242 4242",
            )
        order.status = "paid"
        order.paid_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(order)
    return {
        **_to_out(order).model_dump(),
        "delivery": None,
    }


@router.post("/checkout", response_model=CheckoutOut)
def checkout(payload: CheckoutIn, db: Session = Depends(get_db)) -> CheckoutOut:
    edition = payload.edition.upper()
    amount = mock_stripe.price_for(edition)
    if amount is None:
        raise HTTPException(status_code=400, detail="UNKNOWN_EDITION")

    order = models.Order(
        email=str(payload.email).strip().lower(),
        edition=edition,
        amount_cents=amount,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return CheckoutOut(
        order_id=order.id,
        status=order.status,
        amount_cents=order.amount_cents,
        checkout_url=mock_stripe.checkout_url(order.id, edition, amount),
    )


@router.post("/payments/confirm")
async def confirm(payload: ConfirmIn, db: Session = Depends(get_db)) -> dict:
    result = _settle(db, payload.order_id, payload.card_number)
    if result["status"] == "paid":
        result["delivery"] = await send_receipt(result["email"], result)
    return result


@router.post("/payments/webhook/mock")
async def mock_webhook(payload: ConfirmIn, db: Session = Depends(get_db)) -> dict:
    """Same settlement logic, exposed with a webhook-shaped path for the demo diagram."""
    return await confirm(payload, db)


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: str, db: Session = Depends(get_db)) -> OrderOut:
    order = db.get(models.Order, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="ORDER_NOT_FOUND")
    return _to_out(order)
