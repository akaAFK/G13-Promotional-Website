"""Local stand-in for the Stripe Checkout flow (demo only, no network calls).

Swap this module for stripe-python later without touching the routers.
"""

TEST_CARD = "4242424242424242"
EDITIONS = {
    "STANDARD": 1999,
    "DELUXE": 3999,
    "COLLECTOR": 9999,
}


def price_for(edition: str) -> int | None:
    return EDITIONS.get(edition.upper())


def card_is_valid(card_number: str) -> bool:
    normalized = "".join(ch for ch in card_number if ch.isdigit())
    return normalized == TEST_CARD


def checkout_url(order_id: str, edition: str, amount_cents: int) -> str:
    return (
        f"/checkout.html?order_id={order_id}"
        f"&edition={edition}&amount={amount_cents}"
    )
