# KIST Hub 🎓

A campus-exclusive full-stack web platform built for students of **Kiambu Institute of Science and Technology (KIST)**. KIST Hub unifies student life into one secure, verified digital space — a marketplace, lost & found board, real-time messaging system, and an AI-powered campus assistant, all accessible only to verified `@kist.ac.ke` email holders.

---

## The Problem It Solves

Campus life at KIST generates a constant flow of daily interactions that currently happen in scattered, unverified WhatsApp groups and physical notice boards:

- A student wants to sell their laptop before graduating — they post in 5 different WhatsApp groups hoping someone sees it
- A student loses their ID card — there is no central place to check if someone found it
- A fresher needs a second-hand textbook — they ask around for days with no results
- A student wants to message a classmate they just met — they have no way to reach them without a phone number

KIST Hub solves all of this in one place, with one login, trusted by design.

---

## Core Features

### 🛒 Marketplace
Students list items for **sale**, **donation**, or **trade**. Each listing has a title, description, image, category, price, and availability status. Listings are browsable by category, searchable by keyword, and every card links to a full detail page. Owners can mark items as available or unavailable and delete their own listings. Buyers can contact sellers directly through the built-in chat.

### 🔍 Lost & Found
A dedicated board for items found on campus. Finders post what they recovered with a photo and description. Items are categorized (IDs, Keys, Wallets, Gadgets, Bags) for quick filtering. Owners reach out through the messaging system to verify and claim their property.

### 💬 Real-time Chat
Full direct messaging between any two students powered by Socket.io WebSockets. Features include live online/offline presence indicators, unread message counts per conversation, image sharing, message deletion, read receipts (single and double tick), emoji picker, and a conversation list sorted by most recent activity. The chat opens pre-loaded when a student clicks "Contact" on any item.

### 🤖 KistBot — AI Campus Assistant
An agentic AI assistant powered by Google Gemini via LangGraph and LangChain. KistBot has live read access to the campus database through three tools: listing collections, inspecting schemas, and running queries. Students ask in plain English — "Is anyone selling a calculator?", "I lost a black wallet near the cafeteria", "What time does the library close?" — and KistBot queries the real database and responds conversationally. The agent reasons step by step before answering, ensuring it never guesses field names or invents data.

### 👤 Student Profiles
Every student has a profile showing their username, student ID, and profile picture. Profile pictures are uploaded directly to Cloudinary. Students can update their photo, view their own listings, and permanently delete their account.

### 🔐 Full Authentication Flow
Registration, institutional email verification, login, forgot password, and reset password — all fully implemented. Email verification and password reset links are sent via Gmail using Nodemailer and expire after set time windows.

---

## Security Architecture

Security is treated as a first-class concern across every layer of the stack.

| Layer | What is implemented |
|---|---|
| **Institutional access control** | Email regex enforced at the Mongoose schema level — only `@kist.ac.ke` addresses can be stored |
| **Password hashing** | bcryptjs with 10 salt rounds — passwords are never stored in plaintext |
| **JWT via HTTP-only cookies** | Auth tokens are stored in HTTP-only cookies, completely inaccessible to JavaScript |
| **Email verification** | Accounts cannot use the platform until the student clicks a time-limited link sent to their institutional email |
| **Input validation & sanitization** | Every API endpoint is protected by express-validator — inputs are trimmed, type-checked, and escaped before reaching the database |
| **Redis-backed rate limiting** | 100 requests per 15 minutes per IP on all API routes in production, preventing brute-force attacks |
| **Security headers** | Helmet.js sets secure HTTP headers (CSP, X-Frame-Options, HSTS, etc.) on every response |
| **Authorization checks** | Item updates, deletions, and status changes verify the requesting user owns the resource at the controller level |
| **Regex injection prevention** | Search queries sanitize special characters before being used in MongoDB regex patterns |
| **Content Security Policy** | Explicit CSP directives control which domains can serve images, scripts, styles, fonts, and WebSocket connections |

---

## Tech Stack

### Frontend
- **React 19** + **Vite 7** — fast component-based UI with HMR
- **Zustand** — lightweight global state (auth, items, chat, AI)
- **TailwindCSS 4** — utility-first styling
- **Socket.io Client** — real-time bidirectional communication
- **Motion (Framer Motion)** — page transition animations
- **React Router v7** — client-side routing with route-level auth guards
- **Axios** — HTTP client with base URL configuration
- **PWA (vite-plugin-pwa + Workbox)** — installable on Android and iOS, offline asset caching

