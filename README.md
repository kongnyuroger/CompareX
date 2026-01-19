# compareX Frontend

compareX is a **real-time product comparison platform** designed to aggregate and stream products from multiple e-commerce sources.
This repository contains the **frontend application**, built with **Next.js**, optimized for real-time updates, scalability, and a smooth user experience.

---

## 🚀 Overview

The compareX frontend is responsible for:

* Displaying live product results as they are streamed from the backend
* Managing user search sessions
* Handling real-time updates via WebSockets
* Providing a clean, responsive, and intuitive UI

The application is designed to work seamlessly with a **Socket.IO-powered backend**, enabling users to see results **progressively** without waiting for a full search to complete.

---

## 🧠 Key Features

* **Real-time product streaming**
* **Incremental UI updates** (no page reloads)
* **Search start / cancel support**
* **Live status indicators** (running, completed, cancelled)
* **Scalable component architecture**
* **Responsive design**

---

## 🛠 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Real-time Communication:** Socket.IO Client
* **State Management:** React Hooks
* **Icons & UI:** Lucide / Custom components

---

## 📁 Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── page.tsx        # Main entry page
│   ├── layout.tsx      # Global layout
│
├── components/         # Reusable UI components
│   ├── ProductGrid.tsx
│   ├── SearchBar.tsx
│   └── StatusIndicator.tsx
│
├── services/           # API & socket services
│   └── socket.ts
│
├── types/              # Shared TypeScript types
│   └── product.ts
│
└── styles/             # Global styles
```

---

## 🔌 Real-Time Architecture

The frontend communicates with the backend using **Socket.IO** to receive live updates.

**High-level flow:**

```
User Action → Socket.IO Event → Live Product Stream → UI Update
```

* Products are appended to the UI as they arrive
* The UI reacts instantly to lifecycle events (start, complete, cancel, error)
* No polling or manual refresh is required

---

## ⚙️ Getting Started

### 1️⃣ Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn
* Running compareX backend server

---

### 2️⃣ Installation

```bash
git clone https://github.com/your-org/comparex-frontend.git
cd comparex-frontend
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

> This should point to the compareX backend Socket.IO server.

---

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Open your browser at:

```
http://localhost:3000
```

---

## 🧪 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linting
```

---

## 🧩 Design Principles

* **Real-time first**: UI reacts to streamed data immediately
* **Separation of concerns**: UI, socket logic, and types are clearly separated
* **Scalable**: Easy to add new features or data sources
* **Maintainable**: Clean, typed, and documented code

---

## 🔐 Security & Performance

* No sensitive logic is handled on the client
* Backend controls all crawling and data validation
* UI updates are batched where possible to reduce re-renders
* Designed to work reliably on unstable networks

---

## 📌 Future Improvements

* Advanced filtering & sorting
* Search history & saved comparisons
* Server-side rendering optimizations
* Internationalization (i18n)
* Accessibility enhancements

---



## 📬 Contact

For questions, feedback, or collaboration, please reach out via the compareX team.

---

**compareX Frontend**
*Real-time product comparison, done right.*
