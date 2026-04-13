# OmniBank

A modern financial portal built with TypeScript. Aggregates bank accounts, manages budgets with real-time alerts, and enables crypto exchange with atomic transactions.

## Features

- **Open Banking Dashboard** — View balances and spending across OmniBank, Nordea, and SEB via PSD2 aggregation. Doughnut and bar charts categorize your expenses.
- **Smart Budgeting** — Set monthly limits per category. Get instant push notifications via WebSocket when approaching or exceeding your budget.
- **Crypto Exchange** — Swap SEK to BTC/ETH with live CoinGecko prices. Every exchange is an atomic PostgreSQL transaction with automatic rollback on failure.
- **Audit Ledger** — Immutable, read-only log of all crypto exchanges with unique transaction hashes.
- **Simulated KYC/AML** — Identity verification through mocked mTLS SPAR registry lookup and EU/UN sanctions screening.
- **Light/Dark Mode** — Toggle between themes from the profile page.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, Tailwind CSS, Chart.js, Socket.io Client |
| Backend | Node.js, Express, TypeScript, Clean Architecture |
| Database | PostgreSQL |
| Real-time | Socket.io |
| Testing | Jest (52 unit tests) |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages (static demo) |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+

### 1. Clone and install

```bash
git clone https://github.com/Valmir10/OmniBank.git
cd OmniBank
npm run install:all
```

### 2. Set up the database

```bash
createdb omnibank
psql omnibank < backend/src/infrastructure/database/migrations/001_initial_schema.sql
```

### 3. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set `DB_USER` to your PostgreSQL username (on Mac with Homebrew this is usually your system username). Set `DB_PASSWORD` to empty if no password is configured.

### 4. Start the backend

```bash
cd backend
npm run dev
```

Runs on http://localhost:3001

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Runs on http://localhost:3000

### 6. Run tests

```bash
npm test
```

## Live Demo

The frontend is deployed to GitHub Pages with a demo mode that works without a backend. Register an account and explore all features with mock data.

## Project Structure

```
OmniBank/
├── backend/
│   ├── src/
│   │   ├── domain/          # Entities, repository interfaces
│   │   ├── application/     # Use cases, services, DTOs
│   │   ├── infrastructure/  # Database, external APIs, WebSocket, config
│   │   └── presentation/    # Controllers, routes, middleware
│   └── tests/
└── frontend/
    └── src/
        ├── app/             # Next.js pages (App Router)
        ├── components/      # UI components, charts, layout
        ├── hooks/           # Auth, dashboard, budgets, theme, socket
        ├── services/        # API client
        └── types/           # TypeScript interfaces
```
