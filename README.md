# KIST Hub 🎓

A campus-exclusive full-stack web platform built for students of **Kiambu Institute of Science and Technology (KIST)**. KIST Hub unifies student life into one secure, verified digital space — a marketplace, lost & found board, real-time messaging, M-Pesa payments, a shopping cart, and an AI-powered campus assistant. Access is restricted to verified `@kist.ac.ke` institutional email holders.

---

## The Problem It Solves

Campus life at KIST generates a constant flow of daily interactions that currently have no proper home:

- Students sell laptops and textbooks across unverified WhatsApp groups visible to outsiders
- Lost ID cards and wallets have no central reporting board — they simply disappear
- Students have no way to message a classmate without already having their number
- Paying for a secondhand item means meeting in person with cash and hoping for the best

KIST Hub solves all of this in one place, with one login, trusted by design.

---

## Features

### 🛒 Marketplace
List items for **sale**, **donation**, or **return**. Each listing has a title, description, image, category, price and availability status. Browse by category, search by keyword, click any card for the full detail page. Owners can toggle availability or delete their listings.

### 🔍 Lost & Found
A dedicated board for items found on campus. Finders post what they recovered with a photo and description. Items are filtered by category — IDs, Keys, Wallets, Gadgets, Bags. Owners reach out through the built-in chat to verify and claim.

### 🛒 Cart
Students save items they're interested in to a persistent cart. The Navbar shows a live badge with the item count. From the cart, each item can be paid for individually via M-Pesa or removed. A sticky order summary shows the running total.

### 💳 M-Pesa Payments (Safaricom STK Push)
Pay for any item directly through M-Pesa without leaving the platform. An STK push is sent to the buyer's phone, they enter their PIN, and the payment is recorded. A full payment history shows sent and received transactions with status (Pending, Success, Failed), receipt numbers, and timestamps.

### 💬 Real-time Chat
Full direct messaging between any two students via Socket.io WebSockets. Features include live online/offline presence, unread message counts, image sharing, message deletion with read receipts, emoji picker, and a conversation list sorted by most recent activity. Opens pre-loaded when clicking Contact on any item.

### 🤖 KistBot — AI Campus Assistant
An agentic AI assistant powered by Google Gemini via LangGraph and LangChain. KistBot has live read access to the campus database through three tools: listing collections, inspecting schemas, and running queries. Students ask in plain English — *"Is anyone selling a calculator?"*, *"I lost a black wallet near the cafeteria"*, *"What time does the library close?"* — and get real, accurate responses.

### 👤 Student Profiles
Profile page with cover photo, avatar, listings tab, and a payments summary tab. Students can update their profile picture via Cloudinary, edit their username, and permanently delete their account.

### 🔐 Full Authentication Flow
Register, verify email, login, forgot password, reset password — all fully implemented with time-limited tokens delivered to the institutional email via Nodemailer/Gmail.

### 📱 Progressive Web App
Installable on any Android or iOS device. No app store required. Assets are cached via Workbox for near-instant load times on repeat visits. Cloudinary images cached locally for 30 days.

---

## Security

| Layer | Implementation |
|---|---|
| **Institutional access control** | Email regex enforced at the Mongoose schema level — only `@kist.ac.ke` addresses can register |
| **Password hashing** | bcryptjs with 10 salt rounds — passwords never stored in plaintext |
| **JWT via HTTP-only cookies** | Auth tokens in HTTP-only cookies, invisible to JavaScript |
| **Email verification** | Accounts locked until student clicks a 24-hour time-limited link |
| **Input validation** | express-validator guards every endpoint — trimmed, typed, escaped |
| **Redis rate limiting** | 100 requests per 15 minutes per IP in production |
| **Security headers** | Helmet.js sets CSP, X-Frame-Options, HSTS and more on every response |
| **Authorization checks** | Item mutations and cart deletions verify ownership before proceeding |
| **Regex injection prevention** | Search queries sanitize special characters before MongoDB regex use |
| **M-Pesa sender trust** | `senderId` always taken from the authenticated JWT, never from the request body |

---

## Tech Stack

