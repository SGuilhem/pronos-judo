// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

export const register = (username, password) => {
  return axios
    .post(`${API_URL}register`, { username, password })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const login = (username, password) => {
  return axios
    .post(`${API_URL}login`, { username, password })
    .then(response => {
      localStorage.setItem('token', response.data.token);
      return response.data;
    })
    .catch(error => {
      throw error.response.data;
    });
};

export const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject({ message: 'No token provided' });
    }

    return axios
      .get(`${API_URL}auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return Promise.reject(error.response.data);
      });
  };
