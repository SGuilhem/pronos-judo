


# 🥋 Pronos Judo
A web application for managing judo predictions and rankings on live tournament from IJF.

---

## 👀 Overview:
Pronos Judo is a web application that allows users to:

- Predict the outcomes of judo tournaments from IJF.
- View live and archived rankings.
- Manage user accounts and authentication.

---

## ✨ Features:

- User Authentication: Login, register, and password reset functionality.
- Predictions: Submit and manage predictions for ongoing tournaments from IJF.
- Rankings: View live and archived rankings of all the predictions users.

---

## 🛠️ Technologies used:

- Vue.js 3: JavaScript framework for the frontend.
- Tailwind CSS: Utility-first CSS framework.
- Vue Router: Routing management for Vue.js.
- Vuex:	State management library.
- Vite: Fast build tool for Vue.js.
- Node.js (Backend): Backend server.

---

## ⚙️ Setup Instructions:

Prerequisites:
- Node.js (v16 or later)
- npm

Installation: 
    1. Clone the repository:
```
git clone https://github.com/SGuilhem/pronos-judo.git
cd pronos-judo
```

    2. Install dependencies for the frontend:
```
cd frontend
npm install
```

    3. Install dependencies for the frontend:
```
cd ../backend
npm install
```



## 🚀 Running the Application:

Frontend:
    1. Navigate to the 'pronos-judos/frontend' directory:
```
cd frontend
```
    2. Start the development server:

```
npm run serve
```
    3. Open your browser and navigate to: http://localhost:8080


Backend:
    1. Navigate to the 'pronos-judos/backend' directory:
```
cd ../backend
```
    2. Start the development server:
```
npm run dev 
```


## 📂 Project Structure:

pronos-judo/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   ├── pages/            # Page-level components
│   │   ├── router/           # Vue Router configuration
│   │   ├── store/            # Vuex store
│   │   ├── assets/           # Static assets (images, styles)
│   │   └── App.vue           # Root Vue component
│   ├── public/               # Public static files
│   ├── index.html            # Entry HTML file
│   └── tailwind.config.js    # Tailwind CSS configuration
├── backend/                  # Backend code (if applicable)
├── package.json              # Project metadata and dependencies
├── README.md                 # Project documentation
└── .gitignore                # Git ignored files


## 📜 Scripts

Frontend:
- npm run serve    # Démarrer le serveur de développement
- npm run build    # Construire le projet pour la production
- npm run lint     # Vérifier les erreurs de linting

Backend
- npm start     # Démarrer le serveur backend en mode développement