### Frontend
- **React 19** + **Vite 7** — fast SPA with HMR
- **Zustand** — global state (auth, items, chat, cart, payments, AI)
- **TailwindCSS 4** — utility-first styling
- **Socket.io Client** — real-time WebSocket communication
- **Motion** — page and component animations
- **React Router v7** — client-side routing with auth guards
- **Axios** — HTTP client
- **vite-plugin-pwa + Workbox** — PWA and offline caching

### Backend
- **Node.js** + **Express 5** — REST API
- **MongoDB** + **Mongoose** — document database
- **Socket.io** — WebSocket server for chat and presence
- **Redis** + **rate-limit-redis** — distributed rate limiting
- **Cloudinary** — image upload and CDN
- **Nodemailer** — transactional email via Gmail
- **bcryptjs** + **jsonwebtoken** — auth primitives
- **Helmet** + **express-validator** — security hardening
- **Axios** — M-Pesa API proxy calls

### AI Service
- **Python** + **FastAPI** — standalone microservice
- **LangGraph** — stateful agent with conditional tool routing
- **LangChain** — tool definitions and LLM orchestration
- **Google Gemini** — the LLM powering KistBot
- **PyMongo** — direct MongoDB access for agent tools
- **Uvicorn** — ASGI server

---

## Project Structure

    campus-hub/
    ├── package.json                   # Root build and start scripts
    ├── backend/
    │   └── src/
    │       ├── controllers/           # auth, items, chat, cart, payments, mpesa, AI proxy
    │       ├── models/                # User, Item, Message, Cart, Payment
    │       ├── routes/                # auth, item, chat, cart, payment, mpesa, agent
    │       ├── middleware/            # JWT guard, validators, logger, rate limiter
    │       ├── lib/                   # DB, Socket.io, Cloudinary, email, M-Pesa
    │       ├── utils/                 # Token and code generators
    │       ├── seeder.js              # Realistic campus seed data
    │       └── server.js             # App entry point
    ├── frontend/
    │   └── src/
    │       ├── pages/                 # 17 pages — Marketplace, Chat, Cart, Payments, KistBot...
    │       ├── components/            # Navbar, Chat, ChatBar, MpesaModal, Skeletons...
    │       ├── store/                 # auth, items, chat, cart, payments, AI
    │       └── lib/                   # Axios instance
    └── ai-service/
        ├── agent.py                   # LangGraph agent with 3 MongoDB tools
        └── .env                       # Gemini API key + MongoDB URI

---

## Getting Started

### Prerequisites
- Node.js 18+, Python 3.10+
- MongoDB Atlas cluster
- Redis instance
- Cloudinary account
- Gmail with App Password
- Google AI Studio API key
- Safaricom Developer account (sandbox for M-Pesa)

### Installation

    git clone https://github.com/yourusername/campus-hub.git
    cd campus-hub
    npm install --prefix backend
    npm install --prefix frontend
    cd ai-service && pip install -r requirements.txt

### Environment Variables

`backend/.env`:

    PORT=5000
    NODE_ENV=development
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    GMAIL_USER=your_gmail@gmail.com
    GMAIL_APP_PASSWORD=your_app_password
    CLIENT_URL=http://localhost:5173
    MPESA_CONSUMER_KEY=your_consumer_key
    MPESA_CONSUMER_SECRET=your_consumer_secret
    MPESA_SHORTCODE=your_shortcode
    MPESA_PASSKEY=your_passkey
    MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

`ai-service/.env`:

    MONGODB_URI=your_mongodb_uri
    GOOGLE_API_KEY=your_gemini_api_key

### Running Locally

    # Terminal 1 — Backend
    npm run dev --prefix backend

    # Terminal 2 — Frontend
    npm run dev --prefix frontend

    # Terminal 3 — AI Service
    cd ai-service && uvicorn agent:app --port 8000 --reload

### Seed the Database

    npm run seed --prefix backend

All seeded accounts use password `Password123`.
Sample login: `jack.muriithi@kist.ac.ke`

### Production Build

    npm run build    # compiles frontend into dist/
    npm run start    # Express serves React as static files

---

## Deployment

Deployed on **Render** as a single web service. Express serves the compiled React frontend as static files in production. The Python AI service runs as a separate Render service.

Build command:

    npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend

Start command:

    npm run start --prefix backend

Set all environment variables in the Render dashboard. Set `NODE_ENV=production`.

---

*Built by a KIST student, for KIST students.*
