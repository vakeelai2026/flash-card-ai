# 🃏 FlashyCardy — AI-Powered Flashcard SaaS App

A production-grade, full-stack SaaS application built with **Cursor AI (Vibe Coding)** — no manual boilerplate, just structured AI prompting from blank repo to deployed app.

---

## 🚀 Tech Stack

| Category | Tools |
|---|---|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS, Shadcn UI |
| Database | Neon PostgreSQL, Drizzle ORM |
| Auth & Billing | Clerk, Stripe |
| AI Coding Tool | Cursor AI (Agent Mode + MCP) |
| Deployment | Vercel |

---

## ✨ Features

- 🔐 Full authentication & authorization with **Clerk**
- 💳 Pro subscription & billing system via **Stripe + Clerk**
- 🃏 Create, manage, and organize **decks and flashcards**
- 🎨 Clean, accessible, responsive UI with **Shadcn UI & Tailwind CSS**
- 🗄️ Relational data modelling with **Drizzle ORM + Neon PostgreSQL**
- 🤖 Entire codebase generated using **Cursor AI Agent Mode**
- 🚢 Deployed on **Vercel** with production environment configuration

---

## 🤖 How I Built This (Vibe Coding)

This project was built entirely using **Cursor AI** — no manual coding. I used:

- **Agent Mode** to generate and iterate on features end-to-end
- **Cursor Rules** to enforce consistent, secure, and reliable code output
- **MCP (Model Context Protocol)** to connect directly to Neon PostgreSQL and generate schemas, seed data, and queries through AI

The workflow: prompt → review → steer → ship. No hand-typing boilerplate.

---

## 🗂️ Project Structure

```
├── app/                  # Next.js App Router
├── components/           # Shadcn UI + custom components
├── db/                   # Drizzle ORM schema & migrations
├── lib/                  # Utilities and helpers
├── middleware.ts          # Clerk auth middleware
└── .cursor/rules/        # Cursor AI rules for consistent generation
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/flashycardy.git
cd flashycardy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your keys for:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`
- `DATABASE_URL` (Neon PostgreSQL)
- `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`

### 4. Run database migrations

```bash
npx drizzle-kit push
```

### 5. Start the dev server

```bash
npm run dev
```

---

