# G13 — Promotional Website & Interactive AI Platform

> **G13** — 3D экшен от первого лица в жанре тёмного фэнтези и стимпанка (*No Saints. No Mercy. No Way Back.*).  
> Данный репозиторий представляет собой высоконагруженный промо-сайт с интерактивными элементами (3D/слайдеры), встроенным **AI-консультантом** по лору игры и **ML-системой персональных рекомендаций**.

---

## 📋 Оглавление
1. [Команда и роли](#-команда-и-роли)
2. [Идея и концепция](#-идея-и-концепция)
3. [Ключевой стек технологий](#-ключевой-стек-технологий)

---

## 👥 Команда и роли

| Участник | Роль | Зона ответственности | Контакты |
| :--- | :--- | :--- | :--- |
| **Serikbaev Rakhat** | **Team Lead / Frontend Developer** | Планирование и координация, UI/UX дизайн-система, React-клиент, интерактивные блоки (слайдеры, табы механик, галерея), интеграция с API. | [Telegram: @akaAFK](https://t.me/akaAFK) |
| **Shilleref Ilya** | **Backend Developer** | REST API (FastAPI), проектирование и миграции PostgreSQL, Redis-кэширование, интеграция Stripe/Kaspi Pay, LLM AI-консультант (LangChain), ML-сервис. | [GitHub](https://github.com/shilleroff) |
| **Nusipbaev Ibrohimali** | **DevOps / QA Engineer** | Репозиторий и CI/CD (GitHub Actions), контейнеризация Docker Compose, деплойment (Vercel/Cloud), автотесты (Pytest/Vitest), мониторинг. | [GitHub](https://github.com/AAA-sip) |

---

## 💡 Идея и концепция

* **Проблема:** Обычные статичные страницы в Steam/Epic Games не передают атмосферу игр в жанре тёмного фэнтези/стимпанка и не дают достаточного интерактива для привлечения аудитории и инвесторов до официального релиза.
* **Решение:** Промо-сайт G13 с высоким уровнем погружения: интерактивный 3D/2D просмотр отряда из 6 персонажей, конфигуратор боевых механик, асинхронный **AI-консультант** по лору игры (с ответами через SSE) и **ML-модель** рекомендаций предпочтений.
* **Целевая аудитория:** Геймеры 18–30 лет (поклонники *Dishonored, Dark Messiah, Doom*), а также инвесторы и издатели.

---

## 🛠 Ключевой стек технологий

### **Frontend**
* **Фреймворк:** React 18 + Vite
* **Стилизация:** Tailwind CSS + Custom CSS Variables
* **Анимации:** Framer Motion, Lucide Icons
* **3D-просмотр:** React Three Fiber (Three.js) *(с опциональной адаптивной загрузкой)*

### **Backend**
* **Язык & Фреймворк:** Python 3.11+, FastAPI (асинхронные эндпоинты, SSE stream)
* **База данных:** PostgreSQL + Alembic (ORM: SQLAlchemy)
* **Кэширование & Очереди:** Redis (rate-limiting, кэш LLM и ML-рекомендаций)
* **Платежный шлюз:** Stripe API / Kaspi Pay API (Webhook handlers)

### **AI & ML Services**
* **AI-консультант:** LangChain + OpenAI API (`gpt-4o-mini`) / Gemini API (потоковый SSE ответ)
* **ML-модель:** Python (`scikit-learn`, `pandas`) — Content-Based рекомендация контента и персонажей на основе действий пользователя

### **DevOps & Infrastructure**
* **Контейнеризация:** Docker, Docker Compose
* **CI/CD:** GitHub Actions (Linting, Tests, Docker Build)
* **Хостинг:** Vercel Edge (Frontend) + Cloud Container Service (Backend/DB)

---

## 🚀 Запуск MVP (университетская демо-версия)

```bash
docker compose up -d --build
```

- Сайт: **http://localhost:8080**
- API docs (Swagger): **http://localhost:8000/docs**
- Healthcheck: **http://localhost:8080/api/health**

Стек демо: `nginx` (статика + прокси `/api`) → `FastAPI` → `PostgreSQL 16`. Redis не используется.
Схема БД создаётся автоматически при старте (`Base.metadata.create_all`).

### Переменные окружения

Скопируйте `.env.example` в `.env` (файл уже в `.gitignore`):

| Переменная | Назначение |
| :--- | :--- |
| `OPENROUTER` или `OPENROUTER_API_KEY` | ключ OpenRouter для AI-консультанта |
| `OPENROUTER_MODEL` | модель по умолчанию — `openrouter/free` (автовыбор бесплатной модели) |
| `MAIL_DEV_MODE` | `true` — письма пишутся в логи бэкенда; `false` — реальная отправка через Gmail |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | почта и пароль приложения Gmail (нужны только при `MAIL_DEV_MODE=false`) |

### Что работает

1. **Подписка на плейтест** — `POST /api/subscribe`: email сохраняется в PostgreSQL, приветственное письмо уходит через `fastapi-mail` (в демо — в логи контейнера).
2. **Демо-оплата** — `POST /api/checkout` создаёт заказ `pending`, локальная страница `checkout.html` имитирует Stripe Checkout. Тестовая карта `4242 4242 4242 4242` → `POST /api/payments/confirm` (или `/api/payments/webhook/mock`) переводит заказ в `paid` и отправляет чек. Реальные запросы в Stripe не делаются.
3. **AI-консультант по лору** — `POST /api/chat`: стриминг ответа от OpenRouter через OpenAI SDK (SSE-подобный поток). При отсутствии ключа или ошибке провайдера используется локальный ответ по лору.
4. **ML-рекомендации** — `POST /api/recommend`: TF-IDF + косинусная близость (`scikit-learn`) по описаниям шести персонажей и ответам мини-квиза на сайте.
5. **Логи чата** — сообщения сохраняются в таблице `chat_messages`.

### Полезные команды

```bash
docker compose logs -f backend          # письма и отладка
docker compose exec postgres psql -U g13 -d g13 -c "select * from orders;"
docker compose down                     # остановить (данные сохраняются в volume pgdata)
docker compose down -v                  # остановить и удалить данные БД
```



