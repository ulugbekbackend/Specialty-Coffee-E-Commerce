# Ember & Oak — Specialty Coffee E-Commerce

A full-stack storefront for a small-batch coffee roaster: a React 19 (Vite)
frontend backed by a Django 5.2 (DRF) API — catalog browsing, cart, and a
real checkout that persists orders to the database.

## Features

- Browse a roast catalog with roast-level filters, search, and sorting
- Product detail modal with grind selection (whole bean / filter / espresso)
- Persistent cart (localStorage) with free-shipping progress
- Multi-step checkout that creates a real `Order` in the backend
- Django admin for managing products and viewing orders
- **Resilient by design:** if the API is unreachable, the frontend falls
  back to a bundled demo catalog instead of showing a broken page — the
  UI stays fully browsable even with the backend down. Placing a real
  order still requires the backend; the checkout form shows a clear error
  if it can't be reached.

## Tech stack

| | |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Django 5.2, Django REST Framework, SQLite |
| **Other** | django-cors-headers, WhiteNoise, python-decouple |

## Architecture

```
frontend/ (React 19, Vite) ── npm run build ──► frontend/dist/
                                                   ▲
Django 5.2 ── WhiteNoise/templates ────────────────┘  (serves the built SPA)
     ├── GET  /api/products/   product catalog (?roast=…, ?q=…)
     ├── POST /api/orders/     checkout → Order + OrderItem
     ├── GET  /api/health/     liveness check
     └── /admin/               Django admin (products & orders)
```

In dev, the two run separately: Vite serves the frontend on `:5173` with
hot reload, Django serves the API on `:8000`, and `VITE_API_BASE_URL`
tells the frontend where to find it. In production, `npm run build`
outputs to `frontend/dist/`, and Django serves that build directly — no
separate frontend server needed.

## Project structure

```
.
├── backend/              Django project
│   ├── config/            settings, urls, wsgi
│   ├── shop/               models, views, serializers, admin
│   │   └── management/commands/seed_products.py   demo catalog seeder
│   ├── requirements.txt
│   └── .env.example
└── frontend/              React app
    ├── src/
    │   ├── components/     UI components
    │   ├── data/products.ts   bundled demo catalog (offline fallback)
    │   ├── lib/api.ts         fetchCatalog() / createOrder()
    │   └── store.tsx          cart state
    ├── package.json
    └── .env.example
```

## Getting started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env         # generate your own SECRET_KEY before deploying

python manage.py migrate
python manage.py seed_products     # loads the 6-coffee demo catalog (idempotent)
python manage.py createsuperuser   # optional, for /admin

python manage.py runserver
# → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env         # points VITE_API_BASE_URL at the backend

npm run dev
# → http://localhost:5173
```

With both running, the frontend talks to the real backend. Stop the
backend and the frontend keeps working off its bundled demo data — that's
the fallback behavior described above.

### Production build

```bash
cd frontend && npm run build       # outputs to frontend/dist/
cd ../backend
python manage.py collectstatic
python manage.py runserver         # Django now serves the built SPA too
```

Before deploying, set `DEBUG=False`, a fresh `SECRET_KEY`, and real
`ALLOWED_HOSTS` in `backend/.env`.

## Environment variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key (generate a new one, never reuse the dev value) |
| `DEBUG` | `True` in development, `False` in production |
| `ALLOWED_HOSTS` | Comma-separated hostnames Django will serve |
| `CORS_ALLOWED_ORIGINS` | Origins allowed to call the API (the Vite dev URL) |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Django API (e.g. `http://localhost:8000`). Note: this value is baked into the production build too — if you deploy the built SPA somewhere other than this same backend URL, rebuild with the correct value first. |

Real `.env` files are gitignored — copy the `.env.example` files and fill
in your own values.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products/` | List products (`?roast=light\|medium\|dark\|decaf`, `?q=search`) |
| `GET` | `/api/products/{sku}/` | Single product |
| `POST` | `/api/orders/` | Create an order — `{name, email, address, city, zip, items: [{sku, grind, quantity}]}` |
| `GET` | `/api/health/` | `{status, products}` |

## License

Personal / portfolio project.
