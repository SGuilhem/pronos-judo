import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://pronos-judo.onrender.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;