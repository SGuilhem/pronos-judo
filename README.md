# 🥋 Pronos Judo

A web application for managing judo predictions and rankings on live tournaments from IJF.

🌐 **Live app:** [https://pronos-judo.onrender.com](https://pronos-judo.onrender.com)

---

## 👀 Overview

Pronos Judo is a web application that allows users to:
- Predict the outcomes of judo tournaments from IJF.
- View live and archived rankings.
- Manage user accounts and authentication.

---

## ✨ Features

- **User Authentication:** Register, login, and password reset via email.
- **Predictions:** Submit and manage predictions for ongoing IJF tournaments.
- **Rankings:** View live podium and archived rankings across all users.
- **Password Security:** Enforced password rules (length, uppercase, digit, symbol).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Vue.js 3 (Composition API, `<script setup>`) |
| Language | TypeScript |
| Build tool | Vite |
| CSS | Tailwind CSS + scoped styles |
| State management | Pinia |
| Routing | Vue Router 4 |
| HTTP client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Authentication | JWT |
| Email | Resend API |
| Hosting | Render.com |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v20 or later)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SGuilhem/pronos-judo.git
cd pronos-judo
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:8080
```

---

## 🚀 Running the Application

### Frontend
```bash
cd frontend
npm run dev
```
Open your browser at: [http://localhost:5173](http://localhost:5173)

### Backend
```bash
cd backend
npm start
```

---

## 📂 Project Structure

```
pronos-judo/
├── frontend/
│   ├── src/
│   │   ├── components/       # Vue components
│   │   ├── router/           # Vue Router configuration
│   │   ├── stores/           # Pinia stores
│   │   ├── assets/           # Static assets
│   │   ├── axios.ts          # Axios instance
│   │   └── App.vue           # Root component
│   ├── index.html
│   └── vite.config.ts
├── backend/
│   ├── controllers/          # Route controllers
│   ├── models/               # Mongoose models
│   ├── routes/               # Express routes
│   ├── utils/                # Utilities (email, etc.)
│   └── server.js             # Entry point
├── .nvmrc                    # Node.js version (20)
└── README.md
```

---

## 📜 Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Lint the project
```

### Backend
```bash
npm start        # Start backend server
npm run dev      # Start with nodemon (hot reload)
```