### Backend
- **Node.js** + **Express 5** — REST API server
- **MongoDB** + **Mongoose** — document database with schema-level validation
- **Socket.io** — WebSocket server for real-time chat and online presence
- **Redis** + **rate-limit-redis** — distributed rate limiting
- **Cloudinary** — image upload, storage, and CDN delivery
- **Nodemailer** — transactional email (verification + password reset via Gmail)
- **bcryptjs** + **jsonwebtoken** — authentication primitives
- **Helmet** + **express-validator** — security hardening
- **cookie-parser** — HTTP-only cookie handling

### AI Service
- **Python** + **FastAPI** — standalone AI microservice on port 8000
- **LangGraph** — stateful agent graph with conditional tool routing
- **LangChain** — tool definitions and LLM orchestration
- **Google Gemini** (via `langchain-google-genai`) — the LLM powering KistBot
- **PyMongo** — direct MongoDB access for the agent's tools
- **Uvicorn** — ASGI server

---

## Project Structure

    campus-hub/
    ├── package.json                  # Root — build and start scripts
    ├── backend/
    │   └── src/
    │       ├── controllers/          # Business logic (auth, items, chat, AI proxy)
    │       ├── models/               # Mongoose schemas (User, Item, Message)
    │       ├── routes/               # Express routers (auth, item, chat, agent)
    │       ├── middleware/           # JWT guard, validators, logger, rate limiter
    │       ├── lib/                  # DB, Socket.io, Cloudinary, email
    │       ├── utils/                # Token and verification code generators
    │       ├── seeder.js             # Database seeder with realistic campus data
    │       └── server.js             # App entry point
    ├── frontend/
    │   └── src/
    │       ├── pages/                # 15 full pages (Marketplace, Chat, KistBot, etc.)
    │       ├── components/           # Reusable UI (Navbar, Chat, ChatBar, Skeletons)
    │       ├── store/                # Zustand stores (auth, items, chat, AI)
    │       └── lib/                  # Axios instance
    └── ai-service/
        ├── agent.py                  # LangGraph agent with MongoDB tools
        └── .env                      # Gemini API key and MongoDB URI

---

## Architecture Flow

    Student opens browser
           │
           ▼
    React SPA (Vite)
           │
    Auth guard checks JWT cookie
           │
    ┌──────┴──────┐
    │             │
    Not authed   Authed
    │             │
    Login/     Home Dashboard
    Register    /     |      \      \
               ▼      ▼       ▼      ▼
           Market  Lost &  Chat  KistBot
           place   Found    │      │
               │      │     │      │
               └──────┴─────┘      │
                      │            ▼
               Express REST    FastAPI
               API (Node.js)   AI Service
                      │            │
               MongoDB Atlas   Gemini LLM
               Cloudinary      (LangGraph)
               Redis

---

## Getting Started

### Prerequisites
- Node.js 18+, Python 3.10+
- MongoDB Atlas cluster (or local MongoDB)
- Redis instance
- Cloudinary account
- Gmail account with App Password enabled
- Google AI Studio API key (for KistBot)

### Installation

    git clone https://github.com/yourusername/campus-hub.git
    cd campus-hub
    npm install --prefix backend
    npm install --prefix frontend
    cd ai-service && pip install -r requirements.txt

### Environment Variables

Create `backend/.env`:

    PORT=5000
    NODE_ENV=development
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    GMAIL_USER=your_gmail@gmail.com
    GMAIL_APP_PASSWORD=your_app_password
    CLIENT_URL=http://localhost:5173

Create `ai-service/.env`:

    MONGODB_URI=your_mongodb_connection_string
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

All seeded accounts use password `Password123`. Sample login: `jack.muriithi@kist.ac.ke`

### Production Build

    npm run build    # builds frontend into dist/
    npm run start    # Express serves the built React app as static files

---

## Deployment

Single-server deployment on **Render**. The Express backend serves the compiled React frontend as static files in production. The AI service runs as a separate Render service.

Build command:

    npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend

Start command:

    npm run start --prefix backend

Set all environment variables in the Render dashboard. Ensure `NODE_ENV=production`.

---

## Progressive Web App

KIST Hub is installable as a PWA on any device. On Android, Chrome shows an "Add to Home Screen" prompt automatically. On iOS Safari, tap Share → Add to Home Screen. Once installed, the app launches without a browser bar, assets load from cache for near-instant startup, and Cloudinary images are cached locally for 30 days.

---

*Built by a KIST student, for KIST students.*
