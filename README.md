# KIST Hub 🎓

A campus-exclusive web platform built for students of **Kiambu Institute of Science and Technology (KIST)**. KIST Hub brings together a student marketplace, lost & found board, and real-time messaging into one secure, verified environment — accessible only to those with an institutional `@kist.ac.ke` email.

---

## Why KIST Hub?

Campus life generates a constant flow of transactions and interactions that currently happen across scattered, unverified WhatsApp groups and notice boards. KIST Hub centralizes this into one trusted space:

- **No more strangers** — every user is a verified KIST student
- **No more lost items disappearing** — a dedicated board connects finders with owners
- **No more middlemen** — students buy, sell, and donate directly to each other
- **No more switching apps** — marketplace, lost & found, and chat all in one place

---

## Features

### 🛒 Marketplace
Students can list items for **sale**, **donation**, or **trade**. Each listing includes a title, description, image, category, and price. Listings can be filtered by category and searched by keyword. Owners can update an item's status (Available / Sold / Claimed) or delete it at any time.

### 🔍 Lost & Found
A dedicated board for items found on campus. Finders post what they've recovered, and owners can reach out directly through the chat system to arrange a return. Items are categorized (IDs, Keys, Wallets, Gadgets, Bags) for quick filtering.

### 💬 Real-time Chat
Direct messaging between any two students powered by Socket.io. Features include live online presence indicators, unread message counts, image sharing, message deletion, and a conversation list sorted by most recent activity.

### 👤 Student Profiles
Each student has a profile with their username, student ID, and profile picture. Profile pictures are uploaded to and served from Cloudinary. Students can edit their profile or permanently delete their account.

### 🔐 Authentication
Full auth flow including registration, email verification, login, forgot password, and reset password — all tied to institutional email addresses.

---

## Security

Security was treated as a first-class concern throughout the build, not an afterthought.

| Layer | Implementation |
|---|---|
| **Institutional access control** | Email regex enforced at the database schema level — only `@kist.ac.ke` addresses can register |
| **Password hashing** | bcryptjs with salt rounds, passwords never stored in plaintext |
| **JWT authentication** | Tokens stored in HTTP-only cookies, never exposed to JavaScript |
| **Email verification** | Accounts remain unverified until the student clicks a time-limited link sent to their institutional email |
| **Input validation** | Every API endpoint is guarded by express-validator — inputs are sanitized, trimmed, and type-checked before reaching the database |
| **Rate limiting** | Redis-backed rate limiter (100 requests per 15 min) on all API routes in production, preventing brute-force attacks |
| **Security headers** | Helmet.js sets secure HTTP headers on every response |
| **Authorization checks** | Item updates, status changes, and deletions verify that the requesting user owns the resource |
| **Regex injection prevention** | Search queries sanitize special characters before being used in MongoDB regex queries |
| **XSS protection** | User-supplied text fields are escaped via express-validator's .escape() |

---

## Tech Stack

### Frontend
- **React** + **Vite** — fast, component-based UI
- **Zustand** — lightweight global state management
- **TailwindCSS** — utility-first styling
- **Socket.io client** — real-time communication
- **Motion** — page transition animations
- **React Router** — client-side routing with auth guards

### Backend
- **Node.js** + **Express 5** — REST API server
- **MongoDB** + **Mongoose** — document database with schema validation
- **Socket.io** — WebSocket server for real-time chat
- **Redis** + **rate-limit-redis** — distributed rate limiting
- **Cloudinary** — image upload and CDN delivery
- **Nodemailer** — transactional email (verification + password reset)
- **bcryptjs** + **jsonwebtoken** — authentication primitives
- **Helmet** + **express-validator** — security hardening

---

## Project Structure

    campus-hub/
    ├── backend/
    │   └── src/
    │       ├── controllers/       # Business logic (auth, items, chat)
    │       ├── models/            # Mongoose schemas (User, Item, Message)
    │       ├── routes/            # Express route definitions
    │       ├── middleware/        # Auth guard, validators, logger, rate limiter
    │       ├── lib/               # DB connection, Socket.io, Cloudinary, email
    │       ├── utils/             # Token and verification code generators
    │       └── server.js          # App entry point
    └── frontend/
        └── src/
            ├── pages/             # Full page components (Marketplace, Chat, etc.)
            ├── components/        # Reusable UI components (Navbar, ChatBar, etc.)
            ├── store/             # Zustand stores (auth, items, chat)
            └── lib/               # Axios instance configuration

---

## Design Flow

    User visits app
          │
          ▼
    Not authenticated? ──► Login / Register ──► Institutional email verified?
                                                          │
                                                  Email verification link
                                                          │
                                                          ▼
                                                   Home Dashboard
                                                  /       |        \
                                                 ▼        ▼         ▼
                                           Marketplace  Lost &    Chat
                                               │        Found       │
                                               │          │         │
                                          Browse/Post  Post/       Direct
                                           items      Browse      message
                                               │      found       any user
                                               │      items          │
                                               └────────┬────────────┘
                                                        │
                                                  Contact owner
                                                via built-in chat

Every page is protected by a client-side auth guard — unauthenticated users are redirected to /login. The backend independently verifies the JWT on every protected API request, so client-side guards are a UX convenience, not a security boundary.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)
- Cloudinary account
- Gmail account with an App Password enabled

### Installation

    # Clone the repo
    git clone https://github.com/yourusername/campus-hub.git
    cd campus-hub

    # Install all dependencies
    npm install --prefix backend
    npm install --prefix frontend

### Environment Variables

Create backend/.env:

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

### Running Locally

    # Start backend
    npm run dev --prefix backend

    # Start frontend (separate terminal)
    npm run dev --prefix frontend

### Production Build

    npm run build --prefix frontend
    npm run start --prefix backend

---

## Deployment

The app is configured for single-server deployment where the Express backend serves the built React frontend as static files. Tested on Render.

Set these environment variables in your hosting dashboard and set NODE_ENV=production.

Build command:

    npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend

Start command:

    npm run start --prefix backend

---

*Built by a KIST student, for KIST students.*
