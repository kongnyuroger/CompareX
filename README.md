<div align="center">

# 🔍 CompareX

**Search once. Compare everywhere. Powered by AI.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages & Routes](#-pages--routes)
- [Key Components](#-key-components)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)

---

## 🔍 Overview

**CompareX** is a modern, AI-enhanced product comparison platform built with **Next.js 16** and **React 19**. Users search for any product once and instantly receive real-time results pulled simultaneously from Amazon, Walmart, and eBay — ranked by an AI relevance score so the best matches always appear first.

Products stream live to the UI as they are discovered, delivering a Google-like search experience. Authenticated users can revisit their full search history from a persistent sidebar. A responsive, dark-mode-ready design ensures a premium experience on any device.

---

## 📸 Screenshots

> _Add screenshots of your application below._

### 🏠 Home / Search

<!-- Replace the path below with an actual screenshot -->
```
![Home Page Screenshot](./public/screenshots/home.png)
```

---

### 📦 Search Results (Live Stream)

<!-- Replace the path below with an actual screenshot -->
```
![Search Results Screenshot](./public/screenshots/results.png)
```

---

### 🤖 AI Score Overview

<!-- Replace the path below with an actual screenshot -->
```
![AI Score Summary Screenshot](./public/screenshots/ai-scores.png)
```

---

### 📜 Search History Sidebar

<!-- Replace the path below with an actual screenshot -->
```
![Search History Screenshot](./public/screenshots/history.png)
```

---

### 📄 Product Detail Page

<!-- Replace the path below with an actual screenshot -->
```
![Product Detail Screenshot](./public/screenshots/product.png)
```

---

> **Tip:** Take screenshots with `npm run dev` running, then place the images into `public/screenshots/` and remove the surrounding code fences from the markdown above.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Live Streaming Results** | Products appear in real time via Socket.IO as each platform is crawled |
| 🤖 **AI-Powered Ranking** | Every product is scored 0–100 by GPT-4o-mini and sorted by relevance |
| 📊 **Score Comparison View** | Side-by-side breakdown of each product's AI score with reasoning |
| 📜 **Search History** | Authenticated users can reload and review any previous search |
| 🛍️ **Multi-Platform** | Unified results from Amazon, Walmart, and eBay in one view |
| 🌙 **Dark Mode** | Full dark/light theme toggle powered by `next-themes` |
| 📱 **Responsive Design** | Mobile-first layout with adaptive grids |
| 🔐 **Authentication** | JWT-based login/registration with protected routes |
| 🔔 **Toast Notifications** | Contextual feedback via the `sonner` toast library |
| 🎨 **Animated UI** | Lottie animations for loading states and micro-interactions |
| 📄 **Pagination** | Clean pagination for large result sets (6 products per page) |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Component Primitives** | Radix UI (Dialog, Dropdown, Tooltip, Separator) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Real-time** | Socket.IO Client 4 |
| **Animations** | Lottie React, tw-animate-css |
| **Theming** | next-themes |
| **Toasts** | Sonner |
| **Auth** | JWT decode (`jwt-decode`) |
| **Linting/Formatting** | Biome |
| **Git Hooks** | Husky + lint-staged |

---

## 📄 Pages & Routes

| Route | Description |
|---|---|
| `/` | Main search page — hero, search bar, live product grid |
| `/login` | User login form |
| `/register` | User registration form |
| `/product/[id]` | Individual product detail page |
| `/about` | About the project |

---

## 🧩 Key Components

### `<Hero />`
The landing section displayed above the search bar. Contains the app branding, tagline, and a brief explainer of how CompareX works.

### `<ProductGrid />`
Renders a responsive grid of product cards. Optionally overlays AI relevance scores on each card when `showScores` is true, with colour-coded badges (green → excellent, yellow → good, red → poor).

### `<AIScoreSummary />`
A summary panel displayed after a search completes. Shows the distribution of AI relevance scores across all results (excellent / good / fair / poor) with a top-3 ranked product highlight.

### `<ScoreComparisonView />`
A detailed, ranked breakdown view listing all products with their individual AI scores, reasoning strings, price, and source platform — allowing users to compare at a glance without opening individual product pages.

### `<Pagination />`
Stateless pagination control. Takes `currentPage`, `totalPages`, and `onPageChange` props. Renders numbered page buttons with previous/next navigation.

### `<AILoadingComponent />`
A Lottie-powered animated loading screen displayed while the first batch of streamed products is arriving.

### `searchSocketService`
A singleton service (`src/services/searchSocketService.ts`) that manages the Socket.IO connection lifecycle. Exposes:
- `startSearch(query, callbacks, options)` — initiates the search, subscribes to stream events
- `cancelSearch()` — cancels an in-progress search and disconnects cleanly
- `disconnect()` — tears down the socket connection

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20
- A running instance of the [CompareX Server](../comparex-server/README.md) (backend API)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/comparex.git
cd comparex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

> Fill in the values — see [Environment Variables](#-environment-variables) below.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# URL of the CompareX backend API
NEXT_PUBLIC_API_URL=http://localhost:3000

# URL of the Socket.IO server (usually the same as the API)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL for REST API calls (Axios) |
| `NEXT_PUBLIC_SOCKET_URL` | ✅ | Base URL for Socket.IO connection |

> Both variables are prefixed with `NEXT_PUBLIC_` so they are available in client-side code.

---

## 📁 Project Structure

```
CompareX/
├── public/                           # Static assets (icons, images, lottie files)
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (theme, auth provider, sidebar)
│   │   ├── globals.css               # Global Tailwind styles + CSS variables
│   │   ├── page.tsx                  # Home page (search + results)
│   │   ├── about/                    # About page
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── product/                  # Product detail page ([id] dynamic route)
│   │   ├── atoms/                    # Jotai / global state atoms
│   │   ├── components/               # Page-specific components
│   │   │   ├── Hero.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── AIScoreSummary.tsx
│   │   │   ├── ScoreComparisonView.tsx
│   │   │   └── botLoader.tsx         # Lottie loading animation
│   │   ├── services/                 # App-layer API calls (Axios wrappers)
│   │   └── utils/                    # Page-level utility functions
│   ├── components/
│   │   └── ui/                       # Reusable Radix-based UI primitives
│   ├── hooks/                        # Custom React hooks
│   ├── lib/
│   │   └── authProvider.tsx          # Auth context provider (JWT state, user context)
│   └── services/
│       └── searchSocketService.ts    # Socket.IO singleton service
├── biome.json                        # Biome linter/formatter config
├── components.json                   # shadcn/ui config
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS theme config
└── tsconfig.json                     # TypeScript config
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run Biome linter checks |
| `npm run format` | Auto-format all files with Biome |

---

## 🔗 Related

- [CompareX Server (Backend)](../comparex-server/README.md) — The NestJS API powering this frontend

---

<div align="center">

Built with ❤️ using Next.js, React 19 & Tailwind CSS

</div>