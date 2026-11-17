"""Streaming lore consultant powered by OpenRouter via the official OpenAI SDK."""

import logging
from collections.abc import AsyncIterator

from ..config import settings
from .recommender import CHARACTERS

log = logging.getLogger("g13.lore")

ROSTER = "\n".join(
    f"- {c['name']}: {c['role']}. {c['style']}. {c['bio']}" for c in CHARACTERS
)
SYSTEM_PROMPT = f"""You are the lore consultant of G13, a dark-fantasy/steampunk first-person action game.
Answer in 2-4 short sentences, in the language of the user's question. Be atmospheric but factual.
Use only these canon facts:

{ROSTER}

Canon: G13 is about six unlikely allies, an underground sanctuary, and a brutal pilgrimage to the surface.
Combat: finishing moves (F key), limb mutilation, environment weapons. Mercy is a resource.
Tagline: NO SAINTS. NO MERCY. NO WAY BACK.
Never invent new characters, locations or plot facts."""


FALLBACKS: list[tuple[tuple[str, ...], str]] = [
    (("captain", "lead", "who is"), "The Captain is the player character — a violent, magnetic brawler who fights with fists, dirty tricks and whatever the room provides. Improvisation is his weapon; the rules were written for someone else."),
    (("tim", "engineer", "trap"), "Tim is the engineer and tactician. He turns scrap into shelter or a room full of fire, builds traps and carries more explosives than patience."),
    (("pistachio", "фисташк", "mage", "magic", "crystal"), "Pistachio is a fallen noble and mage. He studies ranged magic and crystal processors, dissects corpses, calibrates crystals and asks no permission."),
    (("kevin", "stealth", "assassin", "scout", "quiet"), "Kevin is the scout and assassin: quiet feet, steady hands, archery and sabotage. Problems disappear before anyone knows he was there."),
    (("pete", "pit", "heavy", "sword", "wall"), "Pete is the heavy warrior and quartermaster — a walking barricade with a giant sword, a talent for logistics and very loud opinions."),
    (("dusya", "дус", "fire", "pyro", "grandma", "баб"), "Grandma Dusya is the pyromancer. Sweet as tea until something moves; then the room is on fire and she asks who wants a biscuit."),
    (("combat", "finish", "limb", "weapon", "kill", " mercy"), "Combat in G13 rewards reading the room: finishing moves with F, targeting limbs to disable enemies, and using bottles, bricks and machinery as weapons. Mercy is a resource — spend it carefully."),
    (("squad", "crew", "six", "pilgrim", "surface", "world", "lore", "story"), "Six unlikely allies leave an underground sanctuary for a brutal pilgrimage across the surface. No moral lectures or heroic illusions — just blood, self-made justice and survival. NO SAINTS. NO MERCY. NO WAY BACK."),
]


def fallback_answer(question: str) -> str:
    text = question.lower()
    for keywords, answer in FALLBACKS:
        if any(word in text for word in keywords):
            return answer
    return (
        "Below the surface there are no clean fights. G13 follows six unlikely allies on a brutal "
        "pilgrimage, where every room is a weapon and every choice leaves a mark. Ask me about a "
        "character, the combat mechanics or the world."
    )


async def stream_answer(
    messages: list[dict[str, str]], question: str
) -> AsyncIterator[str]:
    if not settings.OPENROUTER_API_KEY:
        yield "[OFFLINE LORE] " + fallback_answer(question)
        return

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
            default_headers={
                "HTTP-Referer": "http://localhost:8080",
                "X-Title": "G13 Promotional Website",
            },
            timeout=20.0,
            max_retries=0,
        )
        conversation = [{"role": "system", "content": SYSTEM_PROMPT}]
        conversation.extend(
            {"role": m["role"], "content": m["content"]}
            for m in messages[-6:]
            if m.get("role") in ("user", "assistant") and m.get("content")
        )
        conversation.append({"role": "user", "content": question})

        stream = await client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=conversation,
            stream=True,
            max_tokens=300,
        )
        produced = False
        async for chunk in stream:
            delta = chunk.choices[0].delta.content if chunk.choices else None
            if delta:
                produced = True
                yield delta
        if not produced:
            yield fallback_answer(question)
    except Exception as exc:  # noqa: BLE001 - demo must survive 429/5xx from a free model
        log.warning("OpenRouter unavailable (%s); using offline lore", exc)
        yield " [OFFLINE LORE] " + fallback_answer(question)
