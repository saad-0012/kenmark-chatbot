# 🤖 **Kenmark ITan AI Chatbot**

A full-stack AI assistant built for **Kenmark ITan Solutions**, powered by **RAG (Retrieval-Augmented Generation)** to respond using real company knowledge. This chatbot extracts data from Excel files, processes queries, and generates accurate domain-specific responses using a local LLM.

---

## 🚀 Tech Stack

| Category            | Tools                              |
| ------------------- | ---------------------------------- |
| **Framework**       | Next.js 14 (App Router)            |
| **Language**        | TypeScript (TSX)                   |
| **Styling**         | Tailwind CSS (Dark Mode enabled)   |
| **Database/ORM**    | Prisma + SQLite                    |
| **AI Engine**       | Local LLM (Ollama – Mistral Model) |
| **Data Processing** | `xlsx` for Excel extraction        |

---

## ✨ Features

* 🧠 **RAG-Based QA System** – fetches relevant context from `data.xlsx` before LLM generation
* 🛡️ **Business Guardrails** – bot answers only work-related queries (no generic/random questions)
* 📂 **Dynamic Knowledge Base** – update Excel data without touching code
* 💬 **Chat Persistence** – session-based conversation memory
* 📊 **Analytics Ready** – user queries logged into database
* 🌙 **Dark Mode UI** – responsive & clean interface with theme toggle

---

## 🛠️ Setup & Installation

Follow step-by-step to run this project locally.

---

### 1️⃣ Prerequisites

* Node.js **v18+**
* **Ollama** installed locally → *(Required for AI response)*
  👉 [https://ollama.com/](https://ollama.com/)

---

### 2️⃣ Clone Project

```bash
git clone https://github.com/YOUR_USERNAME/kenmark-chatbot.git
cd kenmark-chatbot
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Setup Database

```bash
npx prisma db push
```

### 5️⃣ Generate Knowledge Base

```bash
node scripts/generate-excel.js
```

### 6️⃣ Start LLM (Important)

> Run this in **a separate terminal** and keep it running

```bash
ollama run mistral
```

### 7️⃣ Start Development Server

```bash
npm run dev
```

📍 Visit → [http://localhost:3000](http://localhost:3000)

---

## 🧩 Architecture Overview

```
┌────────────────────────────┐
│  Frontend (Next.js)        │  → UI, chat interface, state handling
│  src/app/page.tsx          │
└───────────────┬────────────┘
                │
┌───────────────▼────────────┐
│  API Layer                  │  → RAG pipeline & message handling
│  src/app/api/chat/route.ts  │
│   • Fetch context from Excel│
│   • Enforce business rules  │
│   • Prompt local LLM        │
└───────────────┬────────────┘
                │
┌───────────────▼────────────┐
│  Knowledge Logic            │ → File I/O + keyword matching
│  src/lib/knowledge.ts       │
└─────────────────────────────┘
```

---

## 📝 Business Compliance Rules

✔ Answers only within **Kenmark ITan Solutions** domain
✔ No general trivia, recipes, unrelated questions
✔ Maintains polite, professional tone
✔ Uses **real scraped company data**: About, Services, Contact

