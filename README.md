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
| **Serikbaev Rakhat** | **Team Lead / Frontend Developer** | Планирование и координация, UI/UX дизайн-система, React-клиент, интерактивные блоки (слайдеры, табы механик, галерея), интеграция с API. | [Telegram: @akaAFK](https://t.me/akaAFK) / +7 (707) 322-36-07 |
| **Shilleref Ilya** | **Backend Developer** | REST API (FastAPI), проектирование и миграции PostgreSQL, Redis-кэширование, интеграция Stripe/Kaspi Pay, LLM AI-консультант (LangChain), ML-сервис. | GitHub / Email |
| **Nusipbaev Ibrohimali** | **DevOps / QA Engineer** | Репозиторий и CI/CD (GitHub Actions), контейнеризация Docker Compose, деплойment (Vercel/Cloud), автотесты (Pytest/Vitest), мониторинг. | GitHub / Email |

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
ения модели
├── docs/                 # Документация, ER-диаграммы, материалы по лору
│   └── lore/             # Текстовая база знаний для AI-бота
├── docker-compose.yml    # Запуск всей инфраструктуры одной командой
├── .gitignore
└── README.md
```
