// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

export const register = (username, password) => {
  return axios
    .post(`${API_URL}register`, { username, password })
    .then(response => {
      return response.data; // Message ou autre données de réponse
    })
    .catch(error => {
      throw error.response.data; // Renvoyer l'erreur
    });
};

export const login = (username, password) => {
  return axios
    .post(`${API_URL}login`, { username, password })
    .then(response => {
      localStorage.setItem('token', response.data.token); // Stocke le token JWT dans le localStorage
      return response.data; // Message ou autre données de réponse
    })
    .catch(error => {
      throw error.response.data; // Renvoyer l'erreur
    });
};

export const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject({ message: 'No token provided' }); // Si pas de token, on rejette la promesse
    }
  
    return axios
      .get(`${API_URL}auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }, // On envoie le token dans l'en-tête Authorization
      })
      .then(response => {
        // Si le token est valide, on renvoie la réponse du serveur
        return response.data;
      })
      .catch(error => {
        // Si le token est invalide ou expiré, on rejette la promesse
        return Promise.reject(error.response.data);
      });
  };
