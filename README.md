# DEVKNOT-WEB

Empowering Seamless Connections for Innovative Collaboration

<p align="center">
  <img src="https://img.shields.io/github/last-commit/TejeswarAchari/devKnot-web?style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/TejeswarAchari/devKnot-web?style=flat-square" />
  <img src="https://img.shields.io/github/languages/count/TejeswarAchari/devKnot-web?style=flat-square" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white" />
  <img src="https://img.shields.io/badge/Markdown-000000?style=flat-square&logo=markdown&logoColor=white" />
  <img src="https://img.shields.io/badge/npm-CB0000?style=flat-square&logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000" />
  <img src="https://img.shields.io/badge/DaisyUI-1ad1a5?style=flat-square" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/date--fns-20232A?style=flat-square" />
</p>

---

## Overview

**DevKnot** is a Tinder-style web app where developers can **discover collaborators**, swipe to match based on tech stack & vibe, and **chat in real time** to start building projects together.

- Frontend: **Vite + React** (this repo)
- Backend: **Node + Express + Socket.io** → [`devKnot`](https://github.com/TejeswarAchari/devKnot)
- DB: **MongoDB Atlas**
- Auth: **JWT (HTTP-only cookies)**
- Deployment:
  - Web → `https://devknot.in` (Vercel)
  - API → `https://devknot-backend.onrender.com` (Render)

---

## Features

- 🔁 Swipe-based matching system  
- 🤝 1:1 matches for collaboration  
- 💬 Realtime chat via Socket.IO  
- 🧑‍💻 Dev-focused profile system  
- 🌗 Responsive UI with Tailwind + DaisyUI  

---

## 🚀 Getting Started — Local Development

Run both **backend + frontend locally** on your system.

---

### 🧰 1. Prerequisites

- Node.js (LTS recommended)
- npm
- Git
- MongoDB Atlas connection string

---

### 🔗 2. Backend Setup (`devKnot`)

Clone + install:

git clone https://github.com/TejeswarAchari/devKnot.git  
cd devKnot  
npm install

Create `.env`:

MONGODB_URI=mongodb+srv://<your-atlas-url>/devKnot  
JWT_SECRET_KEY=TejaSecretKey  
PORT=7777  
CLIENT_ORIGIN=http://localhost:5173  
NODE_ENV=development

Start backend:

npm run dev

Runs at → http://localhost:7777

---

### 🌐 3. Frontend Setup (`devKnot-web`)

Clone + install:

git clone https://github.com/TejeswarAchari/devKnot-web.git  
cd devKnot-web  
npm install

Start frontend:

npm run dev

Runs at → http://localhost:5173

---

### ⚙ 4. How Both Connect Automatically

Inside `src/utils/constants.js`:

const isLocalhost = window.location.hostname === "localhost"  
const LOCAL_URL = "http://localhost:7777/"  
const PROD_URL = "https://devknot-backend.onrender.com/"  
const BASEURL = isLocalhost ? LOCAL_URL : PROD_URL  
export default BASEURL

So:

| Website you open        | Backend used                     |
|-------------------------|----------------------------------|
| http://localhost:5173   | http://localhost:7777            |
| https://devknot.in      | https://devknot-backend.onrender.com |

> **No manual switching needed.**

---

### ✔ Final Checklist

- Backend `.env` created  
- Backend running → `npm run dev`  
- Frontend running → `npm run dev`  
- Open → `http://localhost:5173`

If both run successfully, you can:

- 🔓 Login / Signup  
- 🔁 Swipe developers  
- 🤝 Match  
- 💬 Chat in realtime  

---

🎉 **Your local DevKnot environment is ready to build and contribute!